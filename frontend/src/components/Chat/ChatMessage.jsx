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
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn('flex w-full gap-3', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[var(--border)] bg-green shadow-brutalSm">
          <Bot className="h-6 w-6" strokeWidth={3} />
        </div>
      )}

      <div className={cn('group flex max-w-[86%] flex-col gap-2 sm:max-w-[70%]', isUser && 'items-end')}>
        <div
          className={cn(
            'rounded-[18px] border-[3px] border-[var(--border)] px-5 py-4 text-[15px] font-semibold leading-relaxed shadow-brutal',
            isUser ? 'bg-yellow text-black' : 'bg-[var(--surface)] text-[var(--foreground)]'
          )}
        >
          {message.hasImage && message.imageBase64 && (
            <img
              src={message.imageBase64}
              alt="Uploaded preview"
              className="mb-3 max-h-72 rounded-[14px] border-[3px] border-[var(--border)] object-cover"
            />
          )}

          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="markdown-body break-words">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

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
            <button className="brutal-icon-button h-9 w-9 shadow-brutalSm" aria-label="Regenerate response" title="Regenerate">
              <RefreshCw className="h-4 w-4" strokeWidth={3} />
            </button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-[3px] border-[var(--border)] bg-accent shadow-brutalSm">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <User className="h-6 w-6 text-white" strokeWidth={3} />
          )}
        </div>
      )}
    </motion.article>
  );
};

export default ChatMessage;
