import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";

const NotificationBell = () => {
  const { socket } = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on("receiveNotification", (data) => {
        setNotifications((prev) => [data, ...prev]);
      });
    }
  }, [socket]);

  return (
    <div className="relative">
      <button className="p-2 bg-white/10 rounded-full border border-white/20">
        🔔
      </button>
      {notifications.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {notifications.length}
        </span>
      )}

      <div className="absolute mt-2 right-0 w-64 bg-white/10 border border-white/20 rounded-xl p-2 backdrop-blur-xl">
        {notifications.length ? (
          notifications.map((n, i) => (
            <div key={i} className="text-sm text-white mb-1 border-b border-white/10 pb-1">
              <strong>{n.title}</strong>
              <p className="text-gray-300 text-xs">{n.message}</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400 text-center">No notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationBell;
