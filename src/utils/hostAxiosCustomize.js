import axios from "axios";
import { registerLoadingHandlers as registerUserLoadingHandlers } from "./axiosCustomize";

let startApiCall = () => {};
let finishApiCall = () => {};

// Endpoints that shouldn't trigger loading indicators
const noLoadingEndpoints = [
  "/host/profile", // Background profile fetch
  "/host/analytics", // Analytics endpoints
  "/health-check", // Health check endpoints
  "/locations", // Location search suggestions
];

const noRefreshTokenEndpoints = [
  "/auth/host/login", // Host login endpoint
  "/auth/host/verify-email", // Email verification
  "/auth/host/refresh-token", // Token refresh
  "/auth/host/logout", // Logout
  "/host/re-send-mail", // Resend email verification
];

// Function to register loading state handlers
export const registerLoadingHandlers = (start, finish) => {
  startApiCall = start;
  finishApiCall = finish;

  // Đồng bộ hóa handlers với instance axios của user để đảm bảo cả hai đều dùng cùng một handler
  registerUserLoadingHandlers(start, finish);
};

const hostInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 45000,
  withCredentials: true,
});

// Add a request interceptor
hostInstance.interceptors.request.use(
  function (config) {
    // Check if this endpoint should show loading state
    const shouldShowLoading = !noLoadingEndpoints.some(
      (endpoint) => config.url === endpoint,
    );

    // Start loading state for this request if needed
    if (shouldShowLoading) {
      startApiCall();
    }

    // Do something before request is sent
    const noAuthEndpoints = [
      "/host/register",
      "/auth/host/login",
      "/auth/host/verify-email",
      "/auth/host/refresh-token",
      "/auth/host/logout",
      "/auth/host/check-exist-email",
      "/host/forgot-password",
      "/host/reset-password",
      "/host/re-send-mail",
      "/locations",
    ];

    const isNoAuthEndpoint = noAuthEndpoints.some((endpoint) =>
      config.url.includes(endpoint),
    );
    const token = sessionStorage.getItem("hostAccessToken");

    if (!isNoAuthEndpoint && token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Attach a flag to track if this request should show loading
    config._shouldShowLoading = shouldShowLoading;

    return config;
  },
  function (error) {
    // End loading state for this request on error
    finishApiCall();

    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
hostInstance.interceptors.response.use(
  function (response) {
    // End loading state for this request on success if it was shown
    if (response.config._shouldShowLoading) {
      finishApiCall();
    }

    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  async function (error) {
    // Don't finish loading yet if we're going to retry the request
    const originalRequest = error.config;
    const isNoAuthEndpoint = noRefreshTokenEndpoints.some((endpoint) =>
      originalRequest.url.includes(endpoint),
    );
    // Check if the error is 401 and the request is not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Ensure the URL is not /auth/host/login before calling /auth/host/refresh-token
      if (!isNoAuthEndpoint) {
        try {
          const response = await hostInstance.post("/auth/host/refresh-token", {
            access_token: sessionStorage.getItem("hostAccessToken"),
          });

          const newAccessToken = response.data.data.access_token;

          // Persist the new access token
          sessionStorage.setItem("hostAccessToken", newAccessToken);

          // Update the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Retry the original request with the new token
          return hostInstance(originalRequest);
        } catch (err) {
          console.error("Error refreshing host token:", err);

          // Clear the token and redirect to the host login page on error
          sessionStorage.removeItem("hostAccessToken");
          window.location.href = "/host/login";
        }
      }
    }

    // End loading state for this request on final error if it was shown
    if (originalRequest._shouldShowLoading) {
      finishApiCall();
    }

    // Reject the error if it's not handled
    return Promise.reject(error);
  },
);

export default hostInstance;
