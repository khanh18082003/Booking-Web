/**
 * Sets the document title with a consistent pattern
 * @param {string} title - The page-specific title
 * @param {boolean} includeAppName - Whether to include the app name after the title (default: true)
 */
export const setPageTitle = (title, includeAppName = true) => {
  const appName = "Booking.com";
  document.title = includeAppName ? `${title} | ${appName}` : title;
};

/**
 * Default titles for common pages
 */
export const PAGE_TITLES = {
  HOME: "Khách sạn, Nhà nghỉ, Căn hộ & Hơn thế nữa",
  LOGIN: "Đăng nhập",
  REGISTER: "Đăng ký",
  VERIFY_EMAIL: "Xác thực email",
  PROPERTIES: "Kết quả tìm kiếm",
  PROFILE: "Tài khoản của tôi",
  PERSONAL: "Thông tin cá nhân",
  NOT_FOUND: "Trang không tìm thấy",
  BOOKING_CONFIRMATION: "Xác nhận đặt phòng",
};
