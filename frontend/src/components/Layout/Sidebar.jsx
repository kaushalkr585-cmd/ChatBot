import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Settings, Plus, History, LogOut, PenTool, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../Context/AuthContext';

const Sidebar = ({ isOpen, closeSidebar, onChatSelect, onNewChat, onSettingsClick, currentChatId, onChatDeleted }) => {
  const { user, token, logout } = useAuth();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (user && token) {
      fetchChats();
    } else {
      setChats([]);
    }
  }, [user, token, isOpen]); // Refresh when opened or user changes

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setChats(prev => prev.filter(c => c._id !== chatId));
        if (onChatDeleted) onChatDeleted(chatId);
      }
    } catch (err) {
      console.error("Failed to delete chat", err);
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 bottom-0 w-64 bg-[#f0f4f9] dark:bg-[#131314] z-50 flex flex-col pt-16 transition-colors duration-300"
          >
            <div className="p-4">
              <button onClick={() => { onNewChat(); closeSidebar(); }} className="w-full flex items-center gap-3 hover:bg-[#e1e5ea] dark:hover:bg-[#282a2c] text-foreground/90 rounded-full py-3 px-4 transition-colors">
                <Plus className="w-5 h-5 text-foreground/70" />
                <span className="font-medium text-sm">New chat</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-1 mt-4">
              {user ? (
                <>
                  <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3 px-3">
                    <History className="inline w-4 h-4 mr-1" />
                    Recent
                  </h3>
                  {chats.length === 0 ? (
                    <p className="text-xs text-foreground/40 px-3">No recent chats.</p>
                  ) : (
                    chats.map((chat) => (
                      <button
                        key={chat._id}
                        onClick={() => { onChatSelect(chat); closeSidebar(); }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-sm text-foreground/80 group overflow-hidden ${
                          currentChatId === chat._id ? 'bg-[#e1e5ea] dark:bg-[#282a2c] text-foreground' : 'hover:bg-[#e1e5ea] dark:hover:bg-[#282a2c]'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <MessageSquare className={`w-4 h-4 shrink-0 transition-colors ${currentChatId === chat._id ? 'text-accent' : 'text-foreground/40 group-hover:text-accent'}`} />
                          <span className="truncate">{chat.title}</span>
                        </div>
                        <div 
                          onClick={(e) => handleDeleteChat(e, chat._id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-all text-red-500/70 hover:text-red-500"
                          title="Delete chat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </div>
                      </button>
                    ))
                  )}
                </>
              ) : (
                <div className="px-3 text-center mt-10 opacity-50">
                   <p className="text-sm">Sign in to sync your chat history.</p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto p-4 bg-[#f0f4f9] dark:bg-[#131314] space-y-1 pb-6 transition-colors duration-300">
              <button
                onClick={onSettingsClick}
                className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl hover:bg-[#e1e5ea] dark:hover:bg-[#282a2c] transition-colors text-sm text-foreground/80"
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">Settings & help</span>
              </button>
              
              {user && (
                <button onClick={logout} className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors text-sm">
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Sign Out</span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
