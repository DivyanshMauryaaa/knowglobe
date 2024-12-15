import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import the components for your routes
import App from './App';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
