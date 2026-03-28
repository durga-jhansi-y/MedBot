from apscheduler.schedulers.background import BackgroundScheduler
import json
import os
import time
from dotenv import load_dotenv
from gtts import gTTS
import playsound

load_dotenv()

scheduler = BackgroundScheduler()
DATA_FILE = "medications.json"

DEFAULT_TIMES = {
    1: ["14:23"],
    2: ["14:23", "21:00"],
    3: ["14:23", "15:00", "21:00"],
    4: ["14:23", "12:00", "16:00", "20:00"],
    5: ["14:23", "11:00", "14:00", "17:00", "20:00"],
    6: ["14:23", "10:00", "12:00", "14:00", "16:00", "20:00"],
}

def load_medications():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []

def speak(message: str):
    try:
        tts = gTTS(text=message, lang='en')
        audio_path = "reminder_temp.mp3"
        tts.save(audio_path)
        playsound.playsound(audio_path)
        os.remove(audio_path)
    except Exception as e:
        print(f"Voice error: {e}")

def send_all_reminders_for_user(patient_name: str, medications: list):
    speak(f"Hi {patient_name}, here are your medication reminders!")
    time.sleep(2)
    
    for i, med in enumerate(medications):
        med_name = med.get("name", "")
        dosage = med.get("dosage", "")
        
        message = f"Reminder {i + 1}: Time to take {med_name}, {dosage}. Please do not skip your medication!"
        print(f"REMINDER: {patient_name} - {med_name} {dosage}")
        speak(message)
        time.sleep(3)
    
    speak(f"That is all your reminders for now {patient_name}. Stay healthy!")

def parse_frequency(frequency: str) -> int:
    frequency = frequency.lower()
    if "once" in frequency or "1" in frequency:
        return 1
    elif "twice" in frequency or "2" in frequency:
        return 2
    elif "three" in frequency or "3" in frequency:
        return 3
    elif "four" in frequency or "4" in frequency:
        return 4
    elif "five" in frequency or "5" in frequency:
        return 5
    elif "six" in frequency or "6" in frequency:
        return 6
    else:
        return 1

def get_reminder_times(med: dict) -> list:
    if "times" in med and med["times"]:
        return med["times"]
    if "frequency" in med and med["frequency"]:
        count = parse_frequency(med["frequency"])
        return DEFAULT_TIMES.get(count, ["09:00"])
    return ["09:00"]

def schedule_reminders_for_user(patient_name: str):
    medications = load_medications()
    patient_data = next((m for m in medications if m.get("patient_name", "").lower() == patient_name.lower()), None)
    
    if not patient_data:
        print(f"No data found for {patient_name}")
        return
    
    patient_meds = patient_data.get("medications", [])
    
    times_set = set()
    for med in patient_meds:
        times = get_reminder_times(med)
        for time_str in times:
            times_set.add(time_str)
    
    for time_str in times_set:
        hour, minute = map(int, time_str.split(":"))
        job_id = f"{patient_name}_reminder_{time_str}"
        
        meds_at_this_time = [
            med for med in patient_meds
            if time_str in get_reminder_times(med)
        ]
        
        scheduler.add_job(
            send_all_reminders_for_user,
            trigger="cron",
            hour=hour,
            minute=minute,
            args=[patient_name, meds_at_this_time],
            id=job_id,
            replace_existing=True
        )
        print(f"Scheduled reminders for {patient_name} at {time_str}")
    
    print(f"All reminders scheduled for {patient_name}!")

def schedule_all_reminders():
    medications = load_medications()
    for patient in medications:
        patient_name = patient.get("patient_name", "Unknown")
        schedule_reminders_for_user(patient_name)

def start_scheduler():
    schedule_all_reminders()
    scheduler.start()
    print("Scheduler started!")