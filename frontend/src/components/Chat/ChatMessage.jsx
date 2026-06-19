import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Bot, Copy, RefreshCw, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../Context/AuthContext';

const ChatMessage = ({ message }) => {
  const { user } = useAuth();
  const isUser = message.role === 'user';

  const copyText = () => {
    navigator.clipboard.writeText(message.content || '');
  };

  return (
    /*
     * w-full + overflow-x-hidden on the article prevents any single message
     * from causing horizontal scroll on the page.
     */
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'flex w-full gap-2 overflow-x-hidden sm:gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Bot avatar — hidden on mobile to give more bubble width */}
      {!isUser && (
        <div className="mt-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[var(--border)] bg-green shadow-brutalSm sm:flex">
          <Bot className="h-5 w-5" strokeWidth={3} />
        </div>
      )}

      {/*
       * max-w-[88%] on mobile → wider bubbles on small screens (320–414 px).
       * max-w-[72%] on sm+    → narrower for readability on wider screens.
       * overflow-hidden prevents code blocks etc. from blowing out the layout.
       * min-w-0 stops flex children from ignoring the max-width constraint.
       */}
      <div
        className={cn(
          'group flex min-w-0 flex-col gap-2 overflow-hidden',
          isUser ? 'items-end max-w-[88%] sm:max-w-[72%]' : 'items-start max-w-[92%] sm:max-w-[78%]'
        )}
      >
        <div
          className={cn(
            'w-full overflow-hidden rounded-[18px] border-[3px] border-[var(--border)] px-4 py-3 text-[14px] font-semibold leading-relaxed shadow-brutal sm:px-5 sm:py-4 sm:text-[15px]',
            isUser
              ? 'bg-yellow text-black'
              : 'bg-[var(--surface)] text-[var(--foreground)]'
          )}
        >
          {/* Uploaded image preview */}
          {message.hasImage && message.imageBase64 && (
            <img
              src={message.imageBase64}
              alt="Uploaded preview"
              className="mb-3 max-h-60 w-auto max-w-full rounded-[14px] border-[3px] border-[var(--border)] object-contain sm:max-h-72"
            />
          )}

          {isUser ? (
            /* User messages: plain pre-wrap text, always breaks long words */
            <p className="break-words whitespace-pre-wrap">{message.content}</p>
          ) : (
            /* Bot messages: markdown rendered; max-width + overflow-x-hidden
               prevent code blocks from creating horizontal scroll */
            <div className="markdown-body max-w-full break-words overflow-x-hidden">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Copy / Regenerate actions — always visible on mobile, hover on desktop */}
        {!isUser && (
          <div className="flex items-center gap-2 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
            <button
              onClick={copyText}
              className="brutal-icon-button h-9 w-9 shadow-brutalSm"
              aria-label="Copy response"
              title="Copy"
            >
              <Copy className="h-4 w-4" strokeWidth={3} />
            </button>
            <button
              className="brutal-icon-button h-9 w-9 shadow-brutalSm"
              aria-label="Regenerate response"
              title="Regenerate"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={3} />
            </button>
          </div>
        )}
      </div>

      {/* User avatar — hidden on mobile to give more bubble width */}
      {isUser && (
        <div className="mt-1 hidden h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-[3px] border-[var(--border)] bg-accent shadow-brutalSm sm:flex">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <User className="h-5 w-5 text-white" strokeWidth={3} />
          )}
        </div>
      )}
    </motion.article>
  );
};

export default ChatMessage;
