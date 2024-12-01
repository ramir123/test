import React, { useEffect, useRef } from 'react';

interface GameLogProps {
  messages: string[];
}

export function GameLog({ messages }: GameLogProps) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={logRef}
      className="bg-gray-800 text-white p-4 rounded-lg mt-4 h-48 overflow-y-auto scroll-smooth"
    >
      {messages.map((message, index) => (
        <p key={index} className="mb-2">
          {message}
        </p>
      ))}
    </div>
  );
}