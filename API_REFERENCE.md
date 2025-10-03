# MindSphere API Reference

> **Quick reference for all API endpoints**

## Base URL
```
http://localhost:8000
```

## Authentication
No authentication required for development. All endpoints accept requests without headers.

---

## 🎯 Session Management

### Create Session
```http
POST /api/v1/session/create
Content-Type: application/json

{
  "kind": "meditation" | "sleep_story",
  "mood": "calm" | "anxious" | "sad" | "stressed",
  "duration": 1-60,
  "user_notes": "Optional notes",
  "user_name": "User's name"
}
```

**Response:**
```json
{
  "session_id": "143",
  "status": "created"
}
```

### Generate Script
```http
POST /api/v1/session/{id}/generate-script
```

**Response:**
```json
{
  "session_id": "143",
  "status": "script_generated",
  "script_content": "<speak><prosody rate=\"x-slow\">...</prosody></speak>",
  "session_name": "Soft Lullabies of a Gentle Night"
}
```

### Generate Audio
```http
POST /api/v1/session/{id}/generate-audio
```

**Response:**
```json
{
  "session_id": "143",
  "status": "audio_generated",
  "audio_url": "https://storage.../143.mp3",
  "duration_sec": 162
}
```

### Get Session
```http
GET /api/v1/session/{id}
```

### Submit Feedback
```http
POST /api/v1/session/{id}/feedback
Content-Type: application/json

{
  "rating": 1-3,
  "feedback": "Optional text feedback"
}
```

---

## 📊 Analytics & Usage

### Daily Usage
```http
GET /api/v1/usage/daily?user_id={user_id}&from={date}&to={date}&kind={type}
```

**Parameters:**
- `user_id` (required): User identifier
- `from` (optional): Start date (YYYY-MM-DD)
- `to` (optional): End date (YYYY-MM-DD)
- `kind` (optional): "meditation" | "sleep_story"

**Response:**
```json
{
  "first_use_date": "2025-01-15",
  "days": [
    {"date": "2025-01-15", "sessions": 2, "minutes": 10}
  ],
  "streaks": {"current": 5, "best": 12},
  "analytics": {
    "totalSessions": 15,
    "totalMinutes": 75,
    "completionRate": 85.5,
    "avgSessionDuration": 5.0,
    "longestBreak": 2
  }
}
```

### Sessions Library
```http
GET /api/v1/library?user_id={user_id}&kind={type}&from={date}
```

**Parameters:**
- `user_id` (required): User identifier
- `kind` (optional): "meditation" | "sleep_story" - filters by session type
- `from` (optional): Start date (YYYY-MM-DD)
- `q` (optional): Search query for mood, session name, or user notes

**Response:**
```json
[
  {
    "id": "143",
    "created_at": "2025-01-20T10:30:00Z",
    "kind": "meditation",
    "mood": "anxious",
    "duration_sec": 300,
    "audio_url": "https://storage.../143.mp3"
  }
]
```

**Note:** The `kind` parameter properly filters sessions by type, and the frontend now correctly displays metrics, list, and mood chips based on the selected session type.

---

## 📝 Notes & Vector Search

### List Notes
```http
GET /api/v1/notes?user_id={user_id}
```

### Create Note
```http
POST /api/v1/notes
Content-Type: application/json

{
  "user_id": "user-123",
  "kind": "prompt" | "journal" | "voice_note",
  "text": "Note content",
  "mood": "calm"
}
```

### Get Note
```http
GET /api/v1/notes/{id}
```

### Update Note
```http
PUT /api/v1/notes/{id}
Content-Type: application/json

{
  "text": "Updated content",
  "mood": "anxious"
}
```

### Delete Note
```http
DELETE /api/v1/notes/{id}
```

### Similarity Search
```http
POST /api/v1/notes/similarity
Content-Type: application/json

{
  "user_id": "user-123",
  "query": "Search text",
  "limit": 5
}
```

---

## 📖 Journaling

### Submit Journal
```http
POST /api/v1/journal/submit
Content-Type: application/json

{
  "text": "Journal entry text",
  "user_id": "user-123",
  "session_id": "143"
}
```

**Response:**
```json
{
  "summary": "AI-generated summary",
  "emotions": ["anxious", "relieved"],
  "stored": true
}
```

---

## 🔥 Streaks

### Get Streaks
```http
GET /api/v1/streaks/{user_id}
```

**Response:**
```json
{
  "user_id": "user-123",
  "current_streak": 5,
  "best_streak": 12,
  "last_entry_date": "2025-01-20"
}
```

### Update Streak
```http
POST /api/v1/streaks/{user_id}
Content-Type: application/json

{
  "increment": true
}
```

---

## 🎵 Voice & Audio

### Transcribe Audio
```http
POST /api/v1/voice/transcribe
Content-Type: multipart/form-data

file: audio_file.mp3
```

---

## 📚 Quotes

### Get Quotes
```http
GET /api/v1/quotes
```

**Response:**
```json
{
  "quote": "Every being wants to be happy and free from pain.",
  "author": "Jain Philosophy",
  "category": "mindfulness"
}
```

---

## 🔧 Utility

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "ts": "2025-01-21T12:59:02.857Z"
}
```

---

## 🧪 Testing Examples

### Complete Session Flow
```bash
# 1. Create session
curl -X POST http://localhost:8000/api/v1/session/create \
  -H "Content-Type: application/json" \
  -d '{"kind":"sleep_story","mood":"calm","duration":2,"user_name":"TestUser"}'

# 2. Generate script (replace 143 with actual session ID)
curl -X POST http://localhost:8000/api/v1/session/143/generate-script

# 3. Generate audio
curl -X POST http://localhost:8000/api/v1/session/143/generate-audio

# 4. Submit feedback
curl -X POST http://localhost:8000/api/v1/session/143/feedback \
  -H "Content-Type: application/json" \
  -d '{"rating":3,"feedback":"Great session!"}'
```

### Analytics Testing
```bash
# Get usage analytics
curl "http://localhost:8000/api/v1/usage/daily?user_id=test-user&kind=meditation"

# Get sessions library
curl "http://localhost:8000/api/v1/library?user_id=test-user"

# Get streaks
curl http://localhost:8000/api/v1/streaks/test-user
```

### Notes Testing
```bash
# Create note
curl -X POST http://localhost:8000/api/v1/notes \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test-user","kind":"journal","text":"Feeling calm today","mood":"calm"}'

# Search similar notes
curl -X POST http://localhost:8000/api/v1/notes/similarity \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test-user","query":"calm meditation","limit":5}'
```

---

## 📋 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🔍 Error Responses

```json
{
  "error": "Error message",
  "details": "Additional error details",
  "code": "ERROR_CODE"
}
```


**For full documentation, see README.md**
