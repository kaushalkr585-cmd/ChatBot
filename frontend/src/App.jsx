import React, { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Background from './components/Layout/Background';
import ChatArea from './components/Chat/ChatArea';
import ChatInput from './components/Input/ChatInput';
import AuthModal from './components/Auth/AuthModal';
import ProfileModal from './components/Auth/ProfileModal';
import SettingsModal from './components/Settings/SettingsModal';
import { useAuth } from './Context/AuthContext';
import { useSettings } from './Context/SettingsContext';
import OpenAI from 'openai';

// OpenAI instance is now inside the App component to pick up window object reliably

function App() {
  const { user, token } = useAuth();
  const { language } = useSettings();
  const [theme, setTheme] = useState('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize OpenAI safely with absolute local proxy URL
  const openai = React.useMemo(() => {
    return new OpenAI({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      baseURL: window.location.origin + "/api/nvidia",
      dangerouslyAllowBrowser: true,
      maxRetries: 0,
      timeout: 10000 // 10 second timeout
    });
  }, []);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSend = async (text, imagePreview) => {
    const newMessage = { 
      role: 'user', 
      content: text,
      hasImage: !!imagePreview,
      imageBase64: imagePreview || ""
    };
    
    // Optimistic update
    const newMessagesArray = [...messages, newMessage];
    setMessages(newMessagesArray);
    setIsTyping(true);
    
    // Create new chat if this is the first message and user is logged in
    let activeChatId = currentChatId;
    if (!activeChatId && user) {
      try {
        const res = await fetch('/api/chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ title: text.substring(0, 30) + '...', messages: newMessagesArray })
        });
        if (res.ok) {
          const newChat = await res.json();
          activeChatId = newChat._id;
          setCurrentChatId(activeChatId);
        }
      } catch (err) {
        console.error("Failed to create chat", err);
      }
    } else if (activeChatId && user) {
       saveMessagesToBackend(activeChatId, newMessagesArray);
    }

    try {
      // Build conversation history for the API
      const apiMessages = [...messages].map(m => {
        if (!m.hasImage) return { role: m.role, content: m.content };
        return {
          role: m.role,
          content: [
            { type: "text", text: m.content || "Describe this image." },
            { type: "image_url", image_url: { url: m.imageBase64 } }
          ]
        };
      });

      // Add the new message
      if (imagePreview) {
        // Assume imagePreview is now a base64 string from ChatInput
        apiMessages.push({
          role: "user",
          content: [
            { type: "text", text: text || "What's in this image?" },
            { type: "image_url", image_url: { url: imagePreview } }
          ]
        });
        
        // Update the visual message with the base64 for rendered tracking
        newMessage.imageBase64 = imagePreview;
      } else {
        apiMessages.push({ role: "user", content: text });
      }

      // Automatically switch to a vision model if there's an image in the current request
      const modelToUse = imagePreview ? "nvidia/llama-3.2-90b-vision-instruct" : "meta/llama-3.1-8b-instruct";

      const systemPrompt = {
        role: 'system',
        content: `You are ChatBot, a helpful AI assistant. Always respond in the following language: ${language}. Provide clear, well-structured answers using markdown.`
      };

      const completion = await openai.chat.completions.create({
        model: modelToUse,
        messages: [systemPrompt, ...apiMessages],
        temperature: 0.7,
        max_tokens: 1024,
      });

      const responseText = completion.choices[0]?.message?.content || "No response generated.";

      const responseMessage = {
        role: 'assistant',
        content: responseText
      };
      
      const updatedMessagesArray = [...newMessagesArray, responseMessage];
      setMessages(updatedMessagesArray);

      if (activeChatId && user) {
        saveMessagesToBackend(activeChatId, updatedMessagesArray);
      }
    } catch (error) {
      console.error("API Error:", error);
      
      const errorMessage = {
        role: 'assistant',
        content: `**Error:** Failed to fetch response from NVIDIA API. \n\n\`\`\`\n${error.message}\n\`\`\``
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

  // Chat Backend persistence helper
  const saveMessagesToBackend = async (chatId, updatedMessages) => {
    if (!token) return;
    try {
      await fetch(`/api/chats/${chatId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ messages: updatedMessages })
      });
    } catch (err) {
      console.error("Failed to sync chat", err);
    }
  };

  return (
    <div className="relative min-h-screen font-sans selection:bg-accent/30 selection:text-accent">
      <Background />
      
      <Header 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onAuthClick={() => setIsAuthOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        currentChatId={currentChatId}
        closeSidebar={() => setIsSidebarOpen(false)} 
        onChatSelect={(chat) => {
          setCurrentChatId(chat._id);
          setMessages(chat.messages);
        }}
        onNewChat={() => {
          setCurrentChatId(null);
          setMessages([]);
        }}
        onChatDeleted={(deletedId) => {
          if (currentChatId === deletedId) {
            setCurrentChatId(null);
            setMessages([]);
          }
        }}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      
      <main className={`flex flex-col h-screen pt-16 relative transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <ChatArea messages={messages} isTyping={isTyping} />
        <ChatInput onSend={handleSend} isTyping={isTyping} />
      </main>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Global Custom Cursor Effect */}
      <div className="fixed top-0 left-0 w-8 h-8 pointer-events-none rounded-full bg-accent/20 blur-xl mix-blend-screen hidden lg:block" 
           style={{
             transform: 'translate(var(--cursor-x), var(--cursor-y))',
             transition: 'transform 0.1s ease-out'
           }}
      />
    </div>
  );
}

export default App;
