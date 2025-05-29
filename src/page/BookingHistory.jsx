import { useState, useEffect } from "react";
import { useStore } from "../utils/AuthProvider";
import axios from "../utils/axiosCustomize";
import tripsGlobe from "../assets/TripsGlobe.png";
import tripsEmptyScreenComplete from "../assets/TripsEmptyScreenComplete.png";
import { formatDate } from "../utils/utility";

const BookingHistory = () => {
  const { store } = useStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("COMPLETED");

  useEffect(() => {
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
  }, []);

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

  const renderConfirmedBookingCard = (booking, onCancel) => (
    <div
      key={booking.booking_id}
      className="mb-6 flex w-[340px] items-center rounded-lg bg-white p-4 shadow"
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
          className="mt-2 rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
        >
          Hủy đặt phòng
        </button>
      </div>
    </div>
  );

  // Card cho tab Đã qua & Đã hủy
  const renderBookingCard = (booking) => (
    <div
      key={booking.booking_id}
      className="mb-6 flex w-[340px] items-center rounded-lg border bg-white p-4 shadow"
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
    } catch (err) {
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
        <div>
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
              filteredBookings.map((booking) => renderBookingCard(booking))
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
            <div className="mt-6">
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
    </div>
  );
};

export default BookingHistory;
