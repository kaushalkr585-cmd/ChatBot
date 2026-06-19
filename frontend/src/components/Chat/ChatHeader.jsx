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
      {/* Left: Menu + Logo + Title */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          onClick={toggleSidebar}
          className="brutal-icon-button h-10 w-10 shrink-0 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" strokeWidth={3} />
        </button>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-[3px] border-black bg-yellow shadow-brutalSm sm:h-12 sm:w-12">
          <Bot className="h-6 w-6 text-black sm:h-7 sm:w-7" strokeWidth={3} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-extrabold leading-tight sm:text-2xl">AI Chat</h2>
          <p className="hidden text-[11px] font-bold text-[var(--muted)] sm:block">Powered by NVIDIA</p>
        </div>
      </div>

      {/* Right: Action buttons */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {/* Settings — hidden on mobile, visible sm+ */}
        <button
          onClick={onSettingsClick}
          className="brutal-icon-button hidden h-10 w-10 sm:flex"
          aria-label="Settings"
          title="Settings"
        >
          <Settings className="h-5 w-5" strokeWidth={3} />
        </button>

        {/* Clear / Reset — hidden on mobile, visible sm+ */}
        <button
          onClick={onClearChat}
          disabled={!hasMessages}
          className="brutal-icon-button hidden h-10 w-10 disabled:cursor-not-allowed disabled:opacity-45 sm:flex"
          aria-label="Clear chat"
          title="Clear chat"
        >
          {hasMessages ? (
            <Trash2 className="h-5 w-5" strokeWidth={3} />
          ) : (
            <RotateCcw className="h-5 w-5" strokeWidth={3} />
          )}
        </button>

        {/* Theme toggle — always visible */}
        <button
          onClick={toggleTheme}
          className="brutal-icon-button h-10 w-10"
          aria-label="Toggle theme"
          title="Theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" strokeWidth={3} />
          ) : (
            <Moon className="h-5 w-5" strokeWidth={3} />
          )}
        </button>

        {/* Auth / Profile — always visible */}
        {user ? (
          <button
            onClick={onProfileClick}
            className="brutal-icon-button h-10 w-10 overflow-hidden bg-green"
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
            {/* Mobile: icon only */}
            <button
              onClick={onAuthClick}
              className="brutal-icon-button h-10 w-10 bg-yellow text-black sm:hidden"
              aria-label="Sign in"
              title="Sign in"
            >
              <LogIn className="h-5 w-5" strokeWidth={3} />
            </button>
            {/* sm+: labelled button */}
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
