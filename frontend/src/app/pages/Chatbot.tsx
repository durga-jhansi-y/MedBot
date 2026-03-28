import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Flag, Zap, Volume2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { NavigationBar } from "../components/NavigationBar";
import { RacingBackground } from "../components/RacingBackground";
import { TextToSpeech } from "../components/TextToSpeech";
import SpeechToText from "../components/SpeechToText";
import { sendChatMessage } from "../../lib/api";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Mock bot responses based on keywords
const getBotResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();

  if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
    return "Hello! I'm MedBot, your speedy medication assistant! How can I help you today? I can help you set up reminders, answer questions about your medications, or guide you through the app.";
  }

  if (message.includes("reminder") || message.includes("set")) {
    return "I'd be happy to help you set up a medication reminder! Once connected to the backend, I'll be able to schedule reminders for you. For now, you can add medications through the 'Add Med' page, and I'll guide you through the process. What medication would you like to set a reminder for?";
  }

  if (message.includes("food") || message.includes("eat") || message.includes("meal")) {
    return "Great question about taking medication with food! Many medications work best when taken with meals to reduce stomach upset and improve absorption. However, some need to be taken on an empty stomach. Always check your prescription label or ask your pharmacist. Would you like me to check a specific medication?";
  }

  if (message.includes("side effect") || message.includes("reaction")) {
    return "Side effects can vary by medication. Common ones include nausea, dizziness, or drowsiness. If you experience severe side effects like difficulty breathing, chest pain, or severe rash, seek medical attention immediately. For specific medication information, please consult your healthcare provider or pharmacist.";
  }

  if (message.includes("interaction") || message.includes("take with") || message.includes("together")) {
    return "Medication interactions are important to consider! Some medications shouldn't be taken together, while others are safe to combine. Common interactions include certain antibiotics with dairy, blood thinners with aspirin, and some medications with grapefruit juice. Always inform your doctor about all medications you're taking. What medications are you asking about?";
  }

  if (message.includes("refill") || message.includes("prescription")) {
    return "You can check your refill status on the Dashboard page! I'll notify you when you're running low on any medication. Typically, you should refill prescriptions when you have 7-10 days remaining. Would you like me to help you navigate to the dashboard?";
  }

  if (message.includes("dashboard") || message.includes("navigate") || message.includes("how to use")) {
    return "Let me help you navigate MedBot! 🏁 Use 'Add Med' to input new medications, check your 'Dashboard' to see all your meds and refill dates, and come chat with me anytime for questions! You can also use our text-to-speech feature on any page. What would you like to explore?";
  }

  if (message.includes("thank") || message.includes("thanks")) {
    return "You're welcome! I'm here to help you have a speedy recovery! 🏁 Feel free to ask me anything about your medications or the app anytime.";
  }

  return "I'm here to help with your medication questions! I can assist you with setting up reminders, explaining how to take your medications, checking for potential interactions, and navigating the app. What would you like to know?";
};

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to MedBot! 🏁 I'm your personal medication assistant. I can help you with setting up reminders, answering questions about your medications, and navigating the app. How can I help you have a speedy recovery today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    (async () => {
      try {
        const res = await sendChatMessage(inputValue);
        const reply = res?.reply || res?.message || getBotResponse(inputValue);
        const botResponse: Message = {
          id: messages.length + 2,
          text: reply,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      } catch (err) {
        console.error("Chat API error:", err);
        const botResponse: Message = {
          id: messages.length + 2,
          text: getBotResponse(inputValue),
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      } finally {
        setIsTyping(false);
      }
    })();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const speakMessage = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const pageDescription = "Chat with MedBot to get answers about your medications and set up reminders.";

  return (
    <div className="min-h-screen">
      <NavigationBar />
      <RacingBackground />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bot className="size-8 text-orange-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Chat with MedBot
              </h1>
              <Bot className="size-8 text-orange-600" />
              <TextToSpeech text={pageDescription} />
            </div>
            <p className="text-gray-600">
              {pageDescription}
            </p>
          </div>

          {/* Chat Card */}
          <Card className="border-2 border-orange-200 h-[600px] flex flex-col">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 border-b-2 border-orange-200">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Zap className="size-10 fill-orange-600 text-orange-600" />
                  <div className="absolute inset-0 blur-sm">
                    <Zap className="size-10 fill-orange-600 text-orange-600" />
                  </div>
                </div>
                <div>
                  <CardTitle>MedBot Assistant</CardTitle>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online and ready to help!
                  </p>
                </div>
              </div>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 size-10 rounded-full flex items-center justify-center ${
                      message.sender === "bot"
                        ? "bg-gradient-to-br from-orange-500 to-red-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {message.sender === "bot" ? (
                      <Bot className="size-6 text-white" />
                    ) : (
                      <User className="size-6 text-gray-600" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`flex flex-col max-w-[75%] ${
                      message.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.sender === "bot"
                          ? "bg-orange-50 border border-orange-200"
                          : "bg-gradient-to-r from-orange-600 to-red-600 text-white"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1 px-2">
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {message.sender === "bot" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6"
                          onClick={() => speakMessage(message.text)}
                        >
                          <Volume2 className="size-3 text-gray-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 size-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Bot className="size-6 text-white" />
                  </div>
                  <div className="bg-orange-50 border border-orange-200 px-4 py-3 rounded-2xl">
                    <div className="flex gap-1">
                      <span className="size-2 bg-orange-400 rounded-full animate-bounce"></span>
                      <span
                        className="size-2 bg-orange-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                      <span
                        className="size-2 bg-orange-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input Area */}
            <div className="border-t-2 border-orange-200 p-4 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex gap-2 items-center">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your medications..."
                  className="flex-1 border-orange-300 focus:border-orange-500"
                />

                <SpeechToText
                  onResult={(text, isFinal) => {
                    setInputValue(text);
                  }}
                />

                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <Send className="size-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Press Enter to send • This is a demo chatbot with simulated responses
              </p>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInputValue("How do I set up a reminder?");
              }}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <Flag className="size-3 mr-1" />
              Set up reminder
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInputValue("Can I take this medication with food?");
              }}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <Flag className="size-3 mr-1" />
              Food interactions
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInputValue("When should I refill my prescription?");
              }}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <Flag className="size-3 mr-1" />
              Refill timing
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInputValue("How do I navigate the app?");
              }}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <Flag className="size-3 mr-1" />
              App navigation
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
