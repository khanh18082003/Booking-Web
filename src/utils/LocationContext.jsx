import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

// Create the context
const LocationContext = createContext();

// Create a provider component
export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  return (
    <LocationContext.Provider value={{ 
      location, 
      setLocation, 
      searchResults, 
      setSearchResults 
    }}>
      {children}
    </LocationContext.Provider>
  );
};

LocationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Create a custom hook to use the context
export const useLocation = () => {
  return useContext(LocationContext);
};
