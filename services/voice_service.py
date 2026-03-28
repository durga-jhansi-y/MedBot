import openai
import os
from gtts import gTTS
from dotenv import load_dotenv
import speech_recognition as sr

load_dotenv()

def speech_to_text(audio_file_path: str) -> str:
    try:
        client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        with open(audio_file_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
        return transcript.text
    except Exception as e:
        print(f"Speech to text error: {e}")
        return "Could not transcribe audio"

def text_to_speech(text: str, output_path: str):
    try:
        tts = gTTS(text=text, lang='en')
        tts.save(output_path)
    except Exception as e:
        print(f"Text to speech error: {e}")

def live_voice_to_text() -> str:
    recognizer = sr.Recognizer()
    recognizer.pause_threshold = 5
    recognizer.non_speaking_duration = 2
    recognizer.energy_threshold = 150
    recognizer.dynamic_energy_threshold = False

    try:
        with sr.Microphone() as source:
            print("Adjusting for background noise...")
            recognizer.adjust_for_ambient_noise(source, duration=2)
            print("Listening... speak now!")

            audio = recognizer.listen(
                source,
                timeout=30,
                phrase_time_limit=120
            )

            print("Processing your speech...")
            text = recognizer.recognize_google(audio)
            print(f"You said: {text}")
            return text

    except sr.WaitTimeoutError:
        print("No speech detected!")
        return "I couldn't hear anything please try again"
    except sr.UnknownValueError:
        print("Could not understand speech!")
        return "I couldn't understand that please try again"
    except sr.RequestError as e:
        print(f"Speech service error: {e}")
        return "Speech service is unavailable right now"
    except Exception as e:
        print(f"Unexpected error: {e}")
        return "Something went wrong with the microphone please try again"