import { Router } from 'express';
import { fetchTranscript, toPlainText } from 'youtube-transcript-plus';
import pool from '../db';
import { YoutubeConversionRow, toYoutubeConversion } from '../types';

const router = Router();

function decodeHtmlEntities(text: string): string {
    return text
        .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
        .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
        .replace(/&amp;/g, '&');
}

async function processConversion(id: number, url: string) {
    try {
        await pool.query('UPDATE youtube_conversions SET status = $1, updated_at = now() WHERE id = $2', ['processing', id]);
        const result = await fetchTranscript(url, { videoDetails: true });
        const plainText = decodeHtmlEntities(toPlainText(result.segments));
        await pool.query(
            'UPDATE youtube_conversions SET status = $1, transcript = $2, youtube_name = $3, updated_at = now() WHERE id = $4',
            ['complete', plainText, result.videoDetails.title, id]
        );
    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Failed to fetch transcript';
        await pool.query(
            'UPDATE youtube_conversions SET status = $1, error = $2, updated_at = now() WHERE id = $3',
            ['failed', message, id]
        );
    }
}

router.post('/youtube-convert', async (request, response) => {
    const { url } = request.body as { url?: string };

    if (!url) {
        response.status(400).send('Bad Request');
        return;
    }

    
    try {
        const result = await pool.query<YoutubeConversionRow>(
            'INSERT INTO youtube_conversions (url, status, youtube_name) VALUES ($1, $2, $3) RETURNING *',
            [url, 'pending', url]
        );
        const conversion = toYoutubeConversion(result.rows[0]);
        response.status(202).json(conversion);

        processConversion(conversion.id, url);
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

router.get('/youtube-convert/:id', async (request, response) => {
    const { id } = request.params;

    try {
        const result = await pool.query<YoutubeConversionRow>(
            'SELECT * FROM youtube_conversions WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            response.status(404).send('Not Found');
            return;
        }

        response.json(toYoutubeConversion(result.rows[0]));
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

router.get ("/youtube-convert", async (request, response) => {
    try {
        const result = await pool.query<YoutubeConversionRow>(
            'SELECT * FROM youtube_conversions ORDER BY id DESC',
            );
        response.json(result.rows.map(toYoutubeConversion))
        
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

export default router;
