import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DrugSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true); 
    try {
      const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${searchTerm}`);
      if (response.data.drugGroup && response.data.drugGroup.conceptGroup) {
        setResults(response.data.drugGroup.conceptGroup.flatMap(group => group.conceptProperties || []));
        setSuggestions([]);
      } else {
        fetchSuggestions();
      }
    } catch (error) {
      console.error("Error fetching drugs:", error);
    } finally {
      setLoading(false); 
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${searchTerm}`);
      setSuggestions(response.data.suggestionGroup?.suggestionList?.suggestion || []);
    } catch (error) {
      console.error("Error fetching spelling suggestions:", error);
    }
  };

  return (
    <div>
      <h2>Search for Drugs!</h2>
      <div className="searchBox">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter drug name"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <div className="spinner">Loading...</div>}

      {!loading && results.length > 0 ? (
        <ul>
          {results.map((drug) => (
            <li key={drug.rxcui} onClick={() => navigate(`/drugs/${drug.name}`)}>
              {drug.name}
            </li>
          ))}
        </ul>
      ) : (
        !loading && suggestions.length > 0 && (
          <div>
            <p>No results found. Did you mean:</p>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
}

export default DrugSearch;
