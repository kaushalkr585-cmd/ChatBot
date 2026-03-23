import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-4 max-w-full flex-row items-center py-2">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="relative w-8 h-8 rounded-full flex items-center justify-center shrink-0"
      >
        <div className="absolute inset-0 rounded-full bg-gemini-gradient blur-sm animate-pulse" />
        <div className="relative w-full h-full bg-background rounded-full flex items-center justify-center z-10 border border-border/50">
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
      </motion.div>
      <div className="text-sm text-foreground/60 font-medium tracking-wide animate-pulse">
        Generating response...
      </div>
    </div>
  );
};

export default TypingIndicator;
