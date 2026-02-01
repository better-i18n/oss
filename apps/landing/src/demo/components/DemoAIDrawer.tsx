import { useState, useRef, useEffect } from "react";
import { ChevronRight, Send, Square } from "lucide-react";
import { MOCK_CHAT_MESSAGES } from "../mock-data";
import type { MockChatMessage } from "../mock-data";

interface DemoAIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoAIDrawer({ isOpen, onClose }: DemoAIDrawerProps) {
  const [messages, setMessages] = useState<MockChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load initial messages when drawer opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages(MOCK_CHAT_MESSAGES);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: MockChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response after 1.5 seconds
    setTimeout(() => {
      const aiResponse: MockChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content:
          "I understand you'd like to translate these keys. In the live version, I would analyze the context and provide accurate translations with approval flow.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-101 pointer-events-none">
      <div
        className="absolute bottom-0 right-0 h-[calc(100vh-88px)] max-w-full pointer-events-auto transition-transform"
        style={{
          width: "40vw",
          minWidth: "500px",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Resize handle (visual only) */}
        <div className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 transition-colors" />

        <div className="static h-full w-full bg-white rounded-tl-xl rounded-bl-xl border-l border-t border-b border-gray-200 flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h2 className="text-sm font-medium text-foreground">
                AI Translation Assistant
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Demo mode</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Claude Sonnet 4.5
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="text-muted-foreground">
                  <p className="text-sm font-medium">
                    Start translating with AI
                  </p>
                  <p className="text-xs mt-1">
                    Ask me to translate keys, provide context, or suggest
                    improvements
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2.5 ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {msg.content}
                    </div>
                    {msg.toolCall && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="text-xs opacity-80 mb-2">
                          Translation Proposals:
                        </div>
                        <div className="space-y-1.5">
                          {msg.toolCall.translations?.map((t, i) => (
                            <div
                              key={i}
                              className="text-xs font-mono bg-black/10 rounded px-2 py-1"
                            >
                              <span className="opacity-60">{t.key}:</span>{" "}
                              {t.translation}
                            </div>
                          ))}
                        </div>
                        {msg.toolCall.status === "completed" && (
                          <div className="mt-2 text-xs text-green-400">
                            ✓ Applied
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2.5 bg-muted text-foreground">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me to translate keys..."
                className="flex-1 px-3 py-2 text-sm bg-muted/20 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px] max-h-[120px]"
                rows={2}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="h-10 w-10 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isTyping ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">
                Enter
              </kbd>{" "}
              to send,{" "}
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">
                Shift+Enter
              </kbd>{" "}
              for new line
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -left-4 z-50 bottom-6 h-9 w-9 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ChevronRight className="h-4 w-4 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
