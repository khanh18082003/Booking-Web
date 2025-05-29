import { useState, useEffect } from "react";
import { setPageTitle } from "../utils/pageTitle";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { FaChevronRight, FaUser } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useStore } from "../utils/AuthProvider";
import countries from "../utils/countries";
import HeaderProgress from "../components/Booking/HeaderProgress";
import LeftBooking from "../components/Booking/LeftBooking";
import axios from "../utils/axiosCustomize";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { store } = useStore();
  const location = useLocation();
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  // Initialize form with userProfile data if available
  const [formData, setFormData] = useState({
    firstName: store.userProfile?.first_name || "",
    lastName: store.userProfile?.last_name || "",
    email: store.userProfile?.email || "",
    phone: store.userProfile?.phone || "",
    country: store.userProfile?.nationality || "Việt Nam",
    specialRequests: "",
    phone_code: store.userProfile?.country_code || "+84",
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    country: false,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // State to track textarea focus for animation
  const [textareaFocused, setTextareaFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { id, propertiesName } = useParams();
  const params = new URLSearchParams(location.search);
  const adults = params.get("adults");
  const children = params.get("children");
  const checkIn = params.get("checkin");
  const checkOut = params.get("checkout");
  const rooms = params.get("rooms");
  const accommodations = params.get("accommodation_ids");

  useEffect(() => {
    callCheckedAvailableAccommodations();
  }, [checkIn, checkOut, adults, children, rooms, accommodations]);

  const callCheckedAvailableAccommodations = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await axios.get(
        `/properties/${id}/accommodations/available`,
        {
          params: {
            check_in: checkIn,
            check_out: checkOut,
            adults: adults,
            children: children,
            rooms: rooms,
            accommodations: accommodations,
          },
        },
      );

      setBookingData(response.data.data);
    } catch (error) {
      console.error("Error fetching available accommodations:", error);

      // Get error message from API response or use a default message
      const errorMsg =
        error.response?.data?.message ||
        "Không thể tải thông tin phòng. Hệ thống sẽ đưa bạn về trang chọn phòng.";
      setErrorMessage(errorMsg);

      // Set timeout to redirect after showing the error message
      setTimeout(() => {
        // Navigate back to the property page with search parameters
        navigate(
          `/properties/${id}/${propertiesName}/info?${new URLSearchParams({
            checkin: checkIn,
            checkout: checkOut,
            adults: adults,
            children: children || 0,
            rooms: rooms,
          }).toString()}`,
        );
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle login click
  const handleLoginClick = () => {
    // Navigate to login page without passing booking data in state
    navigate("/login", {
      state: { from: location.pathname + location.search },
    });
  };

  useEffect(() => {
    setPageTitle("Xác nhận đặt phòng");
  }, []);

  useEffect(() => {
    // If user is logged in, update form data and mark fields as touched
    if (store.userProfile) {
      // Update form data with user profile info
      setFormData((prev) => ({
        ...prev,
        firstName: store.userProfile.first_name || prev.firstName,
        lastName: store.userProfile.last_name || prev.lastName,
        email: store.userProfile.email || prev.email,
        phone: store.userProfile.phone || prev.phone,
        country: store.userProfile.nationality || prev.country,
      }));

      // Mark fields as touched if they have values
      const touchedFields = {};
      if (store.userProfile.first_name) touchedFields.firstName = true;
      if (store.userProfile.last_name) touchedFields.lastName = true;
      if (store.userProfile.email) touchedFields.email = true;
      if (store.userProfile.phone) touchedFields.phone = true;

      setTouched((prev) => ({ ...prev, ...touchedFields }));

      // Pre-validate fields with user profile data
      if (store.userProfile.first_name)
        validateField("firstName", store.userProfile.first_name);
      if (store.userProfile.last_name)
        validateField("lastName", store.userProfile.last_name);
      if (store.userProfile.email)
        validateField("email", store.userProfile.email);
      if (store.userProfile.phone)
        validateField("phone", store.userProfile.phone);
    }
  }, [store.userProfile]);

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          errorMessage = "Vui lòng nhập họ của bạn";
        }
        break;
      case "lastName":
        if (!value.trim()) {
          errorMessage = "Vui lòng nhập tên của bạn";
        }
        break;
      case "email":
        if (!value.trim()) {
          errorMessage = "Vui lòng nhập địa chỉ email";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMessage = "Vui lòng nhập địa chỉ email hợp lệ";
        }
        break;
      case "confirmEmail":
        if (!value.trim()) {
          errorMessage = "Vui lòng xác nhận địa chỉ email";
        } else if (value !== formData.email) {
          errorMessage = "Email xác nhận không khớp";
        }
        break;
      case "phone":
        if (!value.trim()) {
          errorMessage = "Vui lòng nhập số điện thoại";
        } else if (!/^\d{6,15}$/.test(value.replace(/\D/g, ""))) {
          errorMessage = "Vui lòng nhập số điện thoại hợp lệ";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));

    return errorMessage === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    let isValid = true;
    const newTouched = {};

    // Mark all fields as touched
    Object.keys(formData).forEach((key) => {
      if (
        ["firstName", "lastName", "email", "phone", "country"].includes(key)
      ) {
        newTouched[key] = true;
      }
    });

    setTouched(newTouched);

    // Validate each field
    for (const [name, value] of Object.entries(formData)) {
      if (["firstName", "lastName", "email", "phone"].includes(name)) {
        const fieldValid = validateField(name, value);
        isValid = isValid && fieldValid;
      }
    }

    if (!isValid) {
      return; // Prevent form submission if validation fails
    }

    setSubmitted(true);

    // Create a URLSearchParams string from the current params
    const searchParams = params.toString();
    localStorage.setItem("bookingFormData", JSON.stringify(formData));

    // Navigate to the FinishedBooking page with all required data
    navigate({
      pathname: `/booking/${id}`,
      search: searchParams,
    });
  };

  // Add handlers for textarea focus and blur
  const handleTextareaFocus = () => {
    setTextareaFocused(true);
  };

  const handleTextareaBlur = () => {
    setTextareaFocused(false);
  };

  // Lấy giá trị hiển thị trong form (từ userProfile nếu đăng nhập, hoặc từ formData)
  const getDisplayValue = (field) => {
    return formData[field];
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <svg
          className="h-12 w-12 animate-spin text-gray-200"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4zm16 0a8 8 0 01-8 8v-4a4 4 0 004-4h4z"
          ></path>
        </svg>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <p className="text-sm text-red-500">{errorMessage}</p>
          <p className="mt-2 text-xs text-gray-500">
            Bạn sẽ được chuyển hướng về trang chi tiết chỗ nghỉ trong giây
            lát...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-8">
      <HeaderProgress step={2} />
      <div className="mx-auto max-w-[1110px] px-4">
        {/* Main content */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left column - Property details */}
          {bookingData && (
            <LeftBooking bookingData={bookingData} params={params.toString()} />
          )}

          {/* Right column - User details form */}
          <div className="w-full lg:w-2/3">
            <div className="mb-4 flex items-center gap-3 rounded-lg bg-white p-4 shadow">
              <div>
                {store.userProfile ? (
                  <div className="rounded-full border-2 border-amber-500">
                    <img
                      src={store.userProfile?.avatar}
                      alt="User Avatar"
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <span>
                    <FaUser className="text-3xl text-third" />
                  </span>
                )}
              </div>
              <div>
                {store.userProfile ? (
                  <div>
                    <span className="font-bold">Bạn đã được đăng nhập</span>
                    <p>{store.userProfile.email}</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm">
                      <span
                        onClick={handleLoginClick}
                        className="cursor-pointer text-third hover:underline"
                      >
                        Đăng nhập
                      </span>{" "}
                      để đặt phòng với thông tin đã lưu của bạn hoặc{" "}
                      <span
                        onClick={() => {
                          navigate("/register", {
                            state: {
                              from: location.pathname + location.search,
                            },
                          });
                        }}
                        className="cursor-pointer text-third hover:underline"
                      >
                        đăng ký
                      </span>{" "}
                      để quản lý các đặt phòng của bạn mọi lúc mọi nơi!
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex items-center">
                <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#006ce4] text-white">
                  <IoCheckmarkCircleOutline className="text-xl" />
                </div>
                <h2 className="text-xl font-bold">
                  Gần xong rồi! Nhập thông tin chi tiết của bạn
                </h2>
              </div>

              <p className="mb-6 text-sm text-gray-600">
                Vui lòng nhập thông tin của bạn bằng ký tự Latin để chỗ nghỉ có
                thể hiểu được
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Họ (tiếng Anh) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={getDisplayValue("firstName")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full rounded-md border ${
                        touched.firstName && errors.firstName
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      } px-3 py-2 focus:border-[#006ce4] focus:ring-[#006ce4] focus:outline-none`}
                      placeholder="ví dụ: Nguyễn"
                    />
                    {touched.firstName && errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Tên (tiếng Anh) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={getDisplayValue("lastName")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full rounded-md border ${
                        touched.lastName && errors.lastName
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      } px-3 py-2 focus:border-[#006ce4] focus:ring-[#006ce4] focus:outline-none`}
                      placeholder="ví dụ: Khánh"
                    />
                    {touched.lastName && errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Địa chỉ email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={getDisplayValue("email")}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full rounded-md border ${
                      touched.email && errors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    } px-3 py-2 focus:border-[#006ce4] focus:ring-[#006ce4] focus:outline-none`}
                  />
                  {touched.email && errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Email xác nhận đặt phòng sẽ được gửi đến địa chỉ này
                  </p>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <select
                        name="phone_code"
                        value={formData.phone_code}
                        onChange={handleChange}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-[#006ce4] focus:ring-[#006ce4] focus:outline-none"
                      >
                        {countries.map((country, index) => (
                          <option key={index} value={country.dialCode}>
                            {country.code} {country.dialCode}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={getDisplayValue("phone")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`ml-2 w-full rounded-md border ${
                          touched.phone && errors.phone
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        } px-3 py-2 focus:border-[#006ce4] focus:ring-[#006ce4] focus:outline-none`}
                      />
                    </div>
                    {touched.phone && errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Vùng/quốc gia <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={getDisplayValue("country")}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full rounded-md border ${
                        touched.country && !formData.country
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      } bg-white px-3 py-2 focus:border-[#006ce4] focus:ring-[#006ce4] focus:outline-none`}
                    >
                      {countries.map((country, index) => (
                        <option key={index} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {store.userProfile && (
                  <div className="mb-6 flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      id="update_profile"
                      name="update_profile"
                      className="h-[20px] w-[20px] rounded"
                    />
                    <label
                      htmlFor="update_profile"
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      Cập nhật tài khoản của tôi để thêm vào những chi tiết mới
                      này.
                    </label>
                  </div>
                )}

                <div className="mb-6">
                  <label
                    htmlFor="specialRequests"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Yêu cầu đặc biệt
                  </label>
                  <div className="textarea-container">
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      onFocus={handleTextareaFocus}
                      onBlur={handleTextareaBlur}
                      rows={textareaFocused ? 5 : 3}
                      className={`w-full rounded-md border border-gray-300 px-3 py-2 transition-all duration-300 ease-in-out focus:border-[#006ce4] focus:ring-[#006ce4] focus:outline-none`}
                      style={{
                        resize: "none",
                        minHeight: textareaFocused ? "120px" : "72px",
                        transition: "min-height 0.3s ease-in-out",
                      }}
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end border-t border-gray-200 pt-6">
                  <button
                    type="submit"
                    className="flex w-full cursor-pointer items-center gap-4 rounded-md bg-third px-4 py-3 font-bold text-white transition duration-200 hover:bg-blue-700 md:w-auto"
                  >
                    <span>Tiếp theo: Chi tiết cuối cùng</span>
                    <span>
                      <FaChevronRight />
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
