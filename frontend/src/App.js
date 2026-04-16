import InteractionForm from "./components/InteractionForm";
import InteractionTable from "./components/InteractionTable";
import SearchBar from "./components/SearchBar";
import ChatBox from "./components/ChatBox";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>HCP Interaction Logger</h2>

      <div style={{ display: "flex", gap: 20 }}>
        <InteractionForm />
        <ChatBox />
      </div>

      <br />

      <SearchBar />

      <br />

      <InteractionTable />
    </div>
  );
}

export default App;
