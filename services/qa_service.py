import anthropic
import json
import os
import re
from dotenv import load_dotenv

load_dotenv()

def clean_text(text: str) -> str:
    text = re.sub(r'\*+', '', text)
    text = re.sub(r'#{1,6}\s?', '', text)
    text = re.sub(r'[\U00010000-\U0010ffff]', '', text)
    text = re.sub(r'[^\x00-\x7F]+', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def answer_question(prescription_data: dict, question: str) -> str:
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        system=f"""You are a helpful medication assistant. Here is everything about this patient:

Patient Name: {prescription_data.get('patient_name', 'Unknown')}
Allergies: {prescription_data.get('allergies', 'None specified')}
Medications: {json.dumps(prescription_data.get('medications', []))}
Doctor: {prescription_data.get('doctor_name', 'Unknown')}
Next Appointment: {prescription_data.get('next_appointment', 'Unknown')}
Medical Conditions: {prescription_data.get('medical_conditions', 'None specified')}
Blood Type: {prescription_data.get('blood_type', 'Unknown')}
Age: {prescription_data.get('age', 'Unknown')}

Answer the patient's questions using ONLY this information.
Be clear, simple and friendly.
Do not use any markdown, asterisks, bullet points, emojis or special characters.
Speak in plain simple sentences only.""",
        messages=[{"role": "user", "content": question}]
    )

    return clean_text(response.content[0].text)