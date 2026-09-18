# ASTRA 2K26 — Faculty Digital Signature & Attendance System

A faculty check-in flow: scan the event QR → pick your name → sign on
screen → get a confirmation. Built as React (Vite) frontend + FastAPI
backend + SQLite storage.

## Project structure

```
ASTRA-FACULTY-SIGNATURE/
├── frontend/                  React + Vite app
│   ├── src/
│   │   ├── components/        Header, SceneBackground, Robot, Buttons, SignatureCanvas
│   │   ├── pages/              Welcome, FacultySelect, Signature, Success
│   │   ├── services/api.js    All backend calls go through here
│   │   ├── fonts/Woblo.woff   ← add your Woblo font file here (see note in that folder)
│   │   ├── App.jsx / App.css  Router + shared typography classes
│   │   └── index.css          Design tokens (colors, fonts, @font-face)
│   └── .env.example           Copy to .env to set VITE_API_URL
└── backend/                   FastAPI app
    ├── main.py                 API endpoints
    ├── database.py             SQLite engine/session + seed data
    ├── models.py                Faculty table definition
    └── schemas.py               Request/response validation
```

## Running the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

This starts the API at `http://localhost:8000` and creates `astra.db`
(SQLite) in the `backend/` folder on first run, seeded with 5 example
faculty. Visit `http://localhost:8000/docs` for interactive API docs.

## Running the frontend

```bash
cd frontend
npm install
cp .env.example .env            # adjust VITE_API_URL if needed
npm run dev
```

Visit the printed `localhost` URL. To test on a phone on the same WiFi,
use the "Network" URL Vite prints (it's already configured with
`host: true`), and set `VITE_API_URL` in `.env` to your computer's LAN IP,
e.g. `http://192.168.1.20:8000`, then restart `npm run dev`.

## How the faculty flow works

1. **Welcome** (`/`) — landing screen, "Continue" goes to name selection.
2. **Select Your Name** (`/select`) — loads the faculty list from
   `GET /faculty`, with instant client-side search/filter.
3. **Signature** (`/signature/:id`) — loads that faculty member's details
   and current status. If they've already signed, shows "Signature
   Already Recorded" with the original timestamp instead of the canvas.
   Otherwise shows the signature pad; "Submit" is rejected client-side if
   the canvas is empty, and server-side (409 Conflict) if a duplicate
   submission slips through a race condition.
4. **Success** (`/success/:id`) — only reached after a successful
   `POST /faculty/{id}/signature` response.

## Where data is stored

- **Faculty records** live in the `faculty` table inside
  `backend/astra.db` (SQLite). Fields: `id`, `name`, `department`,
  `email`, `has_signed`, `signature`, `signed_at`.
- **Signatures** are stored as Base64 PNG data URLs directly in the
  `signature` column, alongside a UTC `signed_at` timestamp.

## Adding new faculty

Simplest option: add rows to `SEED_FACULTY` in `backend/database.py`
before the database file exists (it only seeds an empty table). Once
`astra.db` already exists, add faculty directly via SQL/a SQLite browser,
or add a small `POST /faculty` admin endpoint if you'll be doing this
often — the model and schema are already in place for it.

## Changing the API URL

Edit `VITE_API_URL` in `frontend/.env` (copy `.env.example` first) to
point at wherever the backend is running — localhost for development, or
your deployed backend's URL in production. The frontend never hardcodes
this value; it always reads from `import.meta.env.VITE_API_URL`
(see `frontend/src/services/api.js`).

## Testing the complete flow

1. Start the backend, confirm `http://localhost:8000/docs` loads.
2. Start the frontend, open it in a browser.
3. Click through Welcome → Select a name → draw a signature → Submit.
4. Confirm the Success screen appears and shows the faculty's first name.
5. Go back to `/select`, pick the same name again — you should now see
   "Signature Already Recorded" with a timestamp instead of the pad.
6. Try Submit with an empty canvas — you should see the inline error
   message, not a browser alert.
7. Stop the backend and try loading `/select` — you should see an
   inline "couldn't reach the server" message rather than a crash.
8. Resize the browser (or open dev tools' device toolbar) down to
   320px width and confirm no horizontal scrolling and the same visual
   language throughout.

## Notes

- The Woblo font file itself isn't included — drop `Woblo.woff` into
  `frontend/src/fonts/` (see the note file already there). The
  `@font-face` declaration and `.woblo-font` class are already wired up
  in `index.css` and used only on the ASTRA 2K26 wordmark in
  `Header.jsx`; until the file is added, that text simply falls back to
  the sans-serif font.
- CORS is currently wide open (`allow_origins=["*"]`) in
  `backend/main.py` for ease of local + phone testing. Restrict this to
  your real frontend origin before any public deployment.
