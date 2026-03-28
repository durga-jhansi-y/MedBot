import React, { useEffect, useRef, useState } from "react";
import { Mic, X } from "lucide-react";
import { Button } from "./ui/button";

interface SpeechToTextProps {
  onResult: (text: string, isFinal?: boolean) => void;
  className?: string;
}

export function SpeechToText({ onResult, className }: SpeechToTextProps) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const win = window as any;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = true;
    recog.lang = "en-US";

    recog.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      if (interim) onResult(interim, false);
      if (final) onResult(final.trim(), true);
    };

    recog.onerror = () => {
      setListening(false);
    };

    recog.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recog;

    return () => {
      try {
        recog.stop();
      } catch (e) {}
      recognitionRef.current = null;
    };
  }, [onResult]);

  const toggle = () => {
    const recog = recognitionRef.current;
    if (!recog) {
      // feature not supported
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (listening) {
      try {
        recog.stop();
      } catch (e) {}
      setListening(false);
      return;
    }

    try {
      recog.start();
      setListening(true);
    } catch (err) {
      console.error("Speech recognition start error:", err);
      setListening(false);
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className || ""}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        title={listening ? "Stop listening" : "Start voice input"}
      >
        {listening ? <X className="size-5 text-red-500" /> : <Mic className="size-5" />}
      </Button>

      {/* Listening badge */}
      {listening && (
        <span
          className="absolute -top-1 -right-1 flex items-center gap-1"
          aria-hidden="false"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse border-2 border-white"></span>
          <span className="sr-only">Listening</span>
        </span>
      )}

      {/* Live region for screen readers */}
      <span className="sr-only" aria-live="polite">
        {listening ? "Voice input active" : "Voice input inactive"}
      </span>
    </div>
  );
}

export default SpeechToText;
