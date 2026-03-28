from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from services.pdf_parser import parse_prescription
from services.qa_service import answer_question
from services.voice_service import speech_to_text, text_to_speech, live_voice_to_text
from services.scheduler import start_scheduler, schedule_reminders_for_user
import json
import os

app = Flask(__name__)
CORS(app)
DATA_FILE = "medications.json"
PROFILE_FILE = "profiles.json"

def load_medications():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []

def save_medications(meds):
    with open(DATA_FILE, "w") as f:
        json.dump(meds, f, indent=2)

def load_profiles():
    if os.path.exists(PROFILE_FILE):
        with open(PROFILE_FILE, "r") as f:
            return json.load(f)
    return []

def save_profiles(profiles):
    with open(PROFILE_FILE, "w") as f:
        json.dump(profiles, f, indent=2)

@app.route("/")
def home():
    frontend_index = os.path.join(os.path.dirname(__file__), "frontend", "index.html")
    return send_file(frontend_index)

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    patient_name = data.get("patient_name")

    if not patient_name:
        return jsonify({"error": "Patient name required"}), 400

    medications = load_medications()
    patient_data = next((m for m in medications if m.get("patient_name", "").lower() == patient_name.lower()), None)

    if not patient_data:
        return jsonify({"error": "Patient not found"}), 404

    schedule_reminders_for_user(patient_name)

    return jsonify({
        "message": f"Welcome {patient_name}! Your reminders have been scheduled!",
        "data": patient_data
    })

@app.route("/upload-prescription", methods=["POST"])
def upload_prescription():
    file = request.files["file"]
    file_path = f"temp_{file.filename}"
    file.save(file_path)
    parsed = parse_prescription(file_path)
    medications = load_medications()
    medications.append(parsed)
    save_medications(medications)
    os.remove(file_path)
    return jsonify({"message": "Prescription uploaded!", "data": parsed})

@app.route("/add-manual", methods=["POST"])
def add_manual():
    data = request.json

    required_fields = ["patient_name", "medications"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    medications = load_medications()
    medications.append(data)
    save_medications(medications)

    return jsonify({
        "message": "Patient data added successfully!",
        "data": data
    })

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    question = data.get("question")
    patient_name = data.get("patient_name")
    medications = load_medications()
    patient_data = next((m for m in medications if m.get("patient_name", "").lower() == patient_name.lower()), None)
    if not patient_data:
        return jsonify({"error": "Patient not found"}), 404
    answer = answer_question(patient_data, question)
    return jsonify({"answer": answer})

@app.route("/ask-voice", methods=["POST"])
def ask_voice():
    audio = request.files["audio"]
    audio_path = "temp_audio.wav"
    audio.save(audio_path)
    question = speech_to_text(audio_path)
    patient_name = request.form.get("patient_name")
    medications = load_medications()
    patient_data = next((m for m in medications if m.get("patient_name", "").lower() == patient_name.lower()), None)
    if not patient_data:
        return jsonify({"error": "Patient not found"}), 404
    answer = answer_question(patient_data, question)
    text_to_speech(answer, "response.mp3")
    os.remove(audio_path)
    return send_file("response.mp3", mimetype="audio/mpeg")

@app.route("/ask-live", methods=["POST"])
def ask_live():
    data = request.json
    patient_name = data.get("patient_name")

    medications = load_medications()
    patient_data = next((m for m in medications if m.get("patient_name", "").lower() == patient_name.lower()), None)
    if not patient_data:
        return jsonify({"error": "Patient not found"}), 404

    question = live_voice_to_text()
    print(f"Question heard: {question}")

    answer = answer_question(patient_data, question)
    text_to_speech(answer, "response.mp3")

    return send_file("response.mp3", mimetype="audio/mpeg")

@app.route("/get-medications", methods=["GET"])
def get_medications():
    medications = load_medications()
    return jsonify(medications)

@app.route("/get-medications/<patient_name>", methods=["GET"])
def get_medications_by_patient(patient_name):
    medications = load_medications()
    patient_meds = [m for m in medications if m.get("patient_name", "").lower() == patient_name.lower()]
    return jsonify(patient_meds)


@app.route("/profiles", methods=["GET", "POST"])
def api_profiles():
    if request.method == "GET":
        return jsonify(load_profiles())

    # POST - create new profile
    data = request.json
    name = data.get("name")
    if not name:
        return jsonify({"error": "Name required"}), 400

    profiles = load_profiles()
    # Prevent duplicate names (case-insensitive)
    if any(p.get("name", "").lower() == name.lower() for p in profiles):
        return jsonify({"error": "Profile with this name already exists"}), 400

    profile = {
        "name": name,
        "age": data.get("age", ""),
        "bloodType": data.get("bloodType", ""),
        "medicalConditions": data.get("medicalConditions", ""),
        "emergencyContact": data.get("emergencyContact", ""),
        "emergencyPhone": data.get("emergencyPhone", ""),
        "allergies": data.get("allergies", []),
        "onboarded": True,
        "hasAccount": True,
    }

    profiles.append(profile)
    save_profiles(profiles)

    return jsonify({"message": "Profile created", "data": profile}), 201

# Frontend API endpoints
@app.route("/api/medications", methods=["GET", "POST"])
def api_medications():
    if request.method == "GET":
        return jsonify(load_medications())
    else:
        data = request.json
        medications = load_medications()
        
        # Create medication entry
        med_entry = {
            "name": data.get("name"),
            "dosage": data.get("dosage"),
            "daysToTake": data.get("daysToTake", []),
            "timesPerDay": data.get("timesPerDay", {}),
            "refillDays": int(data.get("refillDays", 0)) if data.get("refillDays") else None,
            "instructions": data.get("instructions", "")
        }
        
        medications.append(med_entry)
        save_medications(medications)
        
        return jsonify({
            "message": "Medication added successfully",
            "data": med_entry
        })

@app.route("/api/upload", methods=["POST"])
def api_upload():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file provided"}), 400
    
    file_path = f"temp_{file.filename}"
    file.save(file_path)
    
    try:
        parsed = parse_prescription(file_path)
        medications = load_medications()
        medications.append(parsed)
        save_medications(medications)
        os.remove(file_path)
        
        return jsonify({
            "message": "Prescription uploaded successfully",
            "data": parsed
        })
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({"error": str(e)}), 500

@app.route("/api/medications/<int:med_id>/take", methods=["POST"])
def api_mark_taken(med_id):
    medications = load_medications()
    if 0 <= med_id < len(medications):
        if "takenLog" not in medications[med_id]:
            medications[med_id]["takenLog"] = []
        medications[med_id]["takenLog"].append({
            "timestamp": str(json.dumps({}))
        })
        save_medications(medications)
        return jsonify({"message": "Medication marked as taken"})
    return jsonify({"error": "Medication not found"}), 404

@app.route("/api/chat", methods=["POST"])
def api_chat():
    data = request.json
    message = data.get("message", "")
    
    # Get current user context from frontend
    medications = load_medications()
    
    # For simplicity, answer based on all medications
    # In production, you'd filter by logged-in user
    answer = answer_question(medications, message)
    
    return jsonify({
        "response": answer,
        "timestamp": str(json.dumps({}))
    })

@app.route("/api/me", methods=["GET"])
def api_get_profile():
    # Try to return the first saved profile if available
    profiles = load_profiles()
    if profiles:
        profile = profiles[0]
        # include a medications_count for compatibility
        profile_summary = dict(profile)
        profile_summary["medications_count"] = len(load_medications())
        return jsonify(profile_summary)

    # Fallback to a minimal mock profile
    return jsonify({
        "name": "User",
        "medications_count": len(load_medications())
    })

@app.route("/api/onboarding/reset", methods=["POST"])
def api_reset_onboarding():
    # This would reset onboarding flags in a real database
    return jsonify({"message": "Onboarding reset successfully"})

if __name__ == "__main__":
    start_scheduler()
    app.run(debug=True, port=5000)