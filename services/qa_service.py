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
        system=f"You are a helpful medication assistant. The patient's prescription is: {json.dumps(prescription_data)}. Answer questions about their medications, dosage, and appointments only. Be clear and simple. Do not use any markdown formatting, asterisks, bullet points, emojis or special characters. Speak in plain simple sentences only.",
        messages=[{"role": "user", "content": question}]
    )

    return clean_text(response.content[0].text)