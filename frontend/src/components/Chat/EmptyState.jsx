import React from 'react';
import { motion } from 'framer-motion';
import SuggestionCards from './SuggestionCards';
import { useAuth } from '../../Context/AuthContext';

const EmptyState = ({ onSuggestionClick }) => {
  const { user } = useAuth();

  return (
    /*
     * flex-1 + flex col so this fills the messages container when there
     * are no messages; items-center + justify-center centres the card.
     * py-6 keeps breathing room even on very small screens (320 px).
     * overflow-x-hidden stops the card's brutal shadows from scrolling.
     */
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex flex-1 flex-col items-center justify-center overflow-x-hidden px-2 py-6 sm:py-8"
    >
      <div className="w-full max-w-2xl">
        {/* Hero card */}
        <div className="brutal-card bg-yellow p-5 text-center text-black sm:p-8">
          {user?.name && (
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-black/60">
              Hi, {user.name}
            </p>
          )}

          <h1 className="mt-1 text-4xl font-extrabold leading-none tracking-normal sm:text-6xl">
            Ask Anything
          </h1>

          <div className="mt-3 grid gap-0.5 text-xl font-extrabold leading-snug sm:text-4xl">
            <span>Build.</span>
            <span>Learn.</span>
            <span>Create.</span>
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="mt-4">
          <SuggestionCards onSuggestionClick={onSuggestionClick} />
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState;
