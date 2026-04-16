import InteractionForm from "./components/InteractionForm";
import InteractionTable from "./components/InteractionTable";
import SearchBar from "./components/SearchBar";
import ChatBox from "./components/ChatBox";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <div className="container">
        <h2>HCP Interaction Dashboard</h2>

        <div className="grid">
          <InteractionForm />
          <ChatBox />
        </div>

        <SearchBar />
        <InteractionTable />
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
