
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Handle Supabase auth callback
const handleAuthCallback = async () => {
  if (window.location.pathname === '/auth/callback') {
    try {
      console.log('Processing auth callback...');
      
      // Remove the hash from the URL to prevent issues
      if (window.location.hash) {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
      }
      
      // Redirect to the main page after processing
      window.location.href = '/';
      return;
    } catch (error) {
      console.error('Error handling auth callback:', error);
      // Redirect to auth page on error
      window.location.href = '/auth';
      return;
    }
  }
};

// Run auth callback handler before rendering the app
handleAuthCallback();

createRoot(document.getElementById("root")!).render(<App />);
