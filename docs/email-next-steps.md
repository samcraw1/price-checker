# Email Module: What's Next

## Done (frontend)
- `/email` route and sidebar link
- `EmailDashboard` holds `emails` and `selectedId`
- `EmailList` / `EmailRow`: inbox list with selected highlight
- `EmailViewer`: full email, body in sandboxed iframe
- `ConnectGmailButton`: links to `/api/auth/google` (placeholder route)
- Two-pane layout styles in `App.css`

## Backend (blocks the frontend work below)
1. Google Cloud: create project, enable Gmail API, create OAuth client, add self as test user.
2. Add `googleapis` to `backend/`.
3. New route file in `backend/routes/`:
   - `GET /api/auth/google`: redirect to Google consent (scope `gmail.readonly`).
   - `GET /api/auth/google/callback`: exchange code, store refresh token.
   - `GET /api/auth/status`: `{ connected: boolean }`.
   - `GET /api/emails`: list messages (id, from, subject, snippet, date).
   - `GET /api/emails/:id`: full message with body.
4. Keep client secret and tokens in backend `.env` only.

## Frontend
1. `api.ts`: add `fetchEmails()`, `fetchEmail(id)`, `fetchAuthStatus()`. Remove the leftover `emailChecker`.
2. `EmailDashboard`:
   - Fetch list in `useEffect`; restore `setEmails`.
   - Fetch full body when `selectedId` changes (list only has snippets).
   - Use `LoadingState`, `ErrorMessage`, `EmptyState` from `Feedback`.
3. Show `ConnectGmailButton` only when `fetchAuthStatus()` says not connected.
4. Update the Connect button `href` to match the real backend route.
5. Decode the Gmail body (base64url, HTML vs plain text) before passing to the iframe.

## Types
- `Email` needs a snippet field (list view) and maybe `isRead`.
- `NewEmail` and `EmailStatus` are unused. Remove them or use them for compose.

## Later / optional
- Mark read/unread, refresh button, search, pagination
- Compose and send (needs `gmail.send` scope)
- Auto-size iframe height to its content
- Mobile: open the viewer full-screen on select

## Cleanup
- Decide on "Sidebar" vs "Personal" brand text in `Sidebar.tsx` and `MobileNav.tsx`.
- Stray blank line in `PriceTrackerDashboard.tsx`.
