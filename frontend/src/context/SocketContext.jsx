import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ user, children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user?.token) {
      const newSocket = io("http://localhost:5000", {
        auth: { token: user.token },
      });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("🔗 Socket connected:", newSocket.id);
      });

      return () => newSocket.close();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
