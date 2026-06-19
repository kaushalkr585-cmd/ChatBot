import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Image as ImageIcon, Loader2, Mic, Send, Smile, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useSettings } from '../../Context/SettingsContext';

const ChatInput = ({ onSend, isTyping }) => {
  const { theme } = useSettings();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i += 1) {
          currentTranscript += event.results[i][0].transcript;
        }
        setText(currentTranscript);
      };

      recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition error:', event.error);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-grow textarea — capped at 132 px (≈ 5 lines)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 132)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if ((!text.trim() && !imagePreview) || isTyping) return;
    onSend(text, imagePreview);
    setText('');
    setImagePreview(null);
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Voice search is not supported in this browser.');
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setText('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const canSend = (text.trim().length > 0 || imagePreview) && !isTyping;

  return (
    /*
     * shrink-0  → this bar NEVER compresses; it always sits at the bottom of
     *             the flex column regardless of how many messages there are.
     * relative  → so the emoji picker (absolute) positions against this footer.
     * safe-area → on iOS the home indicator sits below; env() adds that padding.
     * No position:fixed — being in-flow avoids every Android Chrome viewport bug.
     */
    <footer
      ref={footerRef}
      className="relative shrink-0 border-t-[3px] border-[var(--border)] bg-[var(--surface)] px-2 pt-2 pb-2 sm:px-5 sm:py-4"
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
    >
      {/* Emoji picker — pops up ABOVE the footer */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-full left-2 z-50 mb-2 overflow-hidden rounded-[18px] border-[3px] border-[var(--border)] bg-[var(--surface)] shadow-brutal"
          >
            <EmojiPicker
              theme={theme === 'dark' ? 'dark' : 'light'}
              onEmojiClick={(emojiData) => {
                setText((prev) => prev + emojiData.emoji);
              }}
              width={Math.min(window.innerWidth - 16, 350)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto w-full max-w-5xl">
        {/* Image preview strip */}
        <AnimatePresence>
          {imagePreview && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="mb-2 inline-flex items-center gap-3 rounded-[16px] border-[3px] border-black bg-yellow p-2 shadow-brutal"
            >
              <img
                src={imagePreview}
                alt="Preview"
                className="h-14 w-14 rounded-xl border-[3px] border-black object-cover"
              />
              <button
                onClick={() => setImagePreview(null)}
                className="brutal-icon-button h-9 w-9 bg-white shadow-brutalSm"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" strokeWidth={3} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main input row */}
        <div className="brutal-input flex w-full items-end gap-1.5 p-1.5 sm:gap-2 sm:p-2">
          {/* Image upload */}
          <label
            className="brutal-icon-button h-10 w-10 shrink-0 bg-[var(--surface)] shadow-brutalSm"
            title="Add image"
            aria-label="Add image"
          >
            <ImageIcon className="h-5 w-5" strokeWidth={3} />
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>

          {/* Emoji */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((v) => !v)}
            className="brutal-icon-button h-10 w-10 shrink-0 bg-[var(--surface)] shadow-brutalSm"
            title="Insert emoji"
            aria-label="Insert emoji"
          >
            <Smile className="h-5 w-5" strokeWidth={3} />
          </button>

          {/*
           * Textarea — flex-1 so it always fills available width between icons.
           * min-w-0 prevents it from overflowing on narrow screens (320 px).
           */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? 'Listening...' : 'Message...'}
            className="hide-scrollbar min-w-0 flex-1 resize-none rounded-[14px] border-[3px] border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm font-bold leading-relaxed text-[var(--foreground)] shadow-brutalSm outline-none placeholder:text-[var(--muted)] sm:text-base"
            style={{ minHeight: '42px', maxHeight: '132px' }}
            rows={1}
          />

          {/* Voice */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`brutal-icon-button h-10 w-10 shrink-0 shadow-brutalSm ${
              isRecording ? 'bg-red' : 'bg-[var(--surface)]'
            }`}
            aria-label="Voice input"
            title="Voice input"
          >
            <Mic className="h-5 w-5" strokeWidth={3} />
          </button>

          {/* Send */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="brutal-icon-button h-10 w-10 shrink-0 bg-yellow text-black shadow-brutalSm disabled:cursor-not-allowed disabled:bg-[var(--surface)] disabled:opacity-40"
            aria-label="Send message"
            title="Send"
          >
            {isTyping ? (
              <Loader2 className="h-5 w-5 animate-spin" strokeWidth={3} />
            ) : (
              <Send className="h-5 w-5" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default ChatInput;
