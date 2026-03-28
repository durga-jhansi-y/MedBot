MedBot
======

A medication management system with a React frontend and Flask backend. Track prescriptions, set reminders, and get instant answers about your medications.

## 🚀 Quick Start

### Option 1: Using Batch Scripts (Windows)

1. **Setup Backend:**
   ```cmd
   setup_backend.bat
   ```

2. **Setup Frontend:**
   ```cmd
   setup_frontend.bat
   ```

3. **Start Backend** (in one terminal):
   ```cmd
   start_backend.bat
   ```

4. **Start Frontend** (in another terminal):
   ```cmd
   start_frontend.bat
   ```

### Option 2: Manual Setup

See detailed instructions in [SETUP_GUIDE.md](SETUP_GUIDE.md)

## 📋 Architecture

```
Frontend (React + Vite) → http://localhost:5173
    ↓ API calls
Backend (Flask) → http://localhost:5000
    ↓
Services (PDF Parser, QA, Voice, Scheduler)
    ↓
medications.json (data storage)
```

## Backend Setup

### Prerequisites
- Python 3.8+
- pip

### Installation

1. Install dependencies:
```bash
pip install flask-cors
pip install -r requirements.txt
```

2. Start the backend:
```bash
python app.py
```

Backend runs on: http://localhost:5000

## Frontend Setup

### Prerequisites
- Node.js 18+ (includes `npm`)

Quick start (npm)
1. Open a terminal in the repo root and change to the frontend folder:

```powershell
cd frontend
```

2. Install dependencies (use the legacy-peer-deps flag if you hit peer dependency errors) and start the dev server:

```powershell
npm install --legacy-peer-deps
npm run dev
```

Alternatives
- Using pnpm:

```powershell
pnpm install
pnpm dev
```

- Using yarn:

```powershell
yarn
yarn dev
```

Open: http://localhost:5173/ (Vite default)

Notes
- If PowerShell reports that running scripts is disabled when invoking `npm`, run:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

- Alternatively, invoke the npm wrapper directly (no policy change required):

```powershell
& 'C:\Program Files\nodejs\npm.cmd' install --legacy-peer-deps
& 'C:\Program Files\nodejs\npm.cmd' run dev
```

- The dev script is defined in `frontend/package.json` (`"dev": "vite"`).

## API Documentation

### Frontend Endpoints (New)
The frontend uses these REST API endpoints:
- `GET /api/medications` - Get all medications
- `POST /api/medications` - Add new medication
- `POST /api/upload` - Upload prescription file
- `POST /api/medications/:id/take` - Mark medication as taken
- `POST /api/chat` - Chat with the medication assistant
- `GET /api/me` - Get user profile
- `POST /api/onboarding/reset` - Reset onboarding

### Legacy Endpoints (Original)
Base URL: http://127.0.0.1:5000

1. Login

Method: POST
URL: /login
Body:

json{
    "patient_name": "John Smith"
}

Response:

json{
    "message": "Welcome John Smith! Your reminders have been scheduled!",
    "data": {...}
}

2. Upload Prescription

Method: POST
URL: /upload-prescription
Body: form-data

file → PDF, TXT, DOCX or Excel file


Response:

json{
    "message": "Prescription uploaded!",
    "data": {
        "patient_name": "John Smith",
        "doctor_name": "Dr. Sarah Johnson",
        "allergies": ["Penicillin"],
        "medications": [...],
        "next_appointment": "April 10, 2026"
    }
}

3. Add Manual Data

Method: POST
URL: /add-manual
Body:

json{
    "patient_name": "John Smith",
    "doctor_name": "Dr. Sarah Johnson",
    "next_appointment": "April 10, 2026",
    "allergies": ["Penicillin"],
    "medications": [
        {
            "name": "Amoxicillin",
            "dosage": "500mg",
            "frequency": "twice daily",
            "times": ["09:00", "21:00"]
        }
    ]
}

Response:

json{
    "message": "Patient data added successfully!",
    "data": {...}
}

4. Ask a Question (Text)

Method: POST
URL: /ask
Body:

json{
    "patient_name": "John Smith",
    "question": "What medications am I taking?"
}

Response:

json{
    "answer": "You are currently taking..."
}

5. Ask a Question (Voice File)

Method: POST
URL: /ask-voice
Body: form-data

audio → WAV or MP3 file
patient_name → Text


Response: Returns MP3 audio file — play it directly!


6. Live Voice Conversation

Method: POST
URL: /ask-live
Body:

json{
    "patient_name": "John Smith"
}

Response: Returns MP3 audio file — play it directly!


7. Get All Medications

Method: GET
URL: /get-medications
Response: Returns list of all patients and medications


8. Get Patient Medications

Method: GET
URL: /get-medications/John Smith
Response: Returns medications for specific patient
