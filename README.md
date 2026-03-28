MedBot
======

This repository contains the MedBot project. It includes a frontend built with Vite and React.

Frontend
--------

Prerequisites
- Node.js 18+ (includes `npm`).

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

Bcakend : 
MedBot API Documentation
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
