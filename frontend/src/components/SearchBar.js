import { useDispatch } from "react-redux";
import { searchInteractions, fetchInteractions } from "../features/interactionSlice";
import { useState } from "react";

const SearchBar = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  const handleSearch = (value) => {
    setQuery(value);

    if (value.trim() === "") {
      // if empty → load all data
      dispatch(fetchInteractions());
    } else {
      dispatch(searchInteractions(value));
    }
  };

  return (
    <input
      type="text"
      placeholder="Search by HCP or product..."
      value={query}
      onChange={(e) => handleSearch(e.target.value)}
      style={{ padding: 8, width: "300px" }}
    />
  );
};

export default SearchBar;