import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Loading from "../components/common/Loading";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    // Load accessToken from localStorage on initialization
    const storedToken = localStorage.getItem("accessToken");
    return {
      accessToken: storedToken || null,
      api: null,
      userProfile: null,
    };
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const api = axios.create({
      baseURL: "http://localhost:8081/booking-api/v1",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    api.interceptors.request.use(
      (config) => {
        const noAuthEndpoints = [
          "/users/login",
          "/users/register",
          "/auth/verify-email",
          "/auth/refresh-token",
          "/re-send-mail",
        ];

        const isNoAuthEndpoint = noAuthEndpoints.some((endpoint) =>
          config.url.includes(endpoint),
        );
        const token = localStorage.getItem("accessToken");

        if (!isNoAuthEndpoint && authState.accessToken) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await api.post(
              "/auth/refresh-token",
              {
                access_token: authState.accessToken,
              },
              { withCredentials: true },
            );
            const newAccessToken = response.data.data.access_token;

            setAuthState((prevState) => {
              const updatedState = {
                ...prevState,
                accessToken: newAccessToken,
              };
              localStorage.setItem("accessToken", newAccessToken); // Persist token
              return updatedState;
            });

            originalRequest.headers["Authorization"] =
              `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (err) {
            console.error("Error refreshing token:", err);
            localStorage.removeItem("accessToken"); // Clear token on failure
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      },
    );

    setAuthState((prevState) => ({
      ...prevState,
      api,
    }));

    setLoading(false); // Set loading to false after initializing the API
  }, []);

  useEffect(() => {
    // Persist accessToken to localStorage whenever it changes
    if (authState.accessToken) {
      localStorage.setItem("accessToken", authState.accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [authState.accessToken]);

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
