'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Phone,
  Mail,
  Clock,
  HelpCircle,
  ShoppingCart,
  Package,
  Shield
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'quick-reply' | 'order-status' | 'product-info';
}

interface QuickReply {
  text: string;
  action: string;
}

const quickReplies: QuickReply[] = [
  { text: 'Track my order', action: 'order-status' },
  { text: 'Product recommendations', action: 'recommendations' },
  { text: 'Payment issues', action: 'payment' },
  { text: 'Return policy', action: 'returns' },
  { text: 'Speak to human', action: 'human' }
];

const botResponses = {
  greeting: "Namaste! I'm your RajyaBazaar assistant. How can I help you today?",
  orderStatus: "I can help you track your order. Please provide your order ID or I can show you recent orders if you're logged in.",
  recommendations: "I'd be happy to recommend some royal artifacts! What type of products are you interested in? (e.g., weapons, jewelry, books)",
  payment: "For payment issues, I can help you with common problems. What specific payment method are you having trouble with?",
  returns: "Our return policy allows returns within 30 days of purchase. Items must be in original condition. Would you like to start a return?",
  human: "I'm connecting you to a human representative. Please wait a moment...",
  default: "I understand you're asking about that. Let me help you with that. Could you provide more details?"
};

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: botResponses.greeting,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { totalItems } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot', type: Message['type'] = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleQuickReply = (reply: QuickReply) => {
    addMessage(reply.text, 'user');
    setIsTyping(true);

    setTimeout(() => {
      let response = botResponses.default;
      
      switch (reply.action) {
        case 'order-status':
          response = user 
            ? "I can see you have recent orders. Let me check the status for you..."
            : botResponses.orderStatus;
          break;
        case 'recommendations':
          response = "Based on our royal collection, I recommend our Maharaj's Pick items. Would you like to see our featured products?";
          break;
        case 'payment':
          response = botResponses.payment;
          break;
        case 'returns':
          response = botResponses.returns;
          break;
        case 'human':
          response = botResponses.human;
          break;
      }

      addMessage(response, 'bot');
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addMessage(userMessage, 'user');
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response = botResponses.default;
      
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('order') || lowerMessage.includes('track')) {
        response = botResponses.orderStatus;
      } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
        response = botResponses.recommendations;
      } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
        response = botResponses.payment;
      } else if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
        response = botResponses.returns;
      } else if (lowerMessage.includes('human') || lowerMessage.includes('agent')) {
        response = botResponses.human;
      }

      addMessage(response, 'bot');
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="bg-primary text-primary-foreground pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <CardTitle className="text-lg">RajyaBazaar Assistant</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs">
                Online
              </Badge>
            </div>
            <p className="text-sm opacity-90">
              How can I help you today?
            </p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`rounded-lg px-3 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="p-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <Button
                      key={reply.text}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs"
                    >
                      {reply.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
} 