import React, { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import EmptyState from './EmptyState';
import TypingIndicator from './TypingIndicator';

const ChatArea = ({ messages, isTyping, onSuggestionClick }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <section className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-background px-3 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-full max-w-5xl flex-col gap-6">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <EmptyState key="empty" onSuggestionClick={onSuggestionClick} />
          ) : (
            messages.map((message, idx) => (
              <ChatMessage key={`${message.role}-${idx}`} message={message} />
            ))
          )}
        </AnimatePresence>

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} className="h-2 shrink-0" />
      </div>
    </section>
  );
};

export default ChatArea;
