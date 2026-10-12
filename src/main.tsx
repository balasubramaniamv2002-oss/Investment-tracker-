import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Automatically register and update Service Worker immediately
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // When a new version is detected, force update immediately
    updateSW(true);
  },
  onRegisteredSW(swUrl, r) {
    if (r) {
      // Periodically check for updates every 15 minutes or when app comes into focus
      setInterval(() => {
        r.update();
      }, 15 * 60 * 1000);

      window.addEventListener('focus', () => {
        r.update();
      });
    }
  },
});

createRoot(document.getElementById('root')!).render(<App />);
