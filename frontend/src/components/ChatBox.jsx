import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";

const ChatBox = () => {
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      const msg = { text: input, sender: "You", time: new Date().toLocaleTimeString() };
      socket.emit("sendMessage", msg);
      setMessages((prev) => [...prev, msg]);
      setInput("");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }
  }, [socket]);

  return (
    <div className="fixed bottom-4 right-4 w-72 bg-white/10 border border-white/20 rounded-xl backdrop-blur-xl p-3">
      <h3 className="text-white text-sm font-semibold mb-2">💬 Team Chat</h3>
      <div className="h-40 overflow-y-auto bg-black/10 rounded-lg p-2 text-sm text-white mb-2">
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.sender}: </strong>{m.text}
            <span className="text-gray-400 text-xs ml-2">{m.time}</span>
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded-lg bg-white/10 border border-white/20 text-white"
          placeholder="Type message..."
        />
        <button onClick={sendMessage} className="bg-[#0077C8] hover:bg-[#005fa3] rounded-lg px-3 text-white">
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
