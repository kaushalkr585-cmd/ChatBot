import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
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
      onClose(); // Close modal on success
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="w-full max-w-md p-8 relative rounded-3xl glassmorphism border border-white/10 shadow-2xl bg-background/80"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-foreground/50 hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-3xl font-bold bg-gemini-gradient bg-clip-text text-transparent mb-2 font-outfit">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-foreground/60 mb-6">
            {isLogin ? 'Sign in to sync your chat history.' : 'Sign up to get started.'}
          </p>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 bg-black/5 dark:bg-white/5 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-foreground/40 text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 bg-black/5 dark:bg-white/5 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-foreground/40 text-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 bg-black/5 dark:bg-white/5 border border-border rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-foreground/40 text-sm"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity flex justify-center items-center shadow-lg hover:shadow-xl disabled:opacity-50 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground/60">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent font-medium hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
