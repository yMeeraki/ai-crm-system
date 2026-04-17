import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sendChat } from "../features/interactionSlice";

const ChatBox = () => {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const dispatch = useDispatch();

  const send = async () => {
    if (!msg) return;

    setChat([...chat, { role: "user", text: msg }]);

    const res = await dispatch(sendChat(msg));
    const reply = res.payload?.message || "Done";

    setChat((prev) => [...prev, { role: "ai", text: reply }]);
    setMsg("");
  };

  return (
    <div className="card chat-container">
      <h3>AI Assistant</h3>

      <div className="chat-messages">
        {chat.map((c, i) => (
          <div key={i} className={c.role === "user" ? "chat-user" : "chat-ai"}>
            {c.text}
          </div>
        ))}
      </div>

      <textarea
        className="chat-input"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Describe interaction..."
      />

      <button onClick={send} className="btn-success">
        Send
      </button>
    </div>
  );
};

export default ChatBox;
