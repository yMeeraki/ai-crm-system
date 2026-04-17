import React from "react";
import { useDispatch } from "react-redux";
import { searchInteractions, fetchInteractions } from "../features/interactionSlice";

const SearchBar = () => {
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    const value = e.target.value;

    if (value.trim() === "") {
      dispatch(fetchInteractions()); // reset list
    } else {
      dispatch(searchInteractions(value));
    }
  };

  return (
    <input
      placeholder="Search by HCP or product..."
      onChange={handleSearch}
    />
  );
};

export default SearchBar;