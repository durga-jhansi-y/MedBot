from flask import Flask, request, jsonify, send_file
from services.pdf_parser import parse_prescription
from services.qa_service import answer_question
from services.voice_service import speech_to_text, text_to_speech
from services.scheduler import start_scheduler
import json
import os

app = Flask(__name__)
DATA_FILE = "medications.json"

def load_medications():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []

def save_medications(meds):
    with open(DATA_FILE, "w") as f:
        json.dump(meds, f, indent=2)

@app.route("/")
def home():
    return "MedBot backend is running!"

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

@app.route("/get-medications", methods=["GET"])
def get_medications():
    medications = load_medications()
    return jsonify(medications)

@app.route("/get-medications/<patient_name>", methods=["GET"])
def get_medications_by_patient(patient_name):
    medications = load_medications()
    patient_meds = [m for m in medications if m.get("patient_name", "").lower() == patient_name.lower()]
    return jsonify(patient_meds)

if __name__ == "__main__":
    start_scheduler()
    app.run(debug=True)