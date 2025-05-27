import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hostAxios from "../../utils/hostAxiosCustomize";
import { useStore } from "../../utils/AuthProvider";

const HostDashboard = () => {
  const navigate = useNavigate();
  const { store } = useStore();
  const [hostData, setHostData] = useState({
    properties: [],
    bookings: {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    },
    revenue: {
      currentMonth: 0,
      lastMonth: 0,
      total: 0,
    },
    profile: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch host dashboard data
  useEffect(() => {
    const fetchHostData = async () => {
      try {
        const response = await hostAxios.get("/host/dashboard");

        if (response.data && response.data.code === "M000") {
          setHostData(response.data.data);
        } else {
          setError("Không thể tải dữ liệu dashboard");
        }
      } catch (error) {
        console.error("Error fetching host dashboard:", error);

        // Nếu lỗi 401, đã được xử lý tự động bởi interceptor trong hostAxiosCustomize
        if (error.response?.status !== 401) {
          setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHostData();
  }, []);

  const handleAddProperty = () => {
    navigate("/host/properties-type");
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/host/property/${propertyId}`);
  };

  if (loading && store.apiLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-700">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-8 rounded-lg bg-red-50 p-6 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-red-600">Lỗi</h2>
        <p className="text-red-700">{error}</p>
        <button
          className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Host</h1>
        <button
          onClick={handleAddProperty}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          + Thêm chỗ nghỉ mới
        </button>
      </div>

      {/* Thống kê tổng quan */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-blue-50 p-6 shadow-md">
          <h3 className="mb-2 text-lg font-medium text-blue-800">Chỗ nghỉ</h3>
          <p className="text-3xl font-bold text-blue-600">
            {hostData.properties.length || 0}
          </p>
        </div>
        <div className="rounded-xl bg-green-50 p-6 shadow-md">
          <h3 className="mb-2 text-lg font-medium text-green-800">
            Doanh thu tháng này
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(hostData.revenue?.currentMonth || 0)}
          </p>
        </div>
        <div className="rounded-xl bg-yellow-50 p-6 shadow-md">
          <h3 className="mb-2 text-lg font-medium text-yellow-800">
            Đơn đặt phòng đang chờ
          </h3>
          <p className="text-3xl font-bold text-yellow-600">
            {hostData.bookings?.pending || 0}
          </p>
        </div>
        <div className="rounded-xl bg-purple-50 p-6 shadow-md">
          <h3 className="mb-2 text-lg font-medium text-purple-800">
            Đơn đã xác nhận
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {hostData.bookings?.confirmed || 0}
          </p>
        </div>
      </div>

      {/* Danh sách chỗ nghỉ */}
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        Danh sách chỗ nghỉ
      </h2>

      {hostData.properties && hostData.properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hostData.properties.map((property) => (
            <div
              key={property.id}
              className="cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
              onClick={() => handleViewProperty(property.id)}
            >
              <img
                src={
                  property.image ||
                  "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={property.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  {property.name}
                </h3>
                <p className="mb-2 text-gray-600">
                  {property.address}, {property.city}
                </p>
                <div className="flex justify-between">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                    {property.type || "Chưa phân loại"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${property.status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {property.status ? "Hoạt động" : "Tạm dừng"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-gray-50">
          <p className="mb-4 text-gray-500">Bạn chưa có chỗ nghỉ nào</p>
          <button
            onClick={handleAddProperty}
            className="rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Thêm chỗ nghỉ
          </button>
        </div>
      )}
    </div>
  );
};

export default HostDashboard;
