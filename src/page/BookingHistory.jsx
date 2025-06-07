import { useState, useEffect, useCallback } from "react";
import { useStore } from "../utils/AuthProvider";
import axios from "../configuration/axiosCustomize";
import tripsGlobe from "../assets/TripsGlobe.png";
import tripsEmptyScreenComplete from "../assets/TripsEmptyScreenComplete.png";
import { formatDate } from "../utils/utility";

const BookingHistory = () => {
  const { store } = useStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("COMPLETED");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({});

  // Cập nhật thông tin thanh toán cho booking
  const updatePaymentStatus = useCallback(async (bookingId, paymentId) => {
    try {
      const response = await axios.get("payments/get-payment", {
        params: {
          id: paymentId,
        },
      });
      if (response.data.status === 200 && response.data.code === "M000") {
        setPaymentStatus((prev) => ({
          ...prev,
          [bookingId]: response.data.data,
        }));
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  }, []);

  // Kiểm tra trạng thái thanh toán
  const checkPaymentStatus = useCallback(async (booking) => {
    if (!booking.payment_image || booking.payment_method !== "ONLINE") return;

    try {
      const response = await axios.get("payments/check-payment-status", {
        params: {
          id: booking.payment_id,
          expectedAmount: booking.total_price,
          expectedTransactionId: booking.transaction_id,
        },
      });
      if (
        response.data.status === 200 &&
        response.data.code === "M000" &&
        response.data.data
      ) {
        setPaymentStatus((prev) => ({
          ...prev,
          [booking.booking_id]: {
            ...prev[booking.booking_id],
            status: true,
          },
        }));
        // Cập nhật trạng thái thanh toán trong bookings
        setBookings((prevBookings) =>
          prevBookings.map((b) =>
            b.booking_id === booking.booking_id
              ? { ...b, payment_status: "true" }
              : b,
          ),
        );
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  }, []);

  // Polling để kiểm tra thanh toán cho booking đang mở modal
  useEffect(() => {
    let intervalId;
    if (
      selectedBooking &&
      showModal &&
      selectedBooking.status === "CONFIRMED" &&
      selectedBooking.payment_method === "ONLINE" &&
      selectedBooking.payment_status !== "true" &&
      paymentStatus[selectedBooking.booking_id]?.status !== true
    ) {
      intervalId = setInterval(() => {
        checkPaymentStatus(selectedBooking);
      }, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedBooking, showModal, paymentStatus, checkPaymentStatus]);

  useEffect(() => {
    if (!store.userProfile) {
      return;
    }
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/users/bookings-history", {
          params: {
            pageNo: 1,
            pageSize: 10,
          },
        });

        if (response.data.code === "M000") {
          setBookings(response.data.data.data || []);
          console.log(
            "Bookings fetched successfully:",
            response.data.data.data,
          );
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error("Error fetching booking history:", err);
        setError("Không thể tải lịch sử đặt phòng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [store.userProfile]);

  const filteredConfirmedBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED",
  );

  const filteredBookings = bookings.filter(
    (booking) => booking.status === activeTab,
  );

  const renderEmptyState = () => (
    <div className="flex max-w-[700px] items-center justify-start pt-6 pb-16">
      <div className="mr-6">
        <img src={tripsGlobe} alt="Trips Globe" className="object-cover" />
      </div>

      <div className="w-full">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Đi đâu tiếp đây?
        </h2>
        <p className="mb-8 w-full">
          Bạn chưa có chuyến đi nào cả. Sau khi bạn đặt chỗ, đơn đó sẽ xuất hiện
          tại đây.
        </p>
      </div>
    </div>
  );

  // Modal hiển thị chi tiết booking
  const renderBookingDetailModal = () => {
    if (!selectedBooking) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={() => setShowModal(false)}
            aria-label="Đóng"
          >
            <span className="text-2xl">&times;</span>
          </button>
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
            Chi tiết đặt phòng
          </h2>
          <div className="mb-6 flex items-center gap-4">
            <img
              src={selectedBooking.property_image}
              alt={selectedBooking.property_name}
              className="h-20 w-20 rounded-lg border object-cover"
              onError={(e) => {
                e.target.src = "/src/assets/TripsGlobe.png";
              }}
            />
            <div className="flex-1">
              <div className="mb-1 text-lg font-semibold text-gray-800">
                {selectedBooking.property_name}
              </div>
              <div className="mb-1 text-sm text-gray-500">
                {selectedBooking.property_address},{" "}
                {selectedBooking.property_province}
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(selectedBooking.check_in)} –{" "}
                {formatDate(selectedBooking.check_out)}
              </div>
            </div>
          </div>
          <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <span className="font-semibold">Trạng thái:</span>{" "}
              <span className="capitalize">{selectedBooking.status}</span>
            </div>
            <div>
              <span className="font-semibold">Check-in:</span>{" "}
              {formatDate(selectedBooking.check_in)}
            </div>
            <div>
              <span className="font-semibold">Check-out:</span>{" "}
              {formatDate(selectedBooking.check_out)}
            </div>
            <div>
              <span className="font-semibold">Người lớn:</span>{" "}
              {selectedBooking.adults}
            </div>
            <div>
              <span className="font-semibold">Trẻ em:</span>{" "}
              {selectedBooking.children}
            </div>
            <div>
              <span className="font-semibold">Tổng tiền:</span>{" "}
              <span className="font-semibold text-[#0071c2]">
                VND {selectedBooking.total_price?.toLocaleString("vi-VN")}
              </span>
            </div>
            <div className="col-span-2">
              <span className="font-semibold">Ghi chú:</span>{" "}
              {selectedBooking.note || (
                <span className="text-gray-400 italic">Không có</span>
              )}
            </div>
          </div>
          <div className="mb-2 text-base font-semibold text-gray-700">
            Thông tin khách hàng
          </div>
          <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <span className="font-semibold">Họ tên:</span>{" "}
              {selectedBooking.first_name} {selectedBooking.last_name}
            </div>
            <div>
              <span className="font-semibold">Email:</span>{" "}
              {selectedBooking.email}
            </div>
            <div>
              <span className="font-semibold">Số điện thoại:</span>{" "}
              {selectedBooking.phone}
            </div>
            <div>
              <span className="font-semibold">Quốc gia:</span>{" "}
              {selectedBooking.country}
            </div>
          </div>
          <div className="mb-2 text-base font-semibold text-gray-700">
            Thông tin thanh toán
          </div>
          <div className="mb-2 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <span className="font-semibold">Trạng thái:</span>{" "}
              {paymentStatus[selectedBooking.booking_id]?.status === true ||
              selectedBooking.payment_status === "true" ? (
                <span className="font-bold text-primary">Đã thanh toán</span>
              ) : (
                <span className="font-bold text-red-500">Chưa thanh toán</span>
              )}
            </div>
            <div>
              <span className="font-semibold">Phương thức:</span>{" "}
              {selectedBooking.payment_method}
            </div>
          </div>
          {/* Hiển thị mã thanh toán nếu chưa thanh toán và là ONLINE và booking CONFIRMED */}
          {paymentStatus[selectedBooking.booking_id]?.status !== true &&
            selectedBooking.payment_status !== "true" &&
            selectedBooking.payment_method === "ONLINE" &&
            selectedBooking.status === "CONFIRMED" &&
            selectedBooking.payment_image && (
              <div className="mt-4">
                <div className="mb-2 text-sm font-semibold text-gray-700">
                  Quét mã để thanh toán:
                </div>
                <img
                  src={selectedBooking.payment_image}
                  alt="Mã thanh toán"
                  className="mx-auto h-40 w-40 rounded border object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
        </div>
      </div>
    );
  };

  const renderConfirmedBookingCard = (booking, onCancel) => (
    <div
      key={booking.booking_id}
      className="mb-6 flex cursor-pointer items-center rounded-lg bg-white p-4 shadow duration-200 hover:bg-third/15 hover:shadow-lg"
      onClick={() => {
        setSelectedBooking(booking);
        setShowModal(true);
        // Load payment info khi mở modal
        if (booking.payment_id) {
          updatePaymentStatus(booking.booking_id, booking.payment_id);
        }
      }}
    >
      <img
        src={booking.property_image}
        alt={booking.property_name}
        className="mr-4 h-20 w-20 rounded-md object-cover"
        onError={(e) => {
          e.target.src = "/src/assets/TripsGlobe.png";
        }}
      />
      <div className="flex-1">
        <div className="text-base font-semibold">{booking.property_name}</div>
        <div className="text-sm text-gray-500">
          {formatDate(booking.check_in)} – {formatDate(booking.check_out)}
        </div>
        <div className="mt-1 text-sm text-gray-500">
          Tổng:{" "}
          <span className="font-semibold text-[#0071c2]">
            VND {booking.total_price.toLocaleString("vi-VN")}
          </span>
        </div>
        <button
          onClick={() => onCancel(booking.booking_id)}
          className="mt-2 cursor-pointer rounded bg-red-500 px-3 py-1 text-xs text-white duration-200 hover:bg-red-600"
        >
          Hủy đặt phòng
        </button>
        <span>
          {booking.payment_status === "true" ? (
            <span className="ml-2 text-sm font-bold text-primary">
              Đã thanh toán
            </span>
          ) : (
            <span className="ml-2 text-sm font-bold text-red-500">
              Chưa thanh toán
            </span>
          )}
        </span>
      </div>
    </div>
  );

  // Card cho tab Đã qua & Đã hủy
  const renderBookingCard = (booking) => (
    <div
      key={booking.booking_id}
      className="mb-6 flex cursor-pointer items-center rounded-lg bg-white p-4 shadow"
      onClick={() => {
        setSelectedBooking(booking);
        setShowModal(true);
        // Chỉ load payment info cho booking CONFIRMED có thể thanh toán
        if (booking.status === "CONFIRMED" && booking.payment_id) {
          updatePaymentStatus(booking.booking_id, booking.payment_id);
        }
      }}
    >
      <img
        src={booking.property_image}
        alt={booking.property_name}
        className="mr-4 h-20 w-20 rounded-md object-cover"
        onError={(e) => {
          e.target.src = "/src/assets/TripsGlobe.png";
        }}
      />
      <div>
        <div className="text-base font-semibold">{booking.property_name}</div>
        <div className="text-sm text-gray-500">
          {formatDate(booking.check_in)} – {formatDate(booking.check_out)}
        </div>
        <div className="mt-1 text-xs text-gray-500">1 đơn đặt</div>
      </div>
    </div>
  );

  // Hàm xử lý hủy đặt phòng
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đặt phòng này?")) return;
    try {
      setLoading(true);
      const response = await axios.post(
        `/bookings/cancel-booking/${bookingId}`,
      );
      if (response.data.code === "M000") {
        setBookings((prev) =>
          prev.map((b) =>
            b.booking_id === bookingId ? { ...b, status: "CANCELLED" } : b,
          ),
        );
        alert("Đã hủy đặt phòng thành công.");
      } else {
        alert(response.data.message || "Không thể hủy đặt phòng.");
      }
    } catch {
      alert("Có lỗi xảy ra khi hủy đặt phòng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-[#0071c2]"></div>
          <p className="text-gray-600">Đang tải lịch sử đặt phòng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-gray-800">
            Đã xảy ra lỗi
          </h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-[#0071c2] px-6 py-3 font-bold text-white transition duration-200 hover:bg-[#00487a]"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-[1110px] px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Đặt chỗ & Chuyến đi
      </h1>

      {filteredConfirmedBookings.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredConfirmedBookings.map((booking) =>
            renderConfirmedBookingCard(booking, handleCancelBooking),
          )}
        </div>
      )}

      <div>
        <div className="flex items-center gap-4">
          <div>
            <button
              onClick={() => setActiveTab("COMPLETED")}
              className={`cursor-pointer rounded-full px-4 py-[11px] ${activeTab === "COMPLETED" && "border-1 border-third bg-third/10 text-third"}`}
            >
              Đã qua
            </button>
          </div>
          <div>
            <button
              onClick={() => setActiveTab("CANCELLED")}
              className={`cursor-pointer rounded-full px-4 py-[11px] duration-200 hover:bg-gray-200 ${activeTab === "CANCELLED" && "border-1 border-third bg-third/10 text-third"}`}
            >
              Đã hủy
            </button>
          </div>
        </div>
        {activeTab === "COMPLETED" ? (
          <div className="mt-6">
            {filteredBookings.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {filteredBookings.map((booking) => renderBookingCard(booking))}
              </div>
            ) : (
              <div className="flex max-w-[700px] items-center justify-start pt-6 pb-16">
                <div className="mr-6">
                  <img
                    src={tripsEmptyScreenComplete}
                    alt="Trips Globe"
                    className="object-cover"
                  />
                </div>

                <div className="w-full">
                  <h2 className="mb-4 text-2xl font-bold text-gray-800">
                    Ghé lại những nơi bạn yêu thích
                  </h2>
                  <p className="mb-8 w-full">
                    Tại đây, bạn sẽ thấy tất cả chuyến đi trước đây để có cảm
                    hứng cho tương lai.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          activeTab === "CANCELLED" && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => renderBookingCard(booking))
              ) : (
                <div className="text-center text-gray-600">
                  Không có chuyến đi nào đã hủy.
                </div>
              )}
            </div>
          )
        )}
      </div>
      {showModal && renderBookingDetailModal()}
    </div>
  );
};

export default BookingHistory;
