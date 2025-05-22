import LeftBooking from "../components/Booking/LeftBooking";
import HeaderProgress from "../components/Booking/HeaderProgress";
import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { setPageTitle } from "../utils/pageTitle";
import { formatDate, getNights } from "../utils/utility";
import axios from "../utils/axiosCustomize";
import { useStore } from "../utils/AuthProvider";
import { FaLock } from "react-icons/fa6";
import {
  FaIdCard,
  FaPhoneAlt,
  FaQrcode,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  MdPayment,
  MdEmail,
  MdLocationOn,
  MdWarning,
  MdInfo,
} from "react-icons/md";

const FinishedBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { store } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    hotelData,
    accommodations,
    adults,
    children,
    checkIn,
    checkOut,
    totalPrice,
    firstName,
    lastName,
    email,
    phone,
    specialRequests,
    country,
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState(null);

  useEffect(() => {
    setPageTitle("Đặt phòng hoàn tất");
    window.scrollTo(0, 0);
  }, []);

  const handleCompleteBooking = async () => {
    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }

    try {
      setIsSubmitting(true);

      // Format the accommodation data for API request
      const formattedAccommodations = accommodations.map((acc) => ({
        id: acc.accommodation_id,
        quantity: acc.quantity || 1,
      }));

      // Create the base request body
      let requestBody = {
        check_in: checkIn,
        check_out: checkOut,
        adults: adults || 2,
        children: children || 0,
        properties_id: hotelData?.id,
        accommodations: formattedAccommodations,
        payment_method: paymentMethod === "online" ? "ONLINE" : "CASH",
      };

      // Add either user_id or guest information based on login status
      if (store.userProfile) {
        requestBody.user_id = store.userProfile.id;
      } else {
        requestBody.guest = {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phone,
          country: country || "Vietnam", // Default to Vietnam if not provided
        };
      }

      // Make API call to create booking
      const response = await axios.post("/bookings", requestBody);

      // Navigate to BookingSuccess with response data
      navigate("/booking/success", {
        state: {
          bookingData: response.data.data,
          paymentMethod,
          hotelData,
        },
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      <HeaderProgress step={3} />
      <div className="mx-auto max-w-[1110px] px-4">
        {/* Main content */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left column - Property details */}
          <LeftBooking
            hotelData={hotelData}
            accommodations={accommodations}
            adults={adults}
            childs={children}
            checkIn={checkIn}
            checkOut={checkOut}
            totalPrice={totalPrice}
          />

          {/* Right column - Booking confirmation */}
          <div className="w-full space-y-6 lg:w-2/3">
            <div className="rounded-lg bg-white p-6 shadow">
              {/* Booking details */}
              <div className="mb-6">
                <h2 className="mb-4 text-xl font-bold">Chi tiết đặt phòng</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-md bg-gray-50 p-4">
                    <h3 className="mb-2 flex items-center gap-2 font-bold">
                      <FaIdCard className="text-gray-600" />
                      <span>Thông tin khách hàng</span>
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="font-medium">
                          {firstName} {lastName}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <MdEmail className="text-gray-500" />
                        <span>{email}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FaPhoneAlt className="text-gray-500" />
                        <span>{phone}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-md bg-gray-50 p-4">
                    <h3 className="mb-2 flex items-center gap-2 font-bold">
                      <MdPayment className="text-gray-600" />
                      <span>Chi tiết thanh toán</span>
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Tổng giá: </span>
                        <span className="text-lg font-bold text-blue-600">
                          VND {totalPrice}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        (Đã bao gồm thuế và phí)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment options */}
              <div className="mb-6">
                <h2 className="mb-4 text-xl font-bold">Lựa chọn thanh toán</h2>
                <div className="space-y-4">
                  {/* Option 1: Pay now with QR code */}
                  <div
                    className={`relative cursor-pointer rounded-lg border p-4 transition hover:shadow-md ${
                      paymentMethod === "ONLINE"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => {
                      setPaymentMethod("ONLINE");
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            paymentMethod === "ONLINE"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100"
                          }`}
                        >
                          <FaQrcode className="text-xl" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            Thanh toán online bằng mã QR ngay khi đặt phòng
                          </h3>
                          <p className="text-sm text-gray-600">
                            Quét mã QR để thanh toán qua ngân hàng hoặc ví điện
                            tử
                          </p>
                        </div>
                      </div>
                      <div
                        className={`h-5 w-5 rounded-full border ${
                          paymentMethod === "ONLINE"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "ONLINE" && (
                          <div className="flex h-full w-full items-center justify-center text-white">
                            <span className="text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Pay at property */}
                  <div
                    className={`cursor-pointer rounded-lg border p-4 transition hover:shadow-md ${
                      paymentMethod === "CASH"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => {
                      setPaymentMethod("CASH");
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            paymentMethod === "CASH"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100"
                          }`}
                        >
                          <FaMoneyBillWave className="text-xl" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            Thanh toán khi đến chỗ nghỉ
                          </h3>
                          <p className="text-sm text-gray-600">
                            Không cần trả trước - thanh toán trực tiếp tại chỗ
                            nghỉ
                          </p>
                        </div>
                      </div>
                      <div
                        className={`h-5 w-5 rounded-full border ${
                          paymentMethod === "CASH"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "CASH" && (
                          <div className="flex h-full w-full items-center justify-center text-white">
                            <span className="text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {paymentMethod === "CASH" && (
                      <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
                        <p className="text-sm text-green-700">
                          <strong>Không cần thanh toán hôm nay!</strong> Bạn sẽ
                          thanh toán đầy đủ khi đến chỗ nghỉ.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Property details */}
              <div className="mb-6 rounded-md bg-gray-50 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-bold">
                  <MdLocationOn className="text-gray-600" />
                  <span>Chi tiết nơi lưu trú</span>
                </h3>

                <div className="mb-3 flex items-center gap-2">
                  <div className="font-medium">{hotelData?.name}</div>
                  <div className="text-gray-500">•</div>
                  <div className="text-sm text-gray-600">
                    {hotelData?.address}
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-1 gap-4 border-b border-gray-200 pb-3 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Nhận phòng</p>
                    <p className="font-medium">{formatDate(checkIn)}</p>
                    <p className="text-sm">{hotelData?.check_in_time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trả phòng</p>
                    <p className="font-medium">{formatDate(checkOut)}</p>
                    <p className="text-sm">{hotelData?.check_out_time}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Thời gian lưu trú</p>
                  <p className="font-medium">
                    {getNights(checkIn, checkOut)} đêm
                  </p>
                </div>
              </div>

              {/* Special requests */}
              {specialRequests && (
                <div className="mb-6 rounded-md border border-gray-200 p-4">
                  <h3 className="mb-2 font-bold">Yêu cầu đặc biệt</h3>
                  <p className="text-gray-700 italic">
                    &quot;{specialRequests}&quot;
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Yêu cầu đặc biệt không được đảm bảo - chỗ nghỉ sẽ cố gắng
                    hết sức để đáp ứng nhu cầu của bạn.
                  </p>
                </div>
              )}

              {/* Important notes */}
              <div className="mb-6">
                <h2 className="mb-4 text-xl font-bold">Thông tin quan trọng</h2>
                <div className="rounded-md bg-yellow-50 p-4">
                  <h3 className="mb-3 flex items-center gap-2 font-medium text-yellow-800">
                    <MdWarning className="text-yellow-700" />
                    <span>Lưu ý khi nhận phòng</span>
                  </h3>
                  <ul className="list-inside list-disc space-y-2 text-sm text-gray-700">
                    <li>Xin vui lòng trình giấy tờ tùy thân khi nhận phòng</li>
                    <li>
                      Phòng được nhận từ {hotelData?.check_in_time} và trả phòng
                      trước {hotelData?.check_out_time}
                    </li>
                    <li>
                      Vui lòng liên hệ trực tiếp với chỗ nghỉ nếu bạn dự kiến
                      đến muộn
                    </li>
                    <li>
                      Có thể cần thanh toán thêm cho dịch vụ đưa đón sân bay
                    </li>
                  </ul>
                </div>
              </div>

              {/* Cancellation policy */}
              <div className="mb-6 rounded-md border-l-4 border-blue-600 bg-blue-50 p-4">
                <h3 className="mb-2 flex items-center gap-2 font-medium text-blue-800">
                  <MdInfo />
                  <span>Chính sách hủy đặt phòng</span>
                </h3>
                <p className="text-gray-700">
                  Bạn có thể hủy miễn phí đến 24 giờ trước ngày nhận phòng. Sau
                  thời gian này, bạn có thể bị tính phí cho đêm đầu tiên.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col justify-end gap-4 border-t border-gray-200 pt-6 sm:flex-row">
                <button
                  onClick={handleCompleteBooking}
                  disabled={!paymentMethod || isSubmitting}
                  className={`flex cursor-pointer items-center justify-center rounded-md px-6 py-3 text-white transition ${
                    !paymentMethod || isSubmitting
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-third hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="mr-2 h-5 w-5 animate-spin text-white"
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FaLock className="ml-2" />
                      <span>Hoàn tất đặt phòng</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishedBooking;
