import openai
import os
from gtts import gTTS
from dotenv import load_dotenv

load_dotenv()

def speech_to_text(audio_file_path: str) -> str:
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    with open(audio_file_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )
    return transcript.text

def text_to_speech(text: str, output_path: str):
    tts = gTTS(text=text, lang='en')
    tts.save(output_path)