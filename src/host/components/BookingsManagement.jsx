import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaEye,
  FaSave,
  FaTimes,
  FaBuilding,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaExclamationTriangle,
  FaCheck,
} from "react-icons/fa";
import hostInstance from "../../configuration/hostAxiosCustomize";

const BookingsManagement = () => {
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [propertiesData, setPropertiesData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [metaData, setMetaData] = useState({
    page: 1,
    pageSize: 20,
    pages: 1,
    total: 0,
  });
  const [updateLoading, setUpdateLoading] = useState({});
  // Fetch properties for dropdown - lấy từ API giống PropertiesManagement
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Sử dụng API endpoint của PropertiesManagement
        const response = await hostInstance.get("/properties/host-properties");
        if (response.data && response.data.data) {
          // Chỉ lấy id và name từ properties
          const properties = response.data.data.map((property) => ({
            id: property.id,
            name: property.name || property.properties_name,
          }));
          setPropertiesData(properties);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        // Nếu không có properties, ít nhất người dùng vẫn có thể xem tất cả đặt phòng
      }
    };

    fetchProperties();
  }, []);

  // Fetch bookings data when selected property changes
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        const propertyId = selectedProperty || "all";
        const response = await hostInstance.get(
          `/properties/${propertyId}/bookings`,
        );

        if (response.data && response.data.data) {
          setBookingsData(response.data.data.data || []);
          setMetaData(
            response.data.data.meta || {
              page: 1,
              pageSize: 20,
              pages: 1,
              total: 0,
            },
          );
        } else {
          setBookingsData([]);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Có lỗi khi tải dữ liệu đặt phòng. Vui lòng thử lại sau.");
        setBookingsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [selectedProperty]);

  // Helper function to refresh bookings data
  const refreshBookingsData = async () => {
    try {
      const propertyId = selectedProperty || "all";
      const response = await hostInstance.get(
        `/properties/${propertyId}/bookings`,
      );
      if (response.data && response.data.data) {
        setBookingsData(response.data.data.data || []);
        setMetaData(
          response.data.data.meta || {
            page: 1,
            pageSize: 20,
            pages: 1,
            total: 0,
          },
        );
      }
    } catch (err) {
      console.error("Error refreshing bookings data:", err);
    }
  };

  // Function to update payment status
  const updatePaymentStatus = async (bookingId) => {
    setUpdateLoading((prev) => ({ ...prev, [bookingId]: true }));
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await hostInstance.patch(
        `/payments/bookings/${bookingId}`,
      );

      console.log("Payment API Response:", response.data); // Debug log

      if (
        response.data &&
        (response.data.code === 200 || response.status === 200)
      ) {
        // Simply refresh the data instead of trying to update state directly
        await refreshBookingsData();

        setSuccessMessage("Đã cập nhật trạng thái thanh toán thành công!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        console.error("Unexpected payment API response:", response.data);
        setError("Phản hồi API không như mong đợi. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Error updating payment status:", err);
      setError("Có lỗi khi cập nhật trạng thái thanh toán. Vui lòng thử lại.");
    } finally {
      setUpdateLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  // Function to update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    setUpdateLoading((prev) => ({ ...prev, [bookingId]: true }));
    setError(null);
    setSuccessMessage(null);
    try {
      let apiEndpoint;

      // Determine API endpoint based on status
      if (newStatus === "COMPLETE") {
        apiEndpoint = `/bookings/${bookingId}/complete`;
      } else if (newStatus === "CANCELLED") {
        apiEndpoint = `/bookings/${bookingId}/cancellation`;
      } else {
        // For other statuses (like CONFIRMED), use the original endpoint
        apiEndpoint = `/bookings/${bookingId}/status`;
      }

      let response;
      if (newStatus === "COMPLETE" || newStatus === "CANCELLED") {
        // For complete and cancellation, just call the endpoint without body
        response = await hostInstance.patch(apiEndpoint);
      } else {
        // For other statuses, send the status in body
        response = await hostInstance.patch(apiEndpoint, {
          status: newStatus,
        });
      }

      console.log("API Response:", response.data); // Debug log

      if (
        response.data &&
        (response.data.code === 200 || response.status === 200)
      ) {
        // Simply refresh the data instead of trying to update state directly
        await refreshBookingsData();

        setSuccessMessage(
          `Đã cập nhật trạng thái đặt phòng thành "${getStatusText(newStatus)}" thành công!`,
        );
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        console.error("Unexpected API response:", response.data);
        setError("Phản hồi API không như mong đợi. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
      setError("Có lỗi khi cập nhật trạng thái đặt phòng. Vui lòng thử lại.");
    } finally {
      setUpdateLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  // Filter bookings based on search term
  const filteredBookings = bookingsData.filter((booking) => {
    return (
      searchTerm === "" ||
      booking.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toString().includes(searchTerm)
    );
  });
  const getCurrentPropertyStats = () => {
    return {
      total: bookingsData.length,
      confirmed: bookingsData.filter((b) => b.status === "CONFIRMED").length,
      completed: bookingsData.filter((b) => b.status === "COMPLETE").length,
      cancelled: bookingsData.filter((b) => b.status === "CANCELLED").length,
    };
  };

  const stats = getCurrentPropertyStats();
  // Helper functions for status
  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "COMPLETE":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "Đã xác nhận";
      case "COMPLETE":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  // Format timestamp to date
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý đặt phòng</h1>
        <p className="mt-2 text-gray-600">
          Theo dõi và quản lý các đặt phòng theo từng chỗ nghỉ
        </p>
      </div>{" "}
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
              <option value="all">Tất cả chỗ nghỉ</option>
              {propertiesData.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
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
        {selectedProperty !== "all" && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center">
              <FaBuilding className="mr-2 text-blue-600" />
              <span className="font-medium text-blue-800">
                Đang xem đặt phòng của:{" "}
                {propertiesData.find((p) => p.id === selectedProperty)?.name ||
                  "Chỗ nghỉ đã chọn"}
              </span>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="mt-4 flex items-center justify-center text-blue-600">
            <FaSpinner className="mr-2 animate-spin" />
            <span>Đang tải dữ liệu...</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
            <div className="flex items-center">
              <FaCheck className="mr-2" />
              <span>{successMessage}</span>
            </div>
          </div>
        )}
      </div>{" "}
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
      </div>{" "}
      {/* Bookings Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Danh sách đặt phòng
              {!loading && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredBookings.length} kết quả)
                </span>
              )}
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <FaFilter className="mr-1" />
              {filteredBookings.length} / {metaData.total} đặt phòng
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
                  Chi tiết phòng
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
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <FaSpinner className="mx-auto h-8 w-8 animate-spin text-blue-500" />
                    <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.properties_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Mã đặt phòng: #{booking.id}
                        </div>
                        <div className="text-xs text-gray-400">
                          Đặt ngày: {formatDate(booking.created_at)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {booking.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Nhận: {booking.check_in}</div>
                        <div>Trả: {booking.check_out}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.accommodations &&
                          booking.accommodations.map((acc, index) => (
                            <div key={index}>
                              {acc.name}: {acc.quality} phòng
                            </div>
                          ))}
                        <div>Người lớn: {booking.adult_units}</div>
                        <div>Trẻ em: {booking.child_units}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.total_price.toLocaleString("vi-VN")}đ
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          booking.payment_status
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {booking.payment_status
                          ? "✓ Đã thanh toán"
                          : "⏳ Chưa thanh toán"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {booking.payment_method}
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

                        {/* Button cập nhật trạng thái thanh toán */}
                        {!booking.payment_status && (
                          <button
                            onClick={() => updatePaymentStatus(booking.id)}
                            disabled={updateLoading[booking.id]}
                            className="rounded p-1 text-green-600 hover:bg-green-100 hover:text-green-900 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Đánh dấu đã thanh toán"
                          >
                            {updateLoading[booking.id] ? (
                              <FaSpinner className="h-4 w-4 animate-spin" />
                            ) : (
                              <FaCheck className="h-4 w-4" />
                            )}
                          </button>
                        )}

                        {/* Button xác nhận */}
                        {booking.status !== "CONFIRMED" &&
                          booking.status !== "COMPLETE" &&
                          booking.status !== "CANCELLED" && (
                            <button
                              onClick={() =>
                                updateBookingStatus(booking.id, "CONFIRMED")
                              }
                              disabled={updateLoading[booking.id]}
                              className="rounded p-1 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-900 disabled:cursor-not-allowed disabled:opacity-50"
                              title="Xác nhận đặt phòng"
                            >
                              {updateLoading[booking.id] ? (
                                <FaSpinner className="h-4 w-4 animate-spin" />
                              ) : (
                                <FaSave className="h-4 w-4" />
                              )}
                            </button>
                          )}

                        {/* Button hoàn thành */}
                        {booking.status === "CONFIRMED" && (
                          <button
                            onClick={() =>
                              updateBookingStatus(booking.id, "COMPLETE")
                            }
                            disabled={updateLoading[booking.id]}
                            className="rounded p-1 text-blue-600 hover:bg-blue-100 hover:text-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Đánh dấu hoàn thành"
                          >
                            {updateLoading[booking.id] ? (
                              <FaSpinner className="h-4 w-4 animate-spin" />
                            ) : (
                              <FaCheck className="h-4 w-4" />
                            )}
                          </button>
                        )}

                        {/* Button hủy */}
                        {booking.status === "CONFIRMED" && (
                          <button
                            onClick={() =>
                              updateBookingStatus(booking.id, "CANCELLED")
                            }
                            disabled={updateLoading[booking.id]}
                            className="rounded p-1 text-red-600 hover:bg-red-100 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Hủy đặt phòng"
                          >
                            {updateLoading[booking.id] ? (
                              <FaSpinner className="h-4 w-4 animate-spin" />
                            ) : (
                              <FaTimes className="h-4 w-4" />
                            )}
                          </button>
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
                        {selectedProperty !== "all"
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

        {/* Pagination - có thể thêm sau nếu cần */}
      </div>
    </div>
  );
};

export default BookingsManagement;
