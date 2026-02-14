import { useState, useEffect } from "react";
import axios from "axios";

const LocationAutocomplete = ({ placeholder, onSelect, initialValue = "" }) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
          {
            params: {
              access_token: token,
              autocomplete: true,
              country: "KE", // Limit to Kenya
              limit: 5,
            },
          }
        );

        if (response.data && response.data.features) {
          setSuggestions(response.data.features);
        }
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    };

    const timer = setTimeout(() => {
        if (showSuggestions) {
            fetchSuggestions();
        }
    }, 500); // Debounce

    return () => clearTimeout(timer);
  }, [query, showSuggestions]);

  const handleSelect = (suggestion) => {
    const address = suggestion.place_name;
    // Mapbox returns [lng, lat]
    const [lng, lat] = suggestion.center;

    setQuery(address);
    setSuggestions([]);
    setShowSuggestions(false);
    onSelect({ address, lat, lng });
  };

  return (
    <div className="relative">
      <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-10"
            placeholder={placeholder}
            required
          />
          {query && (
              <button
                type="button"
                onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                    setShowSuggestions(false);
                    onSelect({ address: '', lat: null, lng: null }); // Optional: clear parent state
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
          )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-b-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {suggestion.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
