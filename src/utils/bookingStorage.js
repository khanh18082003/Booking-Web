// Utility functions for temporary storage of booking data during authentication flow

// Keys for localStorage
const BOOKING_DATA_KEY = "temp_booking_data";
const BOOKING_EXPIRY_KEY = "temp_booking_expiry";
const EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Save booking data to localStorage with expiration
 * @param {Object} data - The booking data to store
 */
export const saveBookingData = (data) => {
  try {
    // Set expiration time - 30 minutes from now
    const expiryTime = Date.now() + EXPIRY_TIME;
    localStorage.setItem(BOOKING_EXPIRY_KEY, expiryTime.toString());
    localStorage.setItem(BOOKING_DATA_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving booking data to localStorage:", error);
    return false;
  }
};

/**
 * Retrieve booking data from localStorage if it exists and hasn't expired
 * @returns {Object|null} The stored booking data or null if expired/not found
 */
export const getBookingData = () => {
  try {
    const expiryTime = localStorage.getItem(BOOKING_EXPIRY_KEY);
    if (!expiryTime || parseInt(expiryTime) < Date.now()) {
      // Data has expired or doesn't exist
      clearBookingData();
      return null;
    }

    const bookingDataString = localStorage.getItem(BOOKING_DATA_KEY);
    if (!bookingDataString) return null;

    return JSON.parse(bookingDataString);
  } catch (error) {
    console.error("Error retrieving booking data from localStorage:", error);
    return null;
  }
};

/**
 * Clear stored booking data from localStorage
 */
export const clearBookingData = () => {
  localStorage.removeItem(BOOKING_DATA_KEY);
  localStorage.removeItem(BOOKING_EXPIRY_KEY);
};
