import React from 'react';
import { Bot, Menu, Moon, RotateCcw, Settings, Sun, Trash2, User, LogIn } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';

const ChatHeader = ({
  toggleSidebar,
  onSettingsClick,
  onClearChat,
  onAuthClick,
  onProfileClick,
  toggleTheme,
  theme,
  hasMessages,
}) => {
  const { user } = useAuth();

  return (
    <header className="flex shrink-0 items-center justify-between gap-2 border-b-[3px] border-[var(--border)] bg-[var(--surface)] px-3 py-2 sm:gap-3 lg:px-6 lg:py-3">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="brutal-icon-button h-11 w-11 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" strokeWidth={3} />
        </button>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-[3px] border-black bg-yellow shadow-brutalSm">
          <Bot className="h-7 w-7 text-black" strokeWidth={3} />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-extrabold leading-tight sm:text-2xl">AI Chat</h2>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button onClick={onSettingsClick} className="brutal-icon-button" aria-label="Settings" title="Settings">
          <Settings className="h-5 w-5" strokeWidth={3} />
        </button>

        <button
          onClick={onClearChat}
          disabled={!hasMessages}
          className="brutal-icon-button disabled:cursor-not-allowed disabled:opacity-45"
          aria-label="Clear chat"
          title="Clear chat"
        >
          {hasMessages ? <Trash2 className="h-5 w-5" strokeWidth={3} /> : <RotateCcw className="h-5 w-5" strokeWidth={3} />}
        </button>

        <button onClick={toggleTheme} className="brutal-icon-button" aria-label="Toggle theme" title="Theme">
          {theme === 'dark' ? <Sun className="h-5 w-5" strokeWidth={3} /> : <Moon className="h-5 w-5" strokeWidth={3} />}
        </button>

        {user ? (
          <button
            onClick={onProfileClick}
            className="brutal-icon-button overflow-hidden bg-green"
            aria-label="Profile"
            title={user.name}
          >
            {user.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <User className="h-5 w-5" strokeWidth={3} />
            )}
          </button>
        ) : (
          <>
            <button onClick={onAuthClick} className="brutal-icon-button sm:hidden" aria-label="Sign in" title="Sign in">
              <LogIn className="h-5 w-5" strokeWidth={3} />
            </button>
            <button
              onClick={onAuthClick}
              className="brutal-button hidden items-center gap-2 bg-yellow px-4 py-2.5 text-sm font-extrabold text-black sm:flex"
            >
              <LogIn className="h-4 w-4" strokeWidth={3} />
              Sign In
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;
