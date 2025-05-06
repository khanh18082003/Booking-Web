import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";
const AuthContext = createContext();

export const useStore = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [store, setStore] = useState({
    userProfile: null,
    apiLoading: false,
    activeApiCalls: 0, // Track number of ongoing API calls
  });

  // Helper functions to manage API loading state
  const startApiCall = () => {
    setStore((prev) => ({
      ...prev,
      activeApiCalls: prev.activeApiCalls + 1,
      apiLoading: true,
    }));
  };

  const finishApiCall = () => {
    setStore((prev) => {
      const newCount = Math.max(0, prev.activeApiCalls - 1);
      return {
        ...prev,
        activeApiCalls: newCount,
        apiLoading: newCount > 0,
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{ store, setStore, startApiCall, finishApiCall }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
