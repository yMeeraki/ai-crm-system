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
    className="search"
      type="text"
      placeholder="Search by HCP or product..."
      value={query}
      onChange={(e) => handleSearch(e.target.value)}
      
    />
  );
};

export default SearchBar;