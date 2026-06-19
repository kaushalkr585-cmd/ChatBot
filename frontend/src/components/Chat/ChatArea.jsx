import React, { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import EmptyState from './EmptyState';
import TypingIndicator from './TypingIndicator';

const ChatArea = ({ messages, isTyping, onSuggestionClick }) => {
  const bottomRef = useRef(null);
  const scrollRef = useRef(null);

  // Scroll ONLY the messages container — never the page
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    /*
     * flex-1  → fills all space between ChatHeader and ChatInput
     * min-h-0 → overrides the browser flex default (min-height: auto) so that
     *           overflow-y-auto actually kicks in instead of growing infinitely
     * overflow-y-auto   → this is the ONLY scrollable region in the entire app
     * overflow-x-hidden → no horizontal scroll ever leaks from message content
     */
    <section
      ref={scrollRef}
      className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-background"
    >
      {/*
       * Inner container: px gives breathing room on mobile.
       * max-w-5xl keeps long bot responses readable on wide screens.
       * min-h-full allows EmptyState to vertically centre itself.
       */}
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-5 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
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

        {/* Invisible anchor — scrolled into view when new messages arrive */}
        <div ref={bottomRef} className="h-1 shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
};

export default ChatArea;
