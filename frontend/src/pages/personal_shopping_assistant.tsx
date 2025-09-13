'use client';
import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
}

export default function PersonalShoppingAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi there! I'm your personal shopping assistant. Tell me what you're looking for, and I'll find the best options for you."
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    // TODO: Implement AI response logic
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800/50 p-4 flex items-center">
        <Link href="/" className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-semibold ml-4">Shopping Assistant</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'assistant' && (
              <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                <Image
                  src="/ai-assistant.jpg"
                  alt="AI Assistant"
                  width={32}
                  height={32}
                />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-800/50">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Describe what you're looking for..."
            className="flex-1 bg-gray-700 rounded-full px-6 py-3 text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 rounded-full p-3"
            onClick={handleSend}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}