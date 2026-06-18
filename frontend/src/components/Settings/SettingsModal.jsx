import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Moon, Sun, X } from 'lucide-react';
import { useSettings } from '../../Context/SettingsContext';
import { cn } from '../../utils/cn';

const LANGUAGES = ['English', 'Spanish', 'French', 'Hindi', 'German', 'Japanese', 'Korean', 'Chinese'];

const SettingsModal = ({ isOpen, onClose }) => {
  const { theme, setTheme, language, setLanguage } = useSettings();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="brutal-card relative w-full max-w-md bg-[var(--surface)] p-6"
        >
          <button onClick={onClose} className="brutal-icon-button absolute right-4 top-4 h-10 w-10 shadow-brutalSm" aria-label="Close">
            <X className="h-5 w-5" strokeWidth={3} />
          </button>

          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-black/55">Control Room</p>
          <h2 className="mt-1 text-4xl font-extrabold leading-none">Settings</h2>

          <div className="mt-7 space-y-6">
            <section className="rounded-[16px] border-[3px] border-black bg-background p-4 shadow-brutalSm">
              <label className="mb-3 flex items-center gap-2 text-sm font-extrabold">
                {theme === 'dark' ? <Moon className="h-5 w-5" strokeWidth={3} /> : <Sun className="h-5 w-5" strokeWidth={3} />}
                Theme Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={cn(
                    'rounded-[14px] border-[3px] border-[var(--border)] px-4 py-3 text-sm font-extrabold shadow-brutalSm transition-all duration-200',
                    theme === 'light' ? 'bg-yellow text-black' : 'bg-[var(--surface)] hover:bg-yellow hover:text-black'
                  )}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={cn(
                    'rounded-[14px] border-[3px] border-[var(--border)] px-4 py-3 text-sm font-extrabold shadow-brutalSm transition-all duration-200',
                    theme === 'dark' ? 'bg-yellow text-black' : 'bg-[var(--surface)] hover:bg-yellow hover:text-black'
                  )}
                >
                  Dark
                </button>
              </div>
            </section>

            <section className="rounded-[16px] border-[3px] border-black bg-background p-4 shadow-brutalSm">
              <label className="mb-3 flex items-center gap-2 text-sm font-extrabold">
                <Globe className="h-5 w-5" strokeWidth={3} />
                Response Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="brutal-input brutal-focus w-full appearance-none px-4 py-3 text-sm font-extrabold"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </section>
          </div>

          <button onClick={onClose} className="brutal-button mt-7 w-full bg-yellow px-5 py-3 text-base font-extrabold text-black">
            Save Settings
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal;
