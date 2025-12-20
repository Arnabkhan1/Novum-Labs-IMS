import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// ১. এই দুটি ইম্পোর্ট খুব জরুরি
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast'; // টোস্ট মেসেজের জন্য

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ২. প্রথমে রাউটার */}
    <BrowserRouter>
      
      {/* ৩. এরপর AuthProvider (এটি পুরো অ্যাপকে ইউজার ডাটা দেবে) */}
      <AuthProvider>
        
        <App />
        <Toaster position="top-right" /> {/* টোস্ট পপ-আপ এখানে থাকবে */}
        
      </AuthProvider>

    </BrowserRouter>
  </React.StrictMode>,
);