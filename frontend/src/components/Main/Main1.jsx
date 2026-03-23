import React, { useContext, useRef, useEffect, useState } from "react";
import "./Main.css";
import { Context } from "../../Context/Context";
import { assets } from "../../assets/assets";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    uploadedImages,
    handleImageUpload,
    removeImage,
    startVoiceRecognition,
    stopVoiceRecognition,
    isListening,
  } = useContext(Context);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() || uploadedImages.length > 0) {
        onSent();
      }
    }
  };

  useEffect(() => {
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
      mainContainer.addEventListener('dragenter', handleDragEnter);
      mainContainer.addEventListener('dragleave', handleDragLeave);
      mainContainer.addEventListener('dragover', handleDragOver);
      mainContainer.addEventListener('drop', handleDrop);
    }

    return () => {
      if (mainContainer) {
        mainContainer.removeEventListener('dragenter', handleDragEnter);
        mainContainer.removeEventListener('dragleave', handleDragLeave);
        mainContainer.removeEventListener('dragover', handleDragOver);
        mainContainer.removeEventListener('drop', handleDrop);
      }
    };
  }, []);

  const suggestedPrompts = [
    {
      icon: "💡",
      text: "Explain quantum computing",
      color: "#8b5cf6"
    },
    {
      icon: "🎨",
      text: "Create a story about AI",
      color: "#ec4899"
    },
    {
      icon: "🚀",
      text: "Future of space exploration",
      color: "#06b6d4"
    },
    {
      icon: "🧬",
      text: "How does CRISPR work?",
      color: "#10b981"
    }
  ];

  return (
    <div className="main">
      <div className="nav">
        <div className="nav-brand">
          <div className="brand-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#gradient1)" />
              <path d="M2 17L12 22L22 17" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" />
              <path d="M2 12L12 17L22 12" stroke="url(#gradient3)" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="12">
                  <stop stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="gradient2" x1="2" y1="17" x2="22" y2="22">
                  <stop stopColor="#ec4899" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="gradient3" x1="2" y1="12" x2="22" y2="17">
                  <stop stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="brand-text">GeminiAI</span>
        </div>
        <div className="user-profile">
          <div className="user-avatar">
            <img src={assets.user_icon} alt="User" />
          </div>
        </div>
      </div>

      <div className="main-container">
        {isDragging && (
          <div className="drag-overlay">
            <div className="drag-content">
              <div className="drag-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <h3>Drop images here</h3>
              <p>Upload images to enhance your prompt</p>
            </div>
          </div>
        )}

        {!showResult ? (
          <div className="greet-section">
            <div className="greet-content">
              <div className="greet-header">
                <h1 className="greet-title">
                  <span className="gradient-text">Hello, Creator</span>
                </h1>
                <p className="greet-subtitle">How can I assist you today?</p>
              </div>

              <div className="cards-grid">
                {suggestedPrompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="card"
                    onClick={() => {
                      setInput(prompt.text);
                      onSent(prompt.text);
                    }}
                    style={{ '--card-color': prompt.color }}
                  >
                    <div className="card-icon">{prompt.icon}</div>
                    <p className="card-text">{prompt.text}</p>
                    <div className="card-arrow">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="result-section">
            <div className="result-title-box">
              <div className="user-message">
                <div className="user-avatar-small">
                  <img src={assets.user_icon} alt="User" />
                </div>
                <p>{recentPrompt}</p>
              </div>
            </div>

            <div className="result-data-box">
              <div className="ai-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#aiGradient1)" />
                  <path d="M2 17L12 22L22 17" stroke="url(#aiGradient2)" strokeWidth="2" />
                  <path d="M2 12L12 17L22 12" stroke="url(#aiGradient3)" strokeWidth="2" />
                  <defs>
                    <linearGradient id="aiGradient1" x1="2" y1="2" x2="22" y2="12">
                      <stop stopColor="#8b5cf6" />
                      <stop offset="1" stopColor="#ec4899" />
                    </linearGradient>
                    <linearGradient id="aiGradient2" x1="2" y1="17" x2="22" y2="22">
                      <stop stopColor="#ec4899" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="aiGradient3" x1="2" y1="12" x2="22" y2="17">
                      <stop stopColor="#8b5cf6" />
                      <stop offset="1" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {loading ? (
                <div className="loader">
                  <div className="loading-bar"></div>
                  <div className="loading-bar"></div>
                  <div className="loading-bar"></div>
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          {uploadedImages.length > 0 && (
            <div className="uploaded-images-preview">
              {uploadedImages.map((img, index) => (
                <div key={index} className="image-preview-item">
                  <img src={img.preview} alt={img.name} />
                  <button
                    className="remove-image-btn"
                    onClick={() => removeImage(index)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              value={input}
              type="text"
              placeholder="Ask me anything..."
              className="search-input"
            />
            <div className="search-actions">
              <button
                className="action-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Upload images"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e.target.files)}
                style={{ display: 'none' }}
              />
              
              <button
                className={`action-btn ${isListening ? 'listening' : ''}`}
                onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                title={isListening ? "Stop recording" : "Voice input"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>

              {input.trim() || uploadedImages.length > 0 ? (
                <button className="send-btn" onClick={() => onSent()}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>

          <p className="bottom-info">
            GeminiAI may display inaccurate info, so double-check its responses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
