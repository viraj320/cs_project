import React, { useState } from 'react';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

const ChatMessage = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
    <div className={`max-w-xs px-4 py-2 rounded-2xl shadow-md text-sm ${
      isUser ? 'bg-orange-500 text-white' : 'bg-orange-100 text-gray-800'
    }`}>
      {message}
    </div>
  </div>
);

const CoolChat = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you with spare parts today?', isUser: false }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() === '') return;
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="w-full max-w-md h-[500px] flex flex-col border rounded-2xl shadow-lg bg-orange-50">
      <div className="bg-gradient-to-r from-orange-300 to-orange-500 text-white text-lg font-semibold p-4 rounded-t-2xl">
        Smart Vehicle Chat Assistant
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-1 bg-orange-100">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
        ))}
      </div>
      <div className="p-3 border-t flex items-center bg-white">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border bg-gray-100 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={sendMessage}
          className="ml-3 p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
        >
          <PaperPlaneIcon />
        </button>
      </div>
    </div>
  );
};

export default CoolChat;
