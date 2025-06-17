import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import ReactMarkdown from 'react-markdown';
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
  GripVertical,
  AlertTriangle
} from 'lucide-react';

// Import the OpenRouter service
import { getAIResponse, getContextualHelp, isConfigured } from './OpenRouter';

// Utility function for className concatenation
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const AIChatModal = ({ isOpen, onClose, context = 'general' }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "How can I help!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
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

  // Check if OpenRouter is configured
  useEffect(() => {
    if (!isConfigured()) {
      setError('OpenRouter API is not properly configured. Please set up your API key.');
    }
  }, []);

  // Get AI response using OpenRouter
  const getSmartAIResponse = async (userMessage, messageHistory) => {
    try {
      // Prepare conversation history for context
      const conversationMessages = messageHistory
        .slice(-10) // Last 10 messages for context
        .map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        }));

      // Add current message
      conversationMessages.push({
        role: 'user',
        content: userMessage
      });

      // Use contextual help if context is provided and it's a simple query
      if (context !== 'general' && conversationMessages.length <= 2) {
        return await getContextualHelp(context, userMessage);
      }

      // Otherwise use full conversation context
      return await getAIResponse(conversationMessages);
    } catch (error) {
      console.error('AI Response Error:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Check configuration first
    if (!isConfigured()) {
      setError('Please configure your OpenRouter API key to use the AI assistant.');
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await getSmartAIResponse(inputValue, messages);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      
      let errorMessage = "I apologize, but I'm having trouble responding right now. ";
      
      if (error.message.includes('API key')) {
        errorMessage += "Please check your Internet configuration.";
      } else if (error.message.includes('Rate limit')) {
        errorMessage += "I'm receiving too many requests. Please try again in a moment.";
      } else if (error.message.includes('service')) {
        errorMessage += "The AI service is temporarily unavailable. Please try again later.";
      } else {
        errorMessage += "Please try again in a moment.";
      }
      
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: "Chat cleared! I'm still here to help with AfriRemit, blockchain, and DeFi questions. What would you like to know?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  const copyMessage = (text, messageId) => {
    navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Quick action prompts specific to AfriRemit
  const quickActions = [
    "How do I swap tokens?",
    "Explain Ajo savings",
    "Check transaction fees"
  ];

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
          {/* Header */}
          {(isMinimized || messages.length <= 1) && (
            <div className="drag-handle flex-shrink-0 flex items-center justify-between p-4 border-b border-stone-200 bg-gradient-to-r from-orange-500 to-green-500 rounded-t-2xl cursor-move">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Bot className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                    isConfigured() ? "bg-green-500" : "bg-red-500"
                  )}></div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">AfriRemit AI</h3>
                  <p className="text-xs text-white/80">
                    {isConfigured() ? "Blockchain & DeFi Expert" : "Configuration needed"}
                  </p>
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
              {/* Quick Actions */}
              {messages.length <= 1 && (
                <div className="flex-shrink-0 p-3 border-b border-stone-100 bg-stone-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-stone-600">Quick Help</span>
                    <button
                      onClick={clearChat}
                      className="p-1 rounded-md hover:bg-stone-200 transition-colors"
                      title="Clear chat"
                    >
                      <RotateCcw className="w-3 h-3 text-stone-500" />
                    </button>
                  </div>
                  <div className="flex justify-between gap-2">
                    {quickActions.map((action) => (
                      <button
                        key={action}
                        onClick={() => {
                          setInputValue(action);
                          setTimeout(handleSendMessage, 100);
                        }}
                        className="px-2 py-1 text-xs bg-white border border-stone-200 rounded-full hover:bg-stone-50 hover:border-orange-500 transition-colors flex-1 text-center truncate"
                        disabled={!isConfigured()}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div className="flex-shrink-0 p-2 bg-red-50 border-b border-red-200">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-red-700">{error}</span>
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
                          <span className="text-sm text-stone-600">Analyzing your question...</span>
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
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            <ReactMarkdown
                              components={{
                                h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1" {...props} />,
                                p: ({node, ...props}) => <p className="mb-2" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                code: ({node, inline, ...props}) => 
                                  inline ? 
                                    <code className="bg-stone-100 px-1 py-0.5 rounded text-sm" {...props} /> :
                                    <code className="block bg-stone-100 p-2 rounded text-sm mb-2" {...props} />,
                                pre: ({node, ...props}) => <pre className="bg-stone-100 p-2 rounded text-sm mb-2 overflow-x-auto" {...props} />,
                                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-stone-300 pl-4 italic mb-2" {...props} />,
                                a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                              }}
                            >
                              {message.text}
                            </ReactMarkdown>
                          </p>
                          
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
                      placeholder={isConfigured() ? "Talk blockchain..." : "Configure API key to use AI assistant"}
                      className="w-full resize-none rounded-xl border border-stone-300 px-4 py-3 pr-12 text-sm placeholder-stone-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors disabled:bg-stone-100 disabled:cursor-not-allowed"
                      rows={1}
                      style={{
                        minHeight: '44px',
                        maxHeight: '120px'
                      }}
                      disabled={!isConfigured()}
                    />
                    
                    {/* AI Sparkle Icon */}
                    <div className="absolute right-3 top-3">
                      <Sparkles className={cn(
                        "w-4 h-4",
                        isConfigured() ? "text-stone-400" : "text-stone-300"
                      )} />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading || !isConfigured()}
                    className={cn(
                      "p-3 rounded-xl transition-all duration-200",
                      inputValue.trim() && !isLoading && isConfigured()
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