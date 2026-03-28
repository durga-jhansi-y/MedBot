import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Flag, Volume2, Maximize2, Minimize2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
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

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm MedBot 🏁 How can I help you have a speedy recovery today?",
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

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="size-16 rounded-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Bot className="size-8 text-white" />
            </Button>
            <div className="absolute -top-1 -right-1 size-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className={`fixed z-50 ${
              isFullscreen
                ? "inset-4"
                : "bottom-6 right-6 w-[400px] h-[600px]"
            }`}
          >
            <Card className="border-2 border-orange-200 h-full flex flex-col shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 border-b-2 border-orange-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <Bot className="size-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">MedBot Assistant</CardTitle>
                      <p className="text-xs text-gray-600 flex items-center gap-2">
                        <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                        Online
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="size-8"
                    >
                      {isFullscreen ? (
                        <Minimize2 className="size-4" />
                      ) : (
                        <Maximize2 className="size-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="size-8"
                    >
                      <X className="size-4" />
                    </Button>
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
                      className={`flex-shrink-0 size-8 rounded-full flex items-center justify-center ${
                        message.sender === "bot"
                          ? "bg-gradient-to-br from-orange-500 to-red-500"
                          : "bg-gray-300"
                      }`}
                    >
                      {message.sender === "bot" ? (
                        <Bot className="size-5 text-white" />
                      ) : (
                        <User className="size-5 text-gray-600" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`flex flex-col max-w-[75%] ${
                        message.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`px-3 py-2 rounded-2xl ${
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
                            className="size-5"
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
                    <div className="flex-shrink-0 size-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <Bot className="size-5 text-white" />
                    </div>
                    <div className="bg-orange-50 border border-orange-200 px-3 py-2 rounded-2xl">
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
              <div className="border-t-2 border-orange-200 p-3 bg-gradient-to-r from-orange-50 to-red-50 flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 border-orange-300 focus:border-orange-500"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
