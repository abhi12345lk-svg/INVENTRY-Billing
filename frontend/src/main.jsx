import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Dynamic API interceptor: routes to VITE_API_URL when deployed live
const customApiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const originalFetch = window.fetch;
window.fetch = function (url, options) {
  if (typeof url === "string" && url.startsWith("http://localhost:5005")) {
    if (customApiUrl) {
      url = url.replace("http://localhost:5005", customApiUrl);
    }
  }
  return originalFetch.call(this, url, options);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
