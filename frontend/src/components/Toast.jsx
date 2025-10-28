import { useEffect, useState } from "react";

const Toast = ({ message, duration = 4000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-black/70 text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50 backdrop-blur-md animate-fade-in">
      {message}
    </div>
  );
};

export default Toast;
