# Frontend-Backend Connection Summary

## ✅ Changes Made

### 1. Backend (app.py)
- **Added CORS Support**: Imported and enabled `flask-cors` to allow cross-origin requests from the frontend
- **Created New API Endpoints** to match frontend expectations:
  - `GET /api/medications` - Fetch all medications
  - `POST /api/medications` - Add new medication with frontend data structure
  - `POST /api/upload` - Handle file uploads (prescription PDFs/images)
  - `POST /api/medications/<id>/take` - Mark medication as taken
  - `POST /api/chat` - Handle chatbot messages
  - `GET /api/me` - Get user profile
  - `POST /api/onboarding/reset` - Reset onboarding state
- **Set Explicit Port**: Backend now runs on port 5000
- **Kept Legacy Endpoints**: All original endpoints still work for backward compatibility

### 2. Frontend Configuration
- **Created `.env` file** in `frontend/` directory with:
  ```
  VITE_API_BASE=http://localhost:5000
  ```
- The frontend's `src/lib/api.ts` was already properly configured to use this environment variable

### 3. Dependencies
- **Backend**: Added `flask-cors==5.0.0` to requirements
- **Frontend**: No changes needed (already has all required packages)

### 4. Helper Scripts (Windows)
Created batch files for easy setup and running:
- `setup_backend.bat` - Install Python dependencies
- `setup_frontend.bat` - Install npm dependencies
- `start_backend.bat` - Start Flask server
- `start_frontend.bat` - Start Vite dev server

### 5. Documentation
- Updated `README.md` with connection instructions
- Created `SETUP_GUIDE.md` with detailed setup and troubleshooting
- Created this summary document

## 🔄 How It Works

1. **Frontend** (React) runs on `http://localhost:5173`
2. **Backend** (Flask) runs on `http://localhost:5000`
3. Frontend makes HTTP requests to backend API endpoints
4. Backend processes requests and returns JSON responses
5. CORS headers allow the cross-origin communication

## 📊 Data Flow Example

### Adding a Medication:
```
User fills form in AddMedication.tsx
    ↓
Calls addMedication() from api.ts
    ↓
POST http://localhost:5000/api/medications
    ↓
Backend receives request, saves to medications.json
    ↓
Returns success response
    ↓
Frontend shows success toast and navigates to dashboard
```

### Viewing Medications:
```
Home.tsx loads
    ↓
useEffect calls getMedications() from api.ts
    ↓
GET http://localhost:5000/api/medications
    ↓
Backend reads medications.json
    ↓
Returns JSON array of medications
    ↓
Frontend displays in dashboard
```

## 🚀 Quick Start Commands

### Terminal 1 (Backend):
```bash
# Install dependencies first time
pip install flask-cors
pip install -r requirements.txt

# Start backend
python app.py
```

### Terminal 2 (Frontend):
```bash
# Install dependencies first time
cd frontend
npm install

# Start frontend
npm run dev
```

### Using Batch Scripts (Windows):
```bash
# First time setup
setup_backend.bat
setup_frontend.bat

# Every time you want to run
start_backend.bat    # Terminal 1
start_frontend.bat   # Terminal 2
```

## 🧪 Testing the Connection

1. Start both backend and frontend
2. Open browser to `http://localhost:5173`
3. Navigate to "Add Medication"
4. Fill out the form and submit
5. Check the Dashboard - the medication should appear
6. Check the backend terminal - you should see the POST request logged

## 🔍 Troubleshooting

### CORS Errors
**Symptom**: Browser console shows "CORS policy" errors

**Solution**:
```bash
pip install flask-cors
```
Verify `from flask_cors import CORS` and `CORS(app)` are in app.py

### Connection Refused
**Symptom**: Frontend can't reach backend

**Solution**:
- Ensure backend is running: `python app.py`
- Check backend is on port 5000
- Verify `.env` file exists in frontend folder with correct URL

### Module Import Errors
**Symptom**: `ModuleNotFoundError` when starting backend

**Solution**:
- Ensure services folder exists
- Check all service files (pdf_parser.py, qa_service.py, etc.)
- Install missing dependencies: `pip install -r requirements.txt`

### Frontend Build Issues
**Symptom**: npm errors when running `npm install`

**Solution**:
```bash
cd frontend
npm install --legacy-peer-deps
```

## 📝 Next Steps

1. **Authentication**: Add proper user authentication system
2. **Database**: Replace JSON file with proper database (PostgreSQL/MongoDB)
3. **Production Build**: 
   - Frontend: `npm run build` creates production build
   - Backend: Use production WSGI server (gunicorn/waitress)
4. **Environment Variables**: Secure API keys and configuration
5. **Deployment**: Deploy to cloud platform (Heroku, AWS, etc.)

## 🎯 Key Files Modified/Created

- ✏️ Modified: `app.py` (added CORS and API endpoints)
- ✅ Created: `frontend/.env` (API base URL)
- ✅ Created: `requirements_new.txt` (clean requirements with flask-cors)
- ✅ Created: `SETUP_GUIDE.md` (detailed setup instructions)
- ✅ Created: `setup_backend.bat` (Windows setup script)
- ✅ Created: `setup_frontend.bat` (Windows setup script)
- ✅ Created: `start_backend.bat` (Windows start script)
- ✅ Created: `start_frontend.bat` (Windows start script)
- ✏️ Modified: `README.md` (updated with connection info)
- ✅ Created: `CONNECTION_SUMMARY.md` (this file)
