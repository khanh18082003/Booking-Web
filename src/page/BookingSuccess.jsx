import { useCallback, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import {
  FaHome,
  FaQrcode,
  FaIdCard,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaBed,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPayment, MdPrint } from "react-icons/md";
import { setPageTitle } from "../utils/pageTitle";
import { formatDate, getNights } from "../utils/utility";
import axios from "../configuration/axiosCustomize";

const BookingSuccess = () => {
  const location = useLocation();

  // Get booking data directly from location state (passed from FinishedBooking)
  const { bookingData, paymentMethod } = location.state || {};
  // Determine whether payment is online based on payment method
  const isOnlinePayment = paymentMethod === "ONLINE";
  const [payment, setPayment] = useState(bookingData?.payment || {});
  useEffect(() => {
    setPageTitle("Đặt phòng thành công");
    hanldeCallGetPayment();
    window.scrollTo(0, 0);
  }, []);

  const hanldeCallGetPayment = async () => {
    try {
      const response = await axios.get("payments/get-payment", {
        params: {
          id: bookingData.payment.id,
        },
      });
      if (response.data.status === 200 && response.data.code === "M000") {
        setPayment(response.data.data);
      } else {
        console.error("Failed to fetch payment data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
      alert(
        "Đã xảy ra lỗi khi lấy thông tin thanh toán. Vui lòng thử lại sau.",
      );
    }
  };

  // Đảm bảo handleCallHistoricalTransaction không thay đổi giữa các render
  const handleCallHistoricalTransaction = useCallback(async () => {
    try {
      const response = await axios.get("payments/check-payment-status", {
        params: {
          id: bookingData.payment.id,
          expectedAmount: bookingData.total_price,
          expectedTransactionId: bookingData.payment.transaction_id,
        },
      });
      if (
        response.data.status === 200 &&
        response.data.code === "M000" &&
        response.data.data
      ) {
        setPayment((prevPayment) => ({
          ...prevPayment,
          status: true,
        }));
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      alert(
        "Đã xảy ra lỗi khi kiểm tra trạng thái thanh toán. Vui lòng thử lại sau.",
      );
    }
  }, [
    bookingData.payment.id,
    bookingData.total_price,
    bookingData.payment.transaction_id,
  ]);

  useEffect(() => {
    let intervalId;
    if (isOnlinePayment && payment.status !== true) {
      intervalId = setInterval(() => {
        handleCallHistoricalTransaction();
      }, 2000);
    }
    if (payment.status === true && intervalId) {
      clearInterval(intervalId);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOnlinePayment, payment.status, handleCallHistoricalTransaction]);

  // Check if we have booking data
  if (!bookingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="text-6xl text-yellow-500">⚠️</div>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            Không tìm thấy thông tin đặt phòng
          </h1>
          <p className="mt-2 text-gray-600">
            Vui lòng quay lại trang chủ và thử lại
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (isOnlinePayment) {
    // QR code for online payments
    var qrCodeUrl = bookingData.payment?.url_image;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Success Message Banner */}
        <div className="mb-6 flex flex-col items-center justify-center rounded-lg bg-white p-10 text-center shadow-lg">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <IoCheckmarkCircleOutline className="text-5xl text-green-500" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Đặt phòng thành công!
          </h1>
          <p className="mb-4 text-lg text-gray-600">
            Cảm ơn bạn đã đặt phòng tại{" "}
            <span className="font-semibold text-blue-600">
              {bookingData.properties.name}
            </span>
            . Booking.com đã gửi thông tin đặt phòng đến email của bạn.
          </p>
          <div className="mb-2 text-lg font-medium">
            <span className="text-blue-600">
              {bookingData.user_booking.email}
            </span>
          </div>
        </div>

        {/* Booking Details Card */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          {/* Card Header */}
          <div className="border-b bg-blue-600 p-6 text-white">
            <h2 className="text-xl font-bold">Chi tiết đặt phòng</h2>
            <p className="text-blue-100">
              Vui lòng lưu lại thông tin này để tham khảo trong tương lai
            </p>
          </div>

          {/* Property details */}
          <div className="border-b border-gray-200 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
              <FaMapMarkerAlt className="text-blue-600" />
              <span>Chi tiết nơi lưu trú</span>
            </h3>

            <div className="mb-5 flex flex-col rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="text-xl font-semibold text-gray-800">
                  {bookingData.properties.name}
                </div>
              </div>
              <div className="mb-4 flex items-center gap-1 text-sm text-gray-600">
                <MdLocationOn />
                <span>{bookingData.properties.address}</span>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-blue-600">
                    <FaRegCalendarAlt />
                    <span className="font-medium">Nhận phòng</span>
                  </div>
                  <p className="text-lg font-bold">
                    {formatDate(bookingData.check_in)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Từ {bookingData.properties.check_in_time}
                  </p>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-red-500">
                    <FaRegCalendarAlt />
                    <span className="font-medium">Trả phòng</span>
                  </div>
                  <p className="text-lg font-bold">
                    {formatDate(bookingData.check_out)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Trước {bookingData.properties.check_out_time}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center rounded-lg bg-blue-50 p-2">
                <FaBed className="mr-2 text-blue-600" />
                <p className="text-lg font-medium">
                  Thời gian lưu trú:{" "}
                  <span className="font-bold">
                    {getNights(bookingData.check_in, bookingData.check_out)} đêm
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Guest information */}
          <div className="border-b border-gray-200 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
              <FaIdCard className="text-blue-600" />
              <span>Thông tin khách hàng</span>
            </h3>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <span className="text-lg font-bold">
                      {bookingData.user_booking?.firstName?.charAt(0) || "K"}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      {bookingData.user_booking?.firstName}{" "}
                      {bookingData.user_booking?.lastName}
                    </p>
                    {bookingData.user_booking?.country && (
                      <p className="text-sm text-gray-600">
                        {bookingData.user_booking.country}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MdEmail className="text-blue-600" />
                    <span>{bookingData.user_booking?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-blue-600" />
                    <span>{bookingData.user_booking?.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment details */}
          <div className="border-b border-gray-200 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
              <MdPayment className="text-blue-600" />
              <span>Chi tiết thanh toán</span>
            </h3>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-4 flex justify-between border-b border-dashed border-gray-300 pb-4">
                <p className="font-medium text-gray-600">
                  Phương thức thanh toán:
                </p>
                <p className="font-bold">
                  {isOnlinePayment
                    ? "Thanh toán online"
                    : "Thanh toán tại chỗ nghỉ"}
                </p>
              </div>

              <div className="mb-4 flex justify-between border-b border-dashed border-gray-300 pb-4">
                <p className="font-medium text-gray-600">Trạng thái:</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold text-white ${
                    payment.status === true ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {payment.status === true
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="font-medium text-gray-600">Tổng giá:</p>
                  <p className="text-xs text-gray-500">
                    (Đã bao gồm thuế và phí)
                  </p>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  VND{" "}
                  {typeof bookingData.total_price === "number"
                    ? bookingData.total_price.toLocaleString()
                    : bookingData.total_price}
                </p>
              </div>
            </div>
          </div>

          {/* QR Payment Section - Only shown for online payment */}
          {isOnlinePayment && !payment.status && (
            <div className="border-b border-gray-200 p-6">
              <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
                <div className="mb-4 flex items-center justify-center">
                  <div className="rounded-full bg-blue-100 p-3">
                    <FaQrcode className="text-3xl text-blue-600" />
                  </div>
                </div>
                <h3 className="mb-6 text-center text-xl font-bold text-gray-800">
                  Quét mã QR để thanh toán
                </h3>
                <div className="mb-6 flex justify-center">
                  <div className="overflow-hidden rounded-lg border-4 border-white bg-white shadow-lg">
                    <img
                      src={qrCodeUrl}
                      alt="Payment QR Code"
                      className="h-60 w-60"
                    />
                  </div>
                </div>
                <div className="mb-4 rounded-lg bg-yellow-50 p-4 text-center">
                  <p className="text-sm font-medium text-yellow-800">
                    Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã QR và
                    hoàn tất thanh toán
                  </p>
                </div>
                <div className="rounded-lg bg-blue-100 p-3 text-center">
                  <p className="font-medium text-blue-800">
                    Số tiền cần thanh toán:{" "}
                    <span className="font-bold">
                      VND{" "}
                      {typeof bookingData.total_price === "number"
                        ? bookingData.total_price.toLocaleString()
                        : bookingData.total_price}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between bg-gray-50 p-6">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <MdPrint />
              <span>In xác nhận</span>
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-white shadow-sm transition hover:bg-blue-700"
            >
              <FaHome />
              <span>Về trang chủ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
