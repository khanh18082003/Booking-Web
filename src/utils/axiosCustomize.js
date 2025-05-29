import axios from "axios";

let startApiCall = () => {};
let finishApiCall = () => {};

// Endpoints that shouldn't trigger loading indicators
const noLoadingEndpoints = [
  "/users/my-profile", // Background profile fetch
  "/payments/check-payment-status", // Payment status check
  "/analytics", // Analytics endpoints
  "/health-check", // Health check endpoints
  "/locations", // Location search suggestions
  "/payment/get-payment",
];

const noRefreshTokenEndpoints = [
  "/auth/login", // Login endpoint
  "/auth/verify-email", // Email verification
  "/auth/refresh-token", // Token refresh
  "/auth/logout", // Logout
  "/re-send-mail", // Resend email verification
];

// Function to register loading state handlers
export const registerLoadingHandlers = (start, finish) => {
  startApiCall = start;
  finishApiCall = finish;
};

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 45000,
  withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Check if this endpoint should show loading state
    const shouldShowLoading = !noLoadingEndpoints.some((endpoint) =>
      config.url.includes(endpoint),
    );

    // Start loading state for this request if needed
    if (shouldShowLoading) {
      startApiCall();
    }

    // Do something before request is sent
    const noAuthEndpoints = [
      "/users/register",
      "/auth/login",
      "/auth/verify-email",
      "/auth/refresh-token",
      "/auth/logout",
      "/auth/check-exist-email",
      "/users/forgot-password",
      "/users/reset-password",
      "/re-send-mail",
      "/properties/search",
      "/properties/{id}",
      "/properties/{id}/accommodations",
      "/properties/{id}/reviews",
      "/properties/${id}/accommodations/available",
      "/locations",
      "/payments/check-payment-status",
      "/bookings",
      "/users/host/check-email",
    ];

    const isNoAuthEndpoint = noAuthEndpoints.some(
      (endpoint) => config.url === endpoint,
    );
    const token = localStorage.getItem("accessToken");

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
instance.interceptors.response.use(
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
    const isNoAuthEndpoint = noRefreshTokenEndpoints.some(
      (endpoint) => originalRequest.url === endpoint,
    );
    // Check if the error is 401 and the request is not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Ensure the URL is not /auth/login before calling /auth/refresh-token
      if (!isNoAuthEndpoint) {
        try {
          const response = await instance.post("/auth/refresh-token", {
            access_token: localStorage.getItem("accessToken"),
          });

          const newAccessToken = response.data.data.access_token;

          // Persist the new access token
          localStorage.setItem("accessToken", newAccessToken);

          // Update the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Retry the original request with the new token
          return instance(originalRequest);
        } catch (err) {
          console.error("Error refreshing token:", err);

          // Clear the token and redirect to the login page on error
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
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

export default instance;
