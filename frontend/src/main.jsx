import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Dynamic API interceptor: routes to VITE_API_URL or relative /api when deployed live
const customApiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const originalFetch = window.fetch;
window.fetch = function (url, options) {
  if (typeof url === "string" && url.startsWith("http://localhost:5005")) {
    if (customApiUrl) {
      url = url.replace("http://localhost:5005", customApiUrl);
    } else if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      url = url.replace("http://localhost:5005", "");
    }
  }
  return originalFetch.call(this, url, options);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
