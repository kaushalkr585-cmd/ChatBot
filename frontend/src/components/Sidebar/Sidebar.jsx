import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../Context/Context";

const Sidebar = () => {
  const [extend, setExtend] = useState(true);
  const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  return (
    <div className={`sidebar ${extend ? 'extended' : 'collapsed'}`}>
      <div className="top">
        <button
          onClick={() => setExtend((prev) => !prev)}
          className="menu-btn"
          aria-label="Toggle sidebar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <button className="new-chat-btn" onClick={newChat}>
          <div className="new-chat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          {extend && <span className="new-chat-text">New Chat</span>}
        </button>

        {extend && prevPrompts.length > 0 && (
          <div className="recent-section">
            <h3 className="recent-title">Recent Chats</h3>
            <div className="recent-list">
              {prevPrompts.slice(-10).reverse().map((item, index) => (
                <button
                  key={index}
                  onClick={() => loadPrompt(item)}
                  className="recent-entry"
                >
                  <div className="recent-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <span className="recent-text">{item.slice(0, 28)}{item.length > 28 ? '...' : ''}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bottom">
        <button className="bottom-item">
          <div className="bottom-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          {extend && <span>Help & Support</span>}
        </button>

        <button className="bottom-item">
          <div className="bottom-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m13.2 5.2l-4.2-4.2m0-6l-4.2-4.2" />
            </svg>
          </div>
          {extend && <span>Settings</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
