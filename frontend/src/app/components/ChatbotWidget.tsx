import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Volume2, Maximize2, Minimize2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../api";
import { useUser } from "../context/UserContext";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const getBotResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
    return "Hello! I'm MedBot, your speedy medication assistant! How can I help you today?";
  }
  if (message.includes("reminder") || message.includes("set")) {
    return "I'd be happy to help you set up a medication reminder! You can add medications through the Add Med page.";
  }
  if (message.includes("food") || message.includes("eat") || message.includes("meal")) {
    return "Many medications work best when taken with meals. Always check your prescription label or ask your pharmacist.";
  }
  if (message.includes("side effect") || message.includes("reaction")) {
    return "Side effects can vary by medication. If you experience severe side effects, seek medical attention immediately.";
  }
  if (message.includes("thank") || message.includes("thanks")) {
    return "You're welcome! I'm here to help you have a speedy recovery! 🏁";
  }
  return "I'm here to help with your medication questions! Please sign in so I can give you personalized answers about your prescriptions.";
};

export function ChatbotWidget() {
  const { user } = useUser();
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

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const question = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      let responseText = "";

      if (user) {
        const data = await api.askQuestion(user.name, question);
        responseText = data.answer;
      } else {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 + Math.random() * 1000)
        );
        responseText = getBotResponse(question);
      }

      const botResponse: Message = {
        id: messages.length + 2,
        text: responseText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: messages.length + 2,
        text: "Sorry I couldn't connect to the server. Please make sure the backend is running!",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
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
                        {user ? `Chatting as ${user.name}` : "Online"}
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

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
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

                {isTyping && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 size-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <Bot className="size-5 text-white" />
                    </div>
                    <div className="bg-orange-50 border border-orange-200 px-3 py-2 rounded-2xl">
                      <div className="flex gap-1">
                        <span className="size-2 bg-orange-400 rounded-full animate-bounce"></span>
                        <span className="size-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                        <span className="size-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              <div className="border-t-2 border-orange-200 p-3 bg-gradient-to-r from-orange-50 to-red-50 flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={user ? "Ask me about your medications..." : "Sign in for personalized answers..."}
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