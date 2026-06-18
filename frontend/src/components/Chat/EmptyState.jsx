import React from 'react';
import { motion } from 'framer-motion';
import SuggestionCards from './SuggestionCards';
import { useAuth } from '../../Context/AuthContext';

const EmptyState = ({ onSuggestionClick }) => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex min-h-full items-center justify-center px-3 py-4 sm:py-8"
    >
      <div className="w-full max-w-3xl">
        <div className="brutal-card bg-yellow p-4 text-center text-black sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-black/60">
            {user?.name ? `Hi, ${user.name}` : ''}
          </p>
          <h1 className="mt-1 text-4xl font-extrabold leading-none tracking-normal sm:text-7xl">Ask Anything</h1>
          <div className="mt-3 grid gap-0.5 text-2xl font-extrabold leading-none sm:text-5xl">
            <span>Build.</span>
            <span>Learn.</span>
            <span>Create.</span>
          </div>
        </div>

        <div className="mt-4">
          <SuggestionCards onSuggestionClick={onSuggestionClick} />
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState;
