import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendChat } from "../features/interactionSlice";

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.interaction.loading);

  const handleSend = () => {
    if (!message) return;
    dispatch(sendChat(message));
    setMessage("");
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 20 }}>
      <h3>AI Assistant</h3>

      <textarea
        rows="4"
        placeholder="Describe interaction..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSend}>
        {loading ? "Processing..." : "Log with AI"}
      </button>
    </div>
  );
};

export default ChatBox;