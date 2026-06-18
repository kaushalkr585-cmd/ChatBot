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
    <footer className="relative shrink-0 border-t-[3px] border-[var(--border)] bg-[var(--surface)] px-2 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))] sm:px-5 sm:py-4">
      <div className="mx-auto max-w-5xl">
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-[calc(100%-4px)] left-4 z-30 overflow-hidden rounded-[18px] border-[3px] border-[var(--border)] bg-[var(--surface)] shadow-brutal"
            >
              <EmojiPicker
                theme={theme === 'dark' ? 'dark' : 'light'}
                onEmojiClick={(emojiData) => {
                  setText((prev) => prev + emojiData.emoji);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {imagePreview && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mb-3 inline-flex items-center gap-3 rounded-[16px] border-[3px] border-black bg-yellow p-2 shadow-brutal"
            >
              <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded-xl border-[3px] border-black object-cover" />
              <button
                onClick={() => setImagePreview(null)}
                className="brutal-icon-button h-10 w-10 bg-white shadow-brutalSm"
                aria-label="Remove image"
              >
                <X className="h-5 w-5" strokeWidth={3} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="brutal-input flex items-end gap-1.5 bg-[var(--surface)] p-1.5 sm:gap-3 sm:p-3">
          <label className="brutal-icon-button h-10 w-10 shrink-0 bg-[var(--surface)] shadow-brutalSm sm:h-12 sm:w-12" title="Add image" aria-label="Add image">
            <ImageIcon className="h-5 w-5" strokeWidth={3} />
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>

          <button
            type="button"
            onClick={() => setShowEmojiPicker((value) => !value)}
            className="brutal-icon-button h-10 w-10 shrink-0 bg-[var(--surface)] shadow-brutalSm sm:h-12 sm:w-12"
            title="Insert emoji"
            aria-label="Insert emoji"
          >
            <Smile className="h-5 w-5" strokeWidth={3} />
          </button>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? 'Listening...' : 'Message...'}
            className="flex-1 min-h-[40px] max-h-32 resize-none rounded-[14px] border-[3px] border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-bold leading-relaxed text-[var(--foreground)] shadow-brutalSm outline-none placeholder:text-[var(--muted)] hide-scrollbar sm:min-h-[48px] sm:px-4 sm:text-base"
            rows={1}
          />

          <button
            type="button"
            onClick={toggleRecording}
            className={`brutal-icon-button h-10 w-10 shrink-0 shadow-brutalSm sm:h-12 sm:w-12 ${isRecording ? 'bg-red' : 'bg-[var(--surface)]'}`}
            aria-label="Voice input"
            title="Voice input"
          >
            <Mic className="h-5 w-5" strokeWidth={3} />
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="brutal-icon-button h-10 w-10 shrink-0 bg-yellow text-black shadow-brutalSm disabled:cursor-not-allowed disabled:bg-[var(--surface)] disabled:opacity-45 sm:h-12 sm:w-12"
            aria-label="Send message"
            title="Send"
          >
            {isTyping ? <Loader2 className="h-5 w-5 animate-spin" strokeWidth={3} /> : <Send className="h-5 w-5" strokeWidth={3} />}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default ChatInput;
