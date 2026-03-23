import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { AuthProvider } from './Context/AuthContext'
import { SettingsProvider } from './Context/SettingsContext'

// Global Error Boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", color: "#ff6b6b", background: "#1a1b26", height: "100vh", fontFamily: "monospace" }}>
          <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>🚨 APP CRASHED! 🚨</h1>
          <p style={{ fontWeight: "bold" }}>{this.state.error.toString()}</p>
          <pre style={{ marginTop: "20px", whiteSpace: "pre-wrap", background: "#000", padding: "20px", borderRadius: "10px" }}>
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Add global cursor tracking for the glow effect
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--cursor-x', `${e.clientX - 16}px`);
    document.documentElement.style.setProperty('--cursor-y', `${e.clientY - 16}px`);
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <SettingsProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SettingsProvider>
    </ErrorBoundary>
  </StrictMode>,
)
