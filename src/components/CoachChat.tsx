import { useState, useRef, useEffect } from 'react';
import { useCoachChat } from '../api/hooks';
import Card from './Card';
import Button from './Button';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

type Props = {
  userId: string;
  lookbackDays?: number;
};

export default function CoachChat({ userId, lookbackDays = 30 }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatMutation = useCoachChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      const result = await chatMutation.mutateAsync({
        user_id: userId,
        message: inputText.trim(),
        lookback_days: lookbackDays
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.reply,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card>
      <div className="heading">AI Coach</div>
      <div className="subtle mt-1">Context from last {lookbackDays} days</div>
      
      {/* Messages */}
      <div className="mt-3 max-h-48 overflow-y-auto space-y-2">
        {messages.length === 0 && (
          <div className="text-xs text-silver text-center py-4">
            Ask me anything about your meditation practice
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-2 rounded-lg text-xs ${
                message.isUser
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-silver'
              }`}
            >
              <div>{message.text}</div>
              <div className="text-[10px] opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-silver p-2 rounded-lg text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about your practice..."
          className="flex-1 bg-graphite text-white border border-white/10 rounded-lg px-3 py-2 text-xs placeholder-silver/60 focus:outline-none focus:ring-2 focus:ring-white/10"
          disabled={isLoading}
        />
        <Button
          label="Send"
          onClick={sendMessage}
          disabled={!inputText.trim() || isLoading}
        />
      </div>
      
      {error && (
        <div className="mt-2 text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
          {error}
        </div>
      )}
    </Card>
  );
}
