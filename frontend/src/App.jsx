import React, { useMemo, useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Background from './components/Layout/Background';
import ChatArea from './components/Chat/ChatArea';
import ChatHeader from './components/Chat/ChatHeader';
import ChatInput from './components/Input/ChatInput';
import AuthModal from './components/Auth/AuthModal';
import ProfileModal from './components/Auth/ProfileModal';
import SettingsModal from './components/Settings/SettingsModal';
import { useAuth } from './Context/AuthContext';
import { useSettings } from './Context/SettingsContext';
import OpenAI from 'openai';

function App() {
  const { user, token } = useAuth();
  const { language, theme, toggleTheme } = useSettings();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 1024px)').matches;
  });
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openai = useMemo(() => {
    return new OpenAI({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      baseURL: window.location.origin + '/api/nvidia',
      dangerouslyAllowBrowser: true,
      maxRetries: 1,
      timeout: 60000,
    });
  }, []);

  const saveMessagesToBackend = async (chatId, updatedMessages) => {
    if (!token) return;
    try {
      await fetch(`/api/chats/${chatId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: updatedMessages }),
      });
    } catch (err) {
      console.error('Failed to sync chat', err);
    }
  };

  const handleSend = async (text, imagePreview) => {
    const newMessage = {
      role: 'user',
      content: text,
      hasImage: !!imagePreview,
      imageBase64: imagePreview || '',
    };

    const newMessagesArray = [...messages, newMessage];
    setMessages(newMessagesArray);
    setIsTyping(true);

    let activeChatId = currentChatId;
    if (!activeChatId && user) {
      try {
        const res = await fetch('/api/chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title: `${text.substring(0, 30)}...`, messages: newMessagesArray }),
        });
        if (res.ok) {
          const newChat = await res.json();
          activeChatId = newChat._id;
          setCurrentChatId(activeChatId);
          setSidebarRefreshKey((k) => k + 1); // trigger sidebar refresh
        }
      } catch (err) {
        console.error('Failed to create chat', err);
      }
    } else if (activeChatId && user) {
      saveMessagesToBackend(activeChatId, newMessagesArray);
    }

    try {
      // Build API messages from ALL messages including the new user message
      // Use newMessagesArray (includes current user message) but exclude the last one
      // when constructing history, then append the current message in proper format
      const historyMessages = newMessagesArray.slice(0, -1);
      const apiMessages = historyMessages.map((message) => {
        if (!message.hasImage) return { role: message.role, content: message.content };
        return {
          role: message.role,
          content: [
            { type: 'text', text: message.content || 'Describe this image.' },
            { type: 'image_url', image_url: { url: message.imageBase64 } },
          ],
        };
      });

      if (imagePreview) {
        apiMessages.push({
          role: 'user',
          content: [
            { type: 'text', text: text || "What's in this image?" },
            { type: 'image_url', image_url: { url: imagePreview } },
          ],
        });
      } else {
        apiMessages.push({ role: 'user', content: text });
      }

      const modelToUse = imagePreview
        ? 'nvidia/llama-3.2-90b-vision-instruct'
        : 'meta/llama-3.1-8b-instruct';

      const systemPrompt = {
        role: 'system',
        content: `You are ChatBot, a helpful AI assistant. Always respond in the following language: ${language}. Provide clear, well-structured answers using markdown.`,
      };

      const completion = await openai.chat.completions.create({
        model: modelToUse,
        messages: [systemPrompt, ...apiMessages],
        temperature: 0.7,
        max_tokens: 1024,
      });

      const responseMessage = {
        role: 'assistant',
        content: completion.choices[0]?.message?.content || 'No response generated.',
      };

      const updatedMessagesArray = [...newMessagesArray, responseMessage];
      setMessages(updatedMessagesArray);

      if (activeChatId && user) {
        saveMessagesToBackend(activeChatId, updatedMessagesArray);
      }
    } catch (error) {
      console.error('API Error:', error);

      const errorMessage = {
        role: 'assistant',
        content: `**Error:** Failed to fetch response from NVIDIA API.\n\n\`\`\`\n${error.message}\n\`\`\``,
      };

      const updatedErrorMessages = [...newMessagesArray, errorMessage];
      setMessages(updatedErrorMessages);
      if (activeChatId && user) {
        saveMessagesToBackend(activeChatId, updatedErrorMessages);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
  };

  const handleClearChat = () => {
    setMessages([]);
    if (currentChatId && user) {
      saveMessagesToBackend(currentChatId, []);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-yellow selection:text-black">
      <Background />

      <div className="flex h-[100dvh] gap-0 p-0 lg:gap-6 lg:p-6">
        <Sidebar
          isOpen={isSidebarOpen}
          currentChatId={currentChatId}
          refreshKey={sidebarRefreshKey}
          closeSidebar={() => setIsSidebarOpen(false)}
          onChatSelect={(chat) => {
            setCurrentChatId(chat._id);
            setMessages(chat.messages);
          }}
          onNewChat={handleNewChat}
          onChatDeleted={(deletedId) => {
            if (currentChatId === deletedId) {
              handleNewChat();
            }
          }}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />

        <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden bg-[var(--surface)] lg:border-[3px] lg:border-[var(--border)] lg:rounded-[18px] lg:shadow-[6px_6px_0_var(--shadow-color)]">
          <ChatHeader
            theme={theme}
            toggleTheme={toggleTheme}
            toggleSidebar={() => setIsSidebarOpen((value) => !value)}
            onAuthClick={() => setIsAuthOpen(true)}
            onProfileClick={() => setIsProfileOpen(true)}
            onSettingsClick={() => setIsSettingsOpen(true)}
            onClearChat={handleClearChat}
            hasMessages={messages.length > 0}
          />
          <ChatArea messages={messages} isTyping={isTyping} onSuggestionClick={handleSend} />
          <ChatInput onSend={handleSend} isTyping={isTyping} />
        </main>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default App;
