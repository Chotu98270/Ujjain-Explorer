import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Register PWA Service Worker in production only; clean up in development
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('[PWA] Service Worker registered:', reg.scope))
        .catch((err) => console.error('[PWA] Service Worker registration failed:', err));
    });
  } else {
    // In dev mode, unregister any stale service workers to prevent cache pollution / black screens
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
