import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Lock, Mail, User, X } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          className="brutal-card relative w-full max-w-md bg-[var(--surface)] p-6 sm:p-8"
        >
          <button onClick={onClose} className="brutal-icon-button absolute right-4 top-4 h-10 w-10 shadow-brutalSm" aria-label="Close">
            <X className="h-5 w-5" strokeWidth={3} />
          </button>

          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">Account</p>
          <h2 className="mt-1 text-4xl font-extrabold leading-none">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="mt-3 max-w-xs text-sm font-bold text-[var(--muted)]">
            {isLogin ? 'Sign in to sync your chat history.' : 'Sign up to save every conversation.'}
          </p>

          {error && (
            <div className="mt-5 rounded-[14px] border-[3px] border-black bg-red p-3 text-sm font-extrabold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" strokeWidth={3} />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  className="brutal-input brutal-focus w-full py-3 pl-12 pr-4 text-sm font-bold text-[var(--foreground)] placeholder:text-[var(--muted)]"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" strokeWidth={3} />
              <input
                type="email"
                required
                placeholder="Email Address"
                className="brutal-input brutal-focus w-full py-3 pl-12 pr-4 text-sm font-bold text-[var(--foreground)] placeholder:text-[var(--muted)]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" strokeWidth={3} />
              <input
                type="password"
                required
                placeholder="Password"
                className="brutal-input brutal-focus w-full py-3 pl-12 pr-4 text-sm font-bold text-[var(--foreground)] placeholder:text-[var(--muted)]"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="brutal-button flex w-full items-center justify-center bg-yellow px-5 py-3 text-base font-extrabold disabled:cursor-not-allowed disabled:opacity-55"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" strokeWidth={3} /> : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-bold text-[var(--muted)]">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLogin(!isLogin)} className="font-extrabold underline decoration-[3px] underline-offset-4">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
