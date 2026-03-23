import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Copy, RefreshCw, Sparkles, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../Context/AuthContext';

const ChatMessage = ({ message }) => {
  const { user } = useAuth();
  const isUser = message.role === 'user';

  const copyText = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4 max-w-full",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 overflow-hidden",
        isUser ? "bg-accent/10" : "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"
      )}>
        {isUser ? (
          user && user.profilePicture ? (
            <img src={user.profilePicture} alt="User" className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-accent" />
          )
        ) : (
          <Sparkles className="w-5 h-5 text-white animate-pulse-slow" />
        )}
      </div>

      <div className={cn(
        "flex flex-col gap-2 max-w-[85%] sm:max-w-[80%] min-w-0 flex-shrink-1",
      )}>
        <div className={cn(
          "px-4 py-3 rounded-2xl glassmorphism font-medium text-[15px] leading-relaxed relative group break-words min-w-0 overflow-visible",
          isUser ? "bg-accent/5 rounded-tr-sm border-accent/20" : "rounded-tl-sm"
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
             <div className="markdown-body prose dark:prose-invert max-w-full text-foreground prose-p:leading-relaxed prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:p-4 prose-code:text-accent prose-pre:overflow-x-auto prose-pre:max-w-full min-w-0">
               <ReactMarkdown>{message.content}</ReactMarkdown>
             </div>
          )}

          {/* Action buttons on hover for AI messages */}
          {!isUser && (
            <div className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
              <button onClick={copyText} className="p-1.5 rounded-md hover:bg-secondary text-foreground/50 hover:text-foreground transition-colors" title="Copy">
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-md hover:bg-secondary text-foreground/50 hover:text-foreground transition-colors" title="Regenerate">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
