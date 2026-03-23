import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, Mic, X, Loader2, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const ChatInput = ({ onSend, isTyping }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setText(currentTranscript);
      };

      recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
          console.warn("Speech recognition error:", event.error);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim() && !imagePreview) return;
    onSend(text, imagePreview);
    setText('');
    setImagePreview(null);
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
      alert("Voice search is not supported in this browser.");
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

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 pb-6 md:pb-8 flex justify-center bg-gradient-to-t from-background via-background to-transparent z-30 pointer-events-none">
      <div className="w-full max-w-4xl relative pointer-events-auto">
        
        {/* Emoji Picker Popover */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-20 left-4 z-50 shadow-2xl"
            >
              <EmojiPicker
                theme="auto"
                onEmojiClick={(emojiData) => {
                  setText(prev => prev + emojiData.emoji);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Multimodal Previews */}
        <AnimatePresence>
          {imagePreview && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute -top-20 left-4 glassmorphism p-2 rounded-xl group"
            >
              <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg" />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          animate={isRecording ? { scale: 1.01, boxShadow: '0 0 20px rgba(66, 133, 244, 0.15)' } : {}}
          className="bg-[#f0f4f9] dark:bg-[#1e1f20] rounded-[32px] p-4 flex flex-col gap-2 shadow-lg transition-colors duration-300 w-full"
        >
          {/* Text Area Row */}
          <div className="flex-1 w-full px-2">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "Listening..." : "Ask ChatBot..."}
              className="w-full bg-transparent resize-none outline-none custom-scrollbar text-[16px] placeholder:text-foreground/40 leading-relaxed text-foreground min-h-[44px]"
              rows={1}
            />
          </div>

          {/* Action Tools Row */}
          <div className="flex justify-between items-center w-full px-1">
            {/* Left Tools */}
            <div className="flex items-center gap-1">
              <button
                 type="button"
                 title="Add image"
                 className="p-2.5 bg-transparent hover:bg-white/5 rounded-full cursor-pointer transition-colors text-foreground/50 hover:text-foreground/90"
              >
                <label className="cursor-pointer flex items-center justify-center w-full h-full">
                   <ImageIcon className="w-5 h-5" />
                   <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </button>
              <button
                 type="button"
                 title="Insert emoji"
                 onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                 className="p-2.5 bg-transparent hover:bg-white/5 rounded-full transition-colors text-foreground/50 hover:text-foreground/90"
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>

            {/* Right Tools */}
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleRecording}
                className={`p-2.5 rounded-full transition-colors flex items-center justify-center ${
                  isRecording 
                    ? 'bg-red-500/20 text-red-500' 
                    : 'bg-transparent hover:bg-white/5 text-foreground/50 hover:text-foreground/90'
                }`}
              >
                {isRecording ? (
                   <span className="flex gap-1 items-center px-1">
                     <span className="w-1.5 h-3 bg-red-500 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-4 bg-red-500 rounded-full animate-bounce delay-75"></span>
                     <span className="w-1.5 h-2 bg-red-500 rounded-full animate-bounce delay-150"></span>
                   </span>
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </motion.button>

              {/* Only show Send if there is content */}
              {(text.length > 0 || imagePreview) && (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isTyping}
                  className="p-3 ml-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(66,133,244,0.39)] hover:shadow-[0_6px_20px_rgba(66,133,244,0.23)] transition-all"
                >
                  {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
        <div className="text-center mt-3 text-[11px] text-foreground/40 font-medium tracking-wide">
          Developed by Kaushal Kumar
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
