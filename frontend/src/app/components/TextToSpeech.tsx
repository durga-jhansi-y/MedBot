import { Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface TextToSpeechProps {
  text: string;
  className?: string;
}

export function TextToSpeech({ text, className }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={speak}
      className={className}
      title={isSpeaking ? "Stop speaking" : "Read aloud"}
    >
      {isSpeaking ? (
        <VolumeX className="size-5" />
      ) : (
        <Volume2 className="size-5" />
      )}
    </Button>
  );
}
