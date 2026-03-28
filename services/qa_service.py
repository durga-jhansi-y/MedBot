import anthropic
import json
import os
from dotenv import load_dotenv

load_dotenv()

def answer_question(prescription_data: dict, question: str) -> str:
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        system=f"You are a helpful medication assistant. The patient's prescription is: {json.dumps(prescription_data)}. Answer questions about their medications, dosage, and appointments only. Be clear and simple.",
        messages=[{"role": "user", "content": question}]
    )

    return response.content[0].text
