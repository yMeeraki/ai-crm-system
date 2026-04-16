import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendChat } from "../features/interactionSlice";
import { suggestNextAction } from "../features/interactionSlice";

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.interaction.loading);

  const handleSend = async () => {
    if (!message.trim()) return;

    const result = await dispatch(sendChat(message.trim()));

    const summary = result.payload?.ai_output?.summary || "";

    if (summary) {
      dispatch(suggestNextAction(summary));
    }

    setMessage("");
  };

  return (
    <div className="card">
      <h3>AI Assistant</h3>

      <textarea
        rows="4"
        placeholder="Describe interaction..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <br />
      <br />

      <button className="btn-primary" onClick={handleSend}>
        {loading ? "Processing..." : "Log with AI"}
      </button>
    </div>
  );
};

export default ChatBox;
