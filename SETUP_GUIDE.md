# MedBot - Frontend & Backend Connection

## Quick Start

### 1. Install Backend Dependencies

First, install the Python dependencies including flask-cors:

```bash
pip install flask-cors
pip install -r requirements.txt
```

Or use the new requirements file:
```bash
pip install -r requirements_new.txt
```

### 2. Install Frontend Dependencies

Navigate to the frontend folder and install dependencies:

```bash
cd frontend
npm install
```

### 3. Start the Backend

From the root directory:

```bash
python app.py
```

The backend will start on `http://localhost:5000`

### 4. Start the Frontend

In a separate terminal, from the frontend directory:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is taken)

## What Was Changed

### Backend (app.py)
- ✅ Added CORS support with `flask-cors`
- ✅ Added `/api/medications` endpoint (GET & POST) for fetching and adding medications
- ✅ Added `/api/upload` endpoint for prescription file uploads
- ✅ Added `/api/medications/<id>/take` endpoint to mark medications as taken
- ✅ Added `/api/chat` endpoint for chatbot functionality
- ✅ Added `/api/me` endpoint for user profile
- ✅ Added `/api/onboarding/reset` endpoint
- ✅ Set explicit port 5000 for backend

### Frontend
- ✅ Created `.env` file with `VITE_API_BASE=http://localhost:5000`
- ✅ The frontend already has the correct API client setup in `src/lib/api.ts`

## API Endpoints

### Frontend calls these endpoints:
- `GET /api/medications` - Get all medications
- `POST /api/medications` - Add new medication
- `POST /api/upload` - Upload prescription file
- `POST /api/medications/:id/take` - Mark medication as taken
- `POST /api/chat` - Send chat message
- `GET /api/me` - Get user profile
- `POST /api/onboarding/reset` - Reset onboarding

### Legacy endpoints (still available):
- `POST /login` - User login
- `POST /upload-prescription` - Upload prescription (old endpoint)
- `POST /add-manual` - Add manual entry (old endpoint)
- `POST /ask` - Ask question about medications
- `POST /ask-voice` - Voice-based Q&A
- `GET /get-medications` - Get all medications (old endpoint)

## Testing the Connection

1. Start the backend: `python app.py`
2. Start the frontend: `cd frontend && npm run dev`
3. Open your browser to the frontend URL (usually http://localhost:5173)
4. Try adding a medication through the UI
5. Check the dashboard to see if it appears

## Troubleshooting

### CORS Issues
If you see CORS errors in the browser console, make sure:
- `flask-cors` is installed: `pip install flask-cors`
- The backend is running on port 5000
- The frontend `.env` file has the correct backend URL

### Port Conflicts
- Backend uses port 5000 (can be changed in `app.py`)
- Frontend uses port 5173 by default (Vite will auto-increment if taken)

### Module Not Found
If you get import errors for services:
- Make sure all service files exist in the `services/` directory
- Check that `__init__.py` exists in the services folder

## Architecture

```
Frontend (React + Vite)
    ↓ HTTP Requests
    ↓ (localhost:5173 → localhost:5000)
    ↓
Backend (Flask)
    ↓
Services (pdf_parser, qa_service, voice_service, scheduler)
    ↓
medications.json (data storage)
```
