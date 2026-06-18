import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-[3px] border-black bg-green shadow-brutalSm">
        <Bot className="h-6 w-6" strokeWidth={3} />
      </div>
      <div className="rounded-[18px] border-[3px] border-black bg-white px-5 py-4 shadow-brutal">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-[3px] border-black bg-yellow animate-typing" />
          <span className="h-3 w-3 rounded-full border-[3px] border-black bg-blue-500 animate-typing [animation-delay:0.12s]" />
          <span className="h-3 w-3 rounded-full border-[3px] border-black bg-red animate-typing [animation-delay:0.24s]" />
          <span className="ml-2 text-sm font-extrabold">Thinking</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
