import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, History, LogOut, MessageSquareText, Plus, Settings, Trash2, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../Context/AuthContext';

const Sidebar = ({
  isOpen,
  closeSidebar,
  onChatSelect,
  onNewChat,
  onSettingsClick,
  currentChatId,
  onChatDeleted,
  refreshKey,
}) => {
  const { user, token, logout } = useAuth();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (user && token) {
      fetchChats();
    } else {
      setChats([]);
    }
  }, [user, token, isOpen, refreshKey]);

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setChats((prev) => prev.filter((chat) => chat._id !== chatId));
        onChatDeleted?.(chatId);
      }
    } catch (err) {
      console.error('Failed to delete chat', err);
    }
  };

  const handleNewChat = () => {
    onNewChat();
    closeSidebar();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col gap-5 p-4">
      <div className="brutal-card bg-yellow p-5 text-black">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-black bg-white shadow-brutalSm">
            <Bot className="h-8 w-8 text-black" strokeWidth={2.8} />
          </div>
          <button
            onClick={closeSidebar}
            className="brutal-icon-button h-10 w-10 bg-white text-black lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em]">Control Panel</p>
        <h1 className="mt-1 text-4xl font-extrabold leading-none tracking-normal">CHATBOT</h1>
        <p className="mt-2 text-base font-bold">Talk Smarter</p>
      </div>

      <button
        onClick={handleNewChat}
        className="brutal-button flex w-full items-center justify-center gap-3 bg-yellow px-5 py-4 text-base font-extrabold uppercase tracking-normal text-black"
      >
        <Plus className="h-5 w-5" strokeWidth={3} />
        New Chat
      </button>

      <section className="brutal-card flex min-h-0 flex-1 flex-col bg-[var(--surface)] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">Workspace</p>
            <h2 className="flex items-center gap-2 text-xl font-extrabold">
              <History className="h-5 w-5" strokeWidth={3} />
              Recent Chats
            </h2>
          </div>
        </div>

        <div className="custom-scrollbar -mr-2 flex-1 space-y-3 overflow-y-auto pr-2">
          {user ? (
            chats.length === 0 ? (
              <div className="rounded-2xl border-[3px] border-[var(--border)] border-dashed bg-background p-4 text-sm font-bold">
                No saved chats yet. Start a conversation and it will land here.
              </div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => {
                    onChatSelect(chat);
                    closeSidebar();
                  }}
                  className={cn(
                    'brutal-press flex w-full items-center gap-3 rounded-2xl border-[3px] border-[var(--border)] px-3 py-3 text-left shadow-brutalSm transition-all duration-200',
                    currentChatId === chat._id ? 'bg-yellow' : 'bg-[var(--surface)] hover:bg-yellow'
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-[var(--border)] bg-green">
                    <MessageSquareText className="h-5 w-5" strokeWidth={3} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-extrabold">{chat.title}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => handleDeleteChat(e, chat._id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleDeleteChat(e, chat._id)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-[3px] border-[var(--border)] bg-[var(--surface)] transition-colors hover:bg-red"
                    title="Delete chat"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={3} />
                  </span>
                </button>
              ))
            )
          ) : (
            <div className="rounded-2xl border-[3px] border-[var(--border)] border-dashed bg-background p-4 text-sm font-bold">
              Sign in to sync your chat history across sessions.
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-3">
        <button
          onClick={onSettingsClick}
          className="brutal-button flex w-full items-center gap-3 bg-[var(--surface)] px-4 py-3 text-left text-sm font-extrabold"
        >
          <Settings className="h-5 w-5" strokeWidth={3} />
          Settings & Help
        </button>
        {user && (
          <button
            onClick={logout}
            className="brutal-button flex w-full items-center gap-3 bg-red px-4 py-3 text-left text-sm font-extrabold"
          >
            <LogOut className="h-5 w-5" strokeWidth={3} />
            Sign Out
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="brutal-panel relative z-20 hidden h-full w-[300px] shrink-0 overflow-hidden bg-[var(--surface)] lg:block">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 z-40 bg-black/45 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-105%' }}
              animate={{ x: 0 }}
              exit={{ x: '-105%' }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed inset-y-3 left-3 z-50 w-[min(300px,calc(100vw-24px))] overflow-hidden rounded-[18px] border-[3px] border-[var(--border)] bg-[var(--surface)] shadow-brutal lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
