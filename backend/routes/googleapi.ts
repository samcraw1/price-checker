import { Router } from 'express';
import { google } from 'googleapis';
import type { gmail_v1 } from 'googleapis';
import type { Credentials } from 'google-auth-library';
import { ErrorCodeForDebugging } from '../types';


const googleApiRouter = Router();

let savedTokens: Credentials | undefined;

const decode = (data: string) => Buffer.from(data, 'base64url').toString('utf-8');

// Prefer text/html, fall back to text/plain; walks nested multipart parts.
function extractBody(part?: gmail_v1.Schema$MessagePart): string | null {
    if (!part) return null;
    const find = (p: gmail_v1.Schema$MessagePart, mime: string): string | null => {
        if (p.mimeType === mime && p.body?.data) return decode(p.body.data);
        for (const child of p.parts ?? []) {
            const found = find(child, mime);
            if (found) return found;
        }
        return null;
    };
    return find(part, 'text/html') ?? find(part, 'text/plain') ?? (part.body?.data ? decode(part.body.data) : null);
}

const header = (msg: gmail_v1.Schema$Message, name: string) =>
    msg.payload?.headers?.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? undefined;

// Gmail message -> the Email shape the frontend expects.
function toEmail(msg: gmail_v1.Schema$Message, body: string) {
    const isHtml = /<[a-z][\s\S]*>/i.test(body);
    const safeBody = isHtml || !body
        ? body
        : `<pre style="white-space:pre-wrap;font-family:sans-serif">${body.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
    return {
        id: msg.id ?? '',
        sentFrom: header(msg, 'From') ?? '',
        sentTo: header(msg, 'To') ?? '',
        cc: header(msg, 'Cc'),
        subject: header(msg, 'Subject') ?? '(no subject)',
        snippet: msg.snippet ?? '',
        body: safeBody,
        sentAt: new Date(Number(msg.internalDate ?? Date.now())).toISOString(),
        isRead: !(msg.labelIds ?? []).includes('UNREAD'),
    };
}

function getClientCredentials() {
    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Google API client configuration is missing'
        };
        throw new Error(body.message);
    }
    if (savedTokens) {
        client.setCredentials(savedTokens);
    }
    return client;
}

googleApiRouter.get('/auth/google', (request, response) => {
    const url = getClientCredentials().generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: [ 'https://www.googleapis.com/auth/gmail.readonly']
    });
    if( !url) {
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Failed to generate Google auth URL'
        };
        return response.status(body.code).json(body);
    }
    response.redirect(url);
});

googleApiRouter.get('/auth/google/callback', async (request, response) => {
    const { code } = request.query;
    if(!code) {
        const body: ErrorCodeForDebugging = { 
            code: 400,
            message: 'Authorization code not provided'
        }
        return response.status(body.code).json(body)
    }
    try {
        const client = getClientCredentials();
        const { tokens } = await client.getToken(code as string);
        savedTokens = tokens;
        response.redirect('http://localhost:5173/email');
    } catch (error) {
        response.status(400).json({ error: "token exchange failed" });
    }
}); 

googleApiRouter.get('/auth/status', (request, response) => {
    response.json({ connected: !!savedTokens });
})

googleApiRouter.get('/emails', async (request, response) => {
    if(!savedTokens){
        const body: ErrorCodeForDebugging = {
            code: 401,
            message: 'Not connected to Google API'
        }
        return response.status(body.code).json(body);
    }
    try {
        const gmail = google.gmail({ version: 'v1', auth: getClientCredentials() });
        const gmailList = await gmail.users.messages.list({ userId: 'me', maxResults: 20 });
        const messages = await Promise.all(
            (gmailList.data.messages ?? []).map(async (m) => {
                const full = await gmail.users.messages.get({
                    userId: 'me',
                    id: m.id!,
                    format: 'metadata',
                    metadataHeaders: ['From', 'To', 'Cc', 'Subject'],
                });
                return toEmail(full.data, '');
            })
        );
        response.json(messages);
    } catch (error) {
        const body: ErrorCodeForDebugging = {
            code: 500,
            message: 'Failed to fetch emails from Google API'
        };
        return response.status(body.code).json(body);
    }

}); 

googleApiRouter.get('/emails/:id', async (request, response) => {
    if(!savedTokens){
        const body: ErrorCodeForDebugging = {
            code: 401,
            message: 'Not connected to Google API'
        }
        return response.status(body.code).json(body)
    }

    try{
        const gmail = google.gmail({ version: 'v1', auth: getClientCredentials() });
        const gmailBody = await gmail.users.messages.get({ userId: 'me', id: request.params.id, format: 'full' });
        response.json(toEmail(gmailBody.data, extractBody(gmailBody.data.payload) ?? ''));
    }catch(error){
        const allowedErrorCodes = [400, 401, 403, 404, 409, 500] as const;
        const statusCode = (error as { code?: number }).code;
        const body: ErrorCodeForDebugging ={
            code: allowedErrorCodes.find(code => code === statusCode) ?? 500,
            message: error instanceof Error? error.message : 'Failed to fetch email',
        }
        return response.status(body.code).json(body);
    }

});



export default googleApiRouter;