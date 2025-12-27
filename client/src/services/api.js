import axios from 'axios';

// ✅ অটোমেটিক সুইচিং লজিক
// যদি ব্রাউজারের লিংকে 'localhost' থাকে, তবে লোকাল সার্ভার ব্যবহার করবে।
// আর যদি লাইভ সাইট (Vercel) হয়, তবে Render-এর সার্ভার ব্যবহার করবে।

const isLocal = window.location.hostname === 'localhost';

const api = axios.create({
  baseURL: isLocal 
    ? 'http://localhost:5000/api'  // আপনার লোকাল সার্ভার
    : 'https://novum-labs-server.onrender.com/api', // ⚠️ আপনার Render-এর আসল লিংকটি এখানে বসাবেন
});

// টোকেন সেট করার ইন্টারসেপ্টর (যা ছিল তাই থাকবে)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;