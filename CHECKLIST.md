# ✅ MedBot Connection Checklist

## Before You Start
- [ ] Python 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] Git repository cloned

## Backend Setup
- [ ] Navigate to project root directory
- [ ] Run: `pip install flask-cors`
- [ ] Run: `pip install -r requirements.txt`
- [ ] Verify `app.py` has `from flask_cors import CORS` at top
- [ ] Verify `CORS(app)` is called after `app = Flask(__name__)`

## Frontend Setup
- [ ] Navigate to `frontend/` directory
- [ ] Check that `.env` file exists with `VITE_API_BASE=http://localhost:5000`
- [ ] Run: `npm install` (or `npm install --legacy-peer-deps` if needed)
- [ ] Verify `src/lib/api.ts` exists and has API functions

## Starting the Application

### Terminal 1 - Backend
- [ ] Navigate to project root
- [ ] Run: `python app.py`
- [ ] Wait for: `Running on http://127.0.0.1:5000`
- [ ] Backend is ready! ✓

### Terminal 2 - Frontend
- [ ] Navigate to `frontend/` directory
- [ ] Run: `npm run dev`
- [ ] Wait for: `Local: http://localhost:5173/`
- [ ] Frontend is ready! ✓

## Testing the Connection
- [ ] Open browser to `http://localhost:5173`
- [ ] Page loads successfully (no errors in browser console)
- [ ] Click "Add Medication" from home page
- [ ] Fill out the medication form:
  - [ ] Name: "Test Medication"
  - [ ] Dosage: "10mg"
  - [ ] Select at least one day
  - [ ] Set a time for that day
- [ ] Click "Add Medication" button
- [ ] Success toast appears: "Medication added successfully! 🏁"
- [ ] Redirected to Dashboard
- [ ] Medication appears in the dashboard list
- [ ] Backend terminal shows: `POST /api/medications` with status `200`

## Common Issues & Solutions

### ❌ CORS Error in Browser Console
**Solution:**
```bash
pip install flask-cors
```
Restart backend server

### ❌ "Cannot connect to backend" or "Network Error"
**Solution:**
- Ensure backend is running on port 5000
- Check `frontend/.env` has correct URL
- Verify no firewall blocking localhost

### ❌ "Module not found" when starting backend
**Solution:**
```bash
pip install -r requirements.txt
```

### ❌ Frontend won't start (npm errors)
**Solution:**
```bash
cd frontend
npm install --legacy-peer-deps
```

### ❌ Port 5000 already in use
**Solution:**
- Stop other services using port 5000
- Or change port in `app.py`: `app.run(debug=True, port=5001)`
- Update `frontend/.env`: `VITE_API_BASE=http://localhost:5001`

## Files to Verify

### Backend Files
- [ ] `app.py` - Has CORS enabled and new API routes
- [ ] `requirements.txt` - Has flask-cors listed
- [ ] `services/` folder exists with service files

### Frontend Files
- [ ] `frontend/.env` - Has API base URL
- [ ] `frontend/src/lib/api.ts` - Has API functions
- [ ] `frontend/package.json` - Has all dependencies

## Success Indicators ✅

You know everything is working when:
1. Both servers start without errors
2. Browser console has no errors (F12 to check)
3. You can add medications and see them in the dashboard
4. Backend terminal logs show incoming requests
5. Frontend displays success messages

## Need Help?

Check these files for more information:
- `CONNECTION_SUMMARY.md` - Detailed changes made
- `SETUP_GUIDE.md` - Step-by-step setup instructions
- `ARCHITECTURE.txt` - Visual architecture diagram
- `README.md` - Quick start guide

## Quick Start Scripts (Windows)

If you prefer batch scripts:
- [ ] Run `setup_backend.bat` (first time only)
- [ ] Run `setup_frontend.bat` (first time only)
- [ ] Run `start_backend.bat` (every time)
- [ ] Run `start_frontend.bat` (every time)

---

**Last Updated:** Connected frontend to backend with CORS, new API endpoints, and proper configuration.

**Status:** ✅ Ready to use!
