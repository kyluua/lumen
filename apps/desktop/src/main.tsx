// ============================================================
// Lumen — React Entry Point
// Mounts the app with splash screen, theme provider,
// and strict mode. Opening animation plays on first load.
// ============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/global.css';

// Remove splash screen after mount
const removeSplash = () => {
  const splash = document.getElementById('lumen-splash');
  if (splash) {
    setTimeout(() => splash.remove(), 800);
  }
};

// Boot the app
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App onReady={removeSplash} />
    </React.StrictMode>
  );
}
