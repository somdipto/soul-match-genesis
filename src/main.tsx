
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Handle Supabase auth callback
const handleAuthCallback = async () => {
  if (window.location.pathname === '/auth/callback') {
    try {
      console.log('Processing auth callback...');
      // Extract hash or query parameters if needed
      // You can add specific handling here if required
      
      // Redirect to the main page after processing
      window.location.href = '/';
    } catch (error) {
      console.error('Error handling auth callback:', error);
      // Redirect to auth page on error
      window.location.href = '/auth';
    }
  }
};

// Run auth callback handler before rendering the app
handleAuthCallback();

createRoot(document.getElementById("root")!).render(<App />);
