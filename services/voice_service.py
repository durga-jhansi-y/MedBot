import openai
import os
from gtts import gTTS
from dotenv import load_dotenv
import io
import speech_recognition as sr

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

def live_voice_to_text() -> str:
    recognizer = sr.Recognizer()
    recognizer.pause_threshold = 2
    recognizer.energy_threshold = 300
    recognizer.dynamic_energy_threshold = True
    
    with sr.Microphone() as source:
        print("Adjusting for background noise...")
        recognizer.adjust_for_ambient_noise(source, duration=2)
        print("Listening... speak now!")
        
        try:
            audio = recognizer.listen(source, timeout=15, phrase_time_limit=30)
            print("Processing your speech...")
            text = recognizer.recognize_google(audio)
            print(f"You said: {text}")
            return text
        except sr.WaitTimeoutError:
            print("No speech detected!")
            return "I couldn't hear anything, please try again"
        except sr.UnknownValueError:
            print("Could not understand speech!")
            return "I couldn't understand that, please try again"
        except sr.RequestError:
            print("Speech service error!")
            return "Speech service is unavailable right now"