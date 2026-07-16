<<<<<<< HEAD
# Spring Audio Transcriber

Upload audio files and convert them to text using **Spring AI** on the backend and a **React** frontend. Transcription runs through [Groq's free Whisper API](https://console.groq.com) — no credit card required.

## Stack

- **Backend:** Spring Boot 3.4, Spring AI (OpenAI-compatible transcription)
- **Frontend:** React + Vite
- **Transcription:** Groq `whisper-large-v3-turbo` (free tier)

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18+
- A free [Groq API key](https://console.groq.com/keys)

## Get a free Groq API key

1. Sign up at [console.groq.com](https://console.groq.com)
2. Go to **API Keys** and create a key
3. Copy the key (starts with `gsk_`)

Free tier limits: 20 requests/min, 2,000 requests/day, 25 MB max file size.

## Setup

### 1. Set your API key

**Windows (PowerShell):**

```powershell
$env:GROQ_API_KEY = "gsk_your_key_here"
```

**macOS / Linux:**

```bash
export GROQ_API_KEY=gsk_your_key_here
```

You can also copy `backend/.env.example` to `backend/.env` and load it with your shell or IDE.

### 2. Start the backend

```bash
cd backend
mvn spring-boot:run
```

The API runs at `http://localhost:8080`.

### 3. Start the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API

`POST /api/transcribe`

- **Content-Type:** `multipart/form-data`
- **Field:** `file` (audio file, max 25 MB)

**Response:**

```json
{
  "text": "Transcribed text here...",
  "filename": "recording.mp3"
}
```

## Project structure

```
spring-audio-transcriber/
├── backend/          # Spring Boot + Spring AI
│   └── src/main/java/com/example/transcriber/
└── frontend/         # React UI
    └── src/App.jsx
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `401 Unauthorized` | Check that `GROQ_API_KEY` is set correctly |
| `400 Bad Request` | File too large or unsupported format |
| CORS errors | Ensure backend is on port 8080 and frontend on 5173 |
| Rate limit errors | Wait a minute — Groq free tier is 20 req/min |

## License

MIT
=======
# SpringBoot
>>>>>>> 6fe5863ba7d39c7bc13b820d2ee4f3a3e5562826
