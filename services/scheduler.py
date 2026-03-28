from apscheduler.schedulers.background import BackgroundScheduler
import json
import os

scheduler = BackgroundScheduler()

DATA_FILE = "medications.json"

def load_medications():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []

def send_reminder(patient_name: str, med_name: str, dosage: str):
    print(f"REMINDER: {patient_name}, time to take {med_name} - {dosage}")

def schedule_all_reminders():
    medications = load_medications()
    for patient in medications:
        patient_name = patient.get("patient_name", "Unknown")
        for med in patient.get("medications", []):
            job_id = f"{patient_name}_{med['name']}"
            scheduler.add_job(
                send_reminder,
                trigger="interval",
                hours=1,
                args=[patient_name, med["name"], med["dosage"]],
                id=job_id,
                replace_existing=True
            )
    print("All reminders scheduled!")

def start_scheduler():
    schedule_all_reminders()
    scheduler.start()
    print("Scheduler started!")