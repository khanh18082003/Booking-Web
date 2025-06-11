import { useState } from "react";
import {
  FaCalendarAlt,
  FaEye,
  FaSave,
  FaTimes,
  FaBuilding,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

const BookingsManagement = () => {
  const [selectedProperty, setSelectedProperty] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for properties
  const propertiesData = [
    {
      id: 1,
      name: "Villa Sài Gòn",
      type: "Villa",
      location: "TP. Hồ Chí Minh",
    },
    { id: 2, name: "Homestay Đà Lạt", type: "Homestay", location: "Đà Lạt" },
    { id: 3, name: "Resort Vũng Tàu", type: "Resort", location: "Vũng Tàu" },
    { id: 4, name: "Khách sạn Hà Nội", type: "Hotel", location: "Hà Nội" },
    {
      id: 5,
      name: "Căn hộ biển Nha Trang",
      type: "Apartment",
      location: "Nha Trang",
    },
  ];

  // Mock data for bookings with propertyId
  const allBookingsData = [
    {
      id: 1,
      propertyId: 1,
      propertyName: "Villa Sài Gòn",
      guestName: "Nguyễn Văn A",
      guestEmail: "nguyenvana@email.com",
      guestPhone: "0901234567",
      checkIn: "2024-01-15",
      checkOut: "2024-01-18",
      totalAmount: 2500000,
      status: "confirmed",
      bookingDate: "2024-01-10",
      roomType: "Phòng VIP",
      guests: 2,
    },
    {
      id: 2,
      propertyId: 2,
      propertyName: "Homestay Đà Lạt",
      guestName: "Trần Thị B",
      guestEmail: "tranthib@email.com",
      guestPhone: "0912345678",
      checkIn: "2024-01-20",
      checkOut: "2024-01-23",
      totalAmount: 1800000,
      status: "pending",
      bookingDate: "2024-01-12",
      roomType: "Phòng Standard",
      guests: 4,
    },
    {
      id: 3,
      propertyId: 3,
      propertyName: "Resort Vũng Tàu",
      guestName: "Lê Văn C",
      guestEmail: "levanc@email.com",
      guestPhone: "0923456789",
      checkIn: "2024-01-25",
      checkOut: "2024-01-28",
      totalAmount: 3200000,
      status: "completed",
      bookingDate: "2024-01-15",
      roomType: "Phòng Deluxe",
      guests: 2,
    },
    {
      id: 4,
      propertyId: 1,
      propertyName: "Villa Sài Gòn",
      guestName: "Phạm Thị D",
      guestEmail: "phamthid@email.com",
      guestPhone: "0934567890",
      checkIn: "2024-02-01",
      checkOut: "2024-02-03",
      totalAmount: 1500000,
      status: "cancelled",
      bookingDate: "2024-01-18",
      roomType: "Phòng Standard",
      guests: 3,
    },
    {
      id: 5,
      propertyId: 2,
      propertyName: "Homestay Đà Lạt",
      guestName: "Hoàng Văn E",
      guestEmail: "hoangvane@email.com",
      guestPhone: "0945678901",
      checkIn: "2024-02-05",
      checkOut: "2024-02-08",
      totalAmount: 2100000,
      status: "confirmed",
      bookingDate: "2024-01-20",
      roomType: "Phòng VIP",
      guests: 2,
    },
    {
      id: 6,
      propertyId: 4,
      propertyName: "Khách sạn Hà Nội",
      guestName: "Võ Thị F",
      guestEmail: "vothif@email.com",
      guestPhone: "0956789012",
      checkIn: "2024-02-10",
      checkOut: "2024-02-12",
      totalAmount: 1200000,
      status: "pending",
      bookingDate: "2024-02-01",
      roomType: "Phòng Standard",
      guests: 1,
    },
    {
      id: 7,
      propertyId: 5,
      propertyName: "Căn hộ biển Nha Trang",
      guestName: "Đặng Văn G",
      guestEmail: "dangvang@email.com",
      guestPhone: "0967890123",
      checkIn: "2024-02-15",
      checkOut: "2024-02-18",
      totalAmount: 2800000,
      status: "confirmed",
      bookingDate: "2024-02-05",
      roomType: "Studio",
      guests: 2,
    },
  ];

  // Filter bookings based on selected property and search term
  const filteredBookings = allBookingsData.filter((booking) => {
    const matchesProperty =
      selectedProperty === "" ||
      booking.propertyId === parseInt(selectedProperty);
    const matchesSearch =
      searchTerm === "" ||
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toString().includes(searchTerm);
    return matchesProperty && matchesSearch;
  });

  // Get current property statistics
  const getCurrentPropertyStats = () => {
    const currentBookings = selectedProperty
      ? allBookingsData.filter(
          (b) => b.propertyId === parseInt(selectedProperty),
        )
      : allBookingsData;

    return {
      total: currentBookings.length,
      confirmed: currentBookings.filter((b) => b.status === "confirmed").length,
      pending: currentBookings.filter((b) => b.status === "pending").length,
      completed: currentBookings.filter((b) => b.status === "completed").length,
      cancelled: currentBookings.filter((b) => b.status === "cancelled").length,
    };
  };

  const stats = getCurrentPropertyStats();

  // Helper functions for status
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý đặt phòng</h1>
        <p className="mt-2 text-gray-600">
          Theo dõi và quản lý các đặt phòng theo từng chỗ nghỉ
        </p>
      </div>

      {/* Property Selection and Search */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Property Selector */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <FaBuilding className="mr-2 inline" />
              Chọn chỗ nghỉ
            </label>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Tất cả chỗ nghỉ</option>
              {propertiesData.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name} - {property.type} ({property.location})
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <FaSearch className="mr-2 inline" />
              Tìm kiếm đặt phòng
            </label>
            <input
              type="text"
              placeholder="Tìm theo tên khách, email hoặc mã đặt phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Selected Property Info */}
        {selectedProperty && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center">
              <FaBuilding className="mr-2 text-blue-600" />
              <span className="font-medium text-blue-800">
                Đang xem đặt phòng của:{" "}
                {
                  propertiesData.find(
                    (p) => p.id === parseInt(selectedProperty),
                  )?.name
                }
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <FaCalendarAlt className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Tổng đặt phòng
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <FaCalendarAlt className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đã xác nhận</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.confirmed}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <FaCalendarAlt className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Chờ xác nhận</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <FaCalendarAlt className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Hoàn thành</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-3">
              <FaCalendarAlt className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đã hủy</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.cancelled}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Danh sách đặt phòng
              {selectedProperty && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredBookings.length} kết quả)
                </span>
              )}
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <FaFilter className="mr-1" />
              {filteredBookings.length} / {allBookingsData.length} đặt phòng
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Thông tin đặt phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Chi tiết
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.propertyName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Mã đặt phòng: #{booking.id}
                        </div>
                        <div className="text-xs text-gray-400">
                          Đặt ngày: {booking.bookingDate}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.guestName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.guestEmail}
                        </div>
                        <div className="text-xs text-gray-400">
                          {booking.guestPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Nhận: {booking.checkIn}</div>
                        <div>Trả: {booking.checkOut}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Loại phòng: {booking.roomType}</div>
                        <div>Số khách: {booking.guests} người</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.totalAmount.toLocaleString("vi-VN")}đ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${getStatusColor(booking.status)}`}
                      >
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          className="rounded p-1 text-blue-600 hover:bg-blue-100 hover:text-blue-900"
                          title="Xem chi tiết"
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
                        {booking.status === "pending" && (
                          <>
                            <button
                              className="rounded p-1 text-green-600 hover:bg-green-100 hover:text-green-900"
                              title="Xác nhận đặt phòng"
                            >
                              <FaSave className="h-4 w-4" />
                            </button>
                            <button
                              className="rounded p-1 text-red-600 hover:bg-red-100 hover:text-red-900"
                              title="Hủy đặt phòng"
                            >
                              <FaTimes className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <FaCalendarAlt className="mb-4 h-12 w-12 text-gray-300" />
                      <p className="mb-2 text-lg font-medium">
                        Không có đặt phòng nào
                      </p>
                      <p className="text-sm">
                        {selectedProperty
                          ? "Chỗ nghỉ này chưa có đặt phòng nào hoặc không khớp với từ khóa tìm kiếm"
                          : "Chưa có đặt phòng nào khớp với từ khóa tìm kiếm"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingsManagement;
