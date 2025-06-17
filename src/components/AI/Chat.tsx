import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import {
  X,
  Send,
  MessageCircle,
  Bot,
  User,
  Minimize2,
  Maximize2,
  RotateCcw,
  Copy,
  CheckCircle,
  Loader2,
  Sparkles,
  GripVertical
} from 'lucide-react';

// Utility function for className concatenation
const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AfriRemit AI assistant. I can help you with transactions, account questions, troubleshooting, and general guidance. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const nodeRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simulate AI response (replace with actual AI integration)
  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simple response logic (replace with actual AI API call)
    const responses = [
      "I understand you're asking about " + userMessage.toLowerCase() + ". Let me help you with that. Based on your query, here are some suggestions...",
      "Thanks for your question! For " + userMessage.toLowerCase() + ", I recommend checking your transaction history and ensuring your wallet is properly connected.",
      "Great question! Regarding " + userMessage.toLowerCase() + ", here's what I can tell you: This is a common inquiry, and I'll guide you through the process step by step.",
      "I can definitely help with that! For issues related to " + userMessage.toLowerCase() + ", please make sure you're on the correct network and your wallet has sufficient balance."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await simulateAIResponse(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: "Chat cleared! I'm still here to help. What would you like to know?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  const copyMessage = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6 pointer-events-none">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Chat Modal */}
      <Draggable
        nodeRef={nodeRef}
        handle=".drag-handle"
        bounds="parent"
        position={isMobile ? undefined : position}
        onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
        disabled={isMobile}
      >
        <div 
          ref={nodeRef}
          className={cn(
            "relative bg-white rounded-2xl shadow-2xl border border-stone-200 transition-all duration-300 ease-out flex flex-col pointer-events-auto",
            isMinimized 
              ? "w-64 h-14" 
              : "w-[calc(100%-2rem)] sm:w-80 h-[450px] sm:h-[500px]"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Always show when minimized, or when no messages */}
          {(isMinimized || messages.length <= 1) && (
            <div className="drag-handle flex-shrink-0 flex items-center justify-between p-4 border-b border-stone-200 bg-gradient-to-r from-orange-500 to-green-500 rounded-t-2xl cursor-move">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Bot className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">AfriRemit AI</h3>
                  <p className="text-xs text-white/80">Always ready to help</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  title={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 text-white" />
                  ) : (
                    <Minimize2 className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}

          {!isMinimized && (
            <div className="flex flex-col h-full">
              {/* Quick Actions - Only show when no messages */}
              {messages.length <= 1 && (
                <div className="flex-shrink-0 p-3 border-b border-stone-100 bg-stone-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-stone-600">Quick Actions</span>
                    <button
                      onClick={clearChat}
                      className="p-1 rounded-md hover:bg-stone-200 transition-colors"
                      title="Clear chat"
                    >
                      <RotateCcw className="w-3 h-3 text-stone-500" />
                    </button>
                  </div>
                  <div className="flex justify-between gap-2">
                    {[
                      "Help with transfers",
                      "Account issues",
                      "Transaction status"
                    ].map((action) => (
                      <button
                        key={action}
                        onClick={() => {
                          setInputValue(action);
                          handleSendMessage();
                        }}
                        className="px-2 py-1 text-xs bg-white border border-stone-200 rounded-full hover:bg-stone-50 hover:border-orange-500 transition-colors flex-1 text-center truncate"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages Container */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                <div className="flex flex-col-reverse">
                  <div ref={messagesEndRef} />
                  
                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 text-stone-500 animate-spin" />
                          <span className="text-sm text-stone-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {messages.slice().reverse().map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex items-start space-x-3 group mb-4",
                        message.isUser ? "flex-row-reverse space-x-reverse" : ""
                      )}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
                          message.isUser 
                            ? "bg-gradient-to-br from-orange-500 to-orange-600" 
                            : "bg-gradient-to-br from-green-500 to-green-600"
                        )}>
                          {message.isUser ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className={cn(
                        "flex-1 max-w-[280px]",
                        message.isUser ? "flex flex-col items-end" : ""
                      )}>
                        <div className={cn(
                          "relative px-4 py-3 rounded-2xl shadow-sm",
                          message.isUser
                            ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-md"
                            : "bg-white border border-stone-200 text-stone-900 rounded-bl-md"
                        )}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                          
                          {/* Copy button */}
                          <button
                            onClick={() => copyMessage(message.text, message.id)}
                            className={cn(
                              "absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity",
                              message.isUser
                                ? "hover:bg-white/20"
                                : "hover:bg-stone-100"
                            )}
                            title="Copy message"
                          >
                            {copiedId === message.id ? (
                              <CheckCircle className={cn(
                                "w-3 h-3",
                                message.isUser ? "text-white" : "text-green-600"
                              )} />
                            ) : (
                              <Copy className={cn(
                                "w-3 h-3",
                                message.isUser ? "text-white/80" : "text-stone-500"
                              )} />
                            )}
                          </button>
                        </div>
                        
                        {/* Timestamp */}
                        <span className="text-xs text-stone-500 mt-1">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex-shrink-0 p-3 border-t border-stone-200 bg-white">
                <div className="flex items-end space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full resize-none rounded-xl border border-stone-300 px-4 py-3 pr-12 text-sm placeholder-stone-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors"
                      rows={1}
                      style={{
                        minHeight: '44px',
                        maxHeight: '120px'
                      }}
                    />
                    
                    {/* AI Sparkle Icon */}
                    <div className="absolute right-3 top-3">
                      <Sparkles className="w-4 h-4 text-stone-400" />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className={cn(
                      "p-3 rounded-xl transition-all duration-200",
                      inputValue.trim() && !isLoading
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                        : "bg-stone-200 text-stone-400 cursor-not-allowed"
                    )}
                    title="Send message"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Disclaimer */}
                <p className="text-xs text-stone-500 mt-2 text-center">
                  AI responses are generated and may not always be accurate. Please verify important information.
                </p>
              </div>
            </div>
          )}
        </div>
      </Draggable>
    </div>
  );
};

export default AIChatModal;