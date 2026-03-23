import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Globe } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { cn } from '../../utils/cn';

const SettingsModal = ({ isOpen, onClose }) => {
  const { theme, setTheme, language, setLanguage } = useSettings();

  if (!isOpen) return null;

  const LANGUAGES = ['English', 'Spanish', 'French', 'Hindi', 'German', 'Japanese', 'Korean', 'Chinese'];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card w-full max-w-md rounded-2xl p-6 relative shadow-2xl border border-white/10"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-foreground/70" />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-foreground">Settings</h2>

          <div className="space-y-6">
            {/* Theme Toggle */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                Theme Preference
              </label>
              <div className="flex gap-2 p-1 bg-secondary rounded-lg">
                <button
                  onClick={() => setTheme('light')}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-md transition-all shadow-sm",
                    theme === 'light' ? "bg-card text-foreground" : "text-foreground/50 hover:text-foreground"
                  )}
                >
                  Light Mode
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-md transition-all shadow-sm",
                    theme === 'dark' ? "bg-card text-foreground" : "text-foreground/50 hover:text-foreground"
                  )}
                >
                  Dark Mode
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="space-y-3">
               <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Response Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 text-foreground outline-none focus:border-accent transition-colors appearance-none"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang} className="bg-white text-black dark:bg-[#0B0B0F] dark:text-white">{lang}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              onClick={onClose}
              className="w-full py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal;
