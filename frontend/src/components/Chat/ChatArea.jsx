import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Sparkles, Image as ImageIcon, Compass, Music, PenTool, Lightbulb, Zap } from 'lucide-react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { useAuth } from '../../context/AuthContext';

const ChatArea = ({ messages, isTyping }) => {
  const bottomRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-12 lg:px-24 custom-scrollbar pb-32">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <AnimatePresence>
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex items-center justify-center p-8 mt-12 mb-32"
          >
            <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-accent animate-pulse-slow" />
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight flex items-center gap-2">
                  Hi <span className="text-foreground/80 font-normal">{user ? user.name : 'Guest'}</span>
                </h2>
              </div>
              <h1 className="text-4xl md:text-[56px] font-medium text-foreground tracking-tight mb-8 leading-tight font-outfit">
                Where should we start?
              </h1>

              {/* Gemini Suggestion Chips */}
              <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-2xl">
                <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#f0f4f9] hover:bg-[#e1e5ea] dark:bg-[#1e1f20] dark:hover:bg-[#282a2c] border border-black/5 dark:border-white/5 transition-colors text-sm text-foreground/80 hover:text-foreground">
                  <ImageIcon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  Create image
                </button>
                <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#f0f4f9] hover:bg-[#e1e5ea] dark:bg-[#1e1f20] dark:hover:bg-[#282a2c] border border-black/5 dark:border-white/5 transition-colors text-sm text-foreground/80 hover:text-foreground">
                  <Compass className="w-4 h-4 text-red-500 dark:text-red-400" />
                  Explore cricket
                </button>
                <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#f0f4f9] hover:bg-[#e1e5ea] dark:bg-[#1e1f20] dark:hover:bg-[#282a2c] border border-black/5 dark:border-white/5 transition-colors text-sm text-foreground/80 hover:text-foreground">
                  <Music className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  Create music
                </button>
                <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#f0f4f9] hover:bg-[#e1e5ea] dark:bg-[#1e1f20] dark:hover:bg-[#282a2c] border border-black/5 dark:border-white/5 transition-colors text-sm text-foreground/80 hover:text-foreground">
                  <Lightbulb className="w-4 h-4 text-yellow-500 dark:text-yellow-400 hidden sm:block" />
                  Help me learn
                </button>
                <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#f0f4f9] hover:bg-[#e1e5ea] dark:bg-[#1e1f20] dark:hover:bg-[#282a2c] border border-black/5 dark:border-white/5 transition-colors text-sm text-foreground/80 hover:text-foreground">
                  <PenTool className="w-4 h-4 text-blue-500 dark:text-blue-400 hidden sm:block" />
                  Write anything
                </button>
                <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#f0f4f9] hover:bg-[#e1e5ea] dark:bg-[#1e1f20] dark:hover:bg-[#282a2c] border border-black/5 dark:border-white/5 transition-colors text-sm text-foreground/80 hover:text-foreground">
                  <Zap className="w-4 h-4 text-orange-500 dark:text-orange-400 hidden sm:block" />
                  Boost my day
                </button>
              </div>
            </div>
          </motion.div>
        ) : (messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))
        )}
        </AnimatePresence>
        
        {isTyping && <TypingIndicator />}
        
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};

export default ChatArea;
