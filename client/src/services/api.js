import axios from 'axios';

const api = axios.create({
  // ✅ লাইভ সার্ভার লিংক (Render)
  baseURL: 'https://novum-labs-server.onrender.com/api', 
});

// ✅ Interceptor: প্রতিটা রিকোয়েস্টের সাথে টোকেন পাঠিয়ে দেয়
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;