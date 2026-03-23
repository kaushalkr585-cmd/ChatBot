import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Menu, User, Sparkles, LogIn } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

const Header = ({ toggleSidebar, onAuthClick, onProfileClick, onSettingsClick }) => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 glassmorphism z-40 flex items-center justify-between px-4 sm:px-6 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </motion.button>
        
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-accent animate-pulse-slow" />
          <h1 className="text-xl font-bold bg-gemini-gradient bg-clip-text text-transparent font-outfit tracking-tight">
            ChatBot
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onProfileClick}
            className="rounded-full overflow-hidden w-9 h-9 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-colors shadow-sm flex items-center justify-center bg-secondary"
            title={user.name}
          >
             {user.profilePicture ? (
               <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
             ) : (
               <User className="w-5 h-5 text-foreground/50 m-1" />
             )}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAuthClick}
            className="px-4 py-2 rounded-xl bg-accent text-white font-medium hover:bg-opacity-90 transition-colors shadow-md text-sm flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </motion.button>
        )}
      </div>
    </header>
  );
};

export default Header;
