import React from "react";
import ChatBox from "./components/ChatBox";
import InteractionForm from "./components/InteractionForm";

function App() {
  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <div style={{ flex: 1 }}>
        <InteractionForm />
      </div>

      <div style={{ flex: 1 }}>
        <ChatBox />
      </div>
    </div>
  );
}

export default App;