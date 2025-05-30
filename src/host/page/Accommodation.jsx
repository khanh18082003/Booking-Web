import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import hostAxios from "../../utils/hostAxiosCustomize";
import { useStore } from "../../utils/AuthProvider";
import {
  FaAngleDown,
  FaAngleUp,
  FaChevronLeft,
  FaBed,
  FaUsers,
  FaRulerCombined,
} from "react-icons/fa";

const Accommodation = () => {
  const { id } = useParams();
  const { store } = useStore();
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [propertyName, setPropertyName] = useState("");

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setLoading(true);
        const response = await hostAxios.get(
          `/properties/${id}/host-accommodations`,
        );

        if (response.data && response.data.data) {
          setAccommodations(response.data.data);

          // Lấy tên property nếu có trong response
          if (response.data.property_name) {
            setPropertyName(response.data.property_name);
          } else {
            // Fetch property name từ API khác nếu cần
            try {
              const propertyResponse = await hostAxios.get(`/properties/${id}`);
              if (propertyResponse.data && propertyResponse.data.data) {
                setPropertyName(propertyResponse.data.data.name);
              }
            } catch (error) {
              console.warn("Không thể lấy tên property:", error);
            }
          }
        } else {
          setError("Không thể tải danh sách accommodation");
        }
      } catch (error) {
        console.error("Error fetching accommodations:", error);
        setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, [id]);

  // Hàm toggle mở/đóng chi tiết
  const toggleDetails = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="mr-4 rounded-full p-2 text-gray-600 hover:bg-gray-100"
          >
            <FaChevronLeft />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Danh sách loại phòng
            </h1>
            {propertyName && (
              <p className="mt-1 text-gray-600">{propertyName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      {accommodations.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-center">
          <p className="mb-4 text-lg text-gray-500">
            Chưa có loại phòng nào được thêm vào
          </p>
          <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700">
            Thêm loại phòng mới
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {accommodations.map((accommodation) => (
            <div
              key={accommodation.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              {/* Header phòng - luôn hiển thị */}
              <div
                className="flex cursor-pointer items-center justify-between bg-white p-4 hover:bg-gray-50"
                onClick={() => toggleDetails(accommodation.id)}
              >
                <div className="flex flex-1 flex-col">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {accommodation.name}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-gray-600">
                    <span className="mr-4 flex items-center">
                      <FaUsers className="mr-1 text-gray-400" />
                      {accommodation.capacity} người
                    </span>
                    {accommodation.size && (
                      <span className="flex items-center">
                        <FaRulerCombined className="mr-1 text-gray-400" />
                        {accommodation.size} m²
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="mr-4 text-lg font-bold text-blue-600">
                    {formatPrice(accommodation.basePrice)}
                  </span>
                  {expandedId === accommodation.id ? (
                    <FaAngleUp className="text-gray-500" />
                  ) : (
                    <FaAngleDown className="text-gray-500" />
                  )}
                </div>
              </div>

              {/* Chi tiết phòng - chỉ hiển thị khi expanded */}
              {expandedId === accommodation.id && (
                <div className="border-t border-gray-200 p-4">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Thông tin chi tiết */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-1 font-medium text-gray-700">
                          Mô tả
                        </h4>
                        <p className="text-gray-600">
                          {accommodation.description || "Chưa có mô tả"}
                        </p>
                      </div>

                      <div>
                        <h4 className="mb-1 font-medium text-gray-700">
                          Sức chứa
                        </h4>
                        <div className="space-y-2">
                          <p className="flex items-center text-sm text-gray-600">
                            <FaUsers className="mr-2 text-gray-500" />
                            Tối đa {accommodation.capacity} người
                          </p>
                          {accommodation.rooms &&
                            accommodation.rooms.map((room, index) => (
                              <div
                                key={index}
                                className="rounded-md bg-gray-50 p-2"
                              >
                                <p className="mb-1 text-sm font-medium">
                                  {room.room_name}
                                </p>
                                {room.beds &&
                                  room.beds.map((bed, bedIndex) => (
                                    <p
                                      key={bedIndex}
                                      className="flex items-center text-sm text-gray-600"
                                    >
                                      <FaBed className="mr-2 text-gray-500" />
                                      {bed.quantity} x {bed.bed_type_name}
                                    </p>
                                  ))}
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="mb-1 font-medium text-gray-700">
                            Số phòng
                          </h4>
                          <p className="text-gray-600">
                            {accommodation.totalRooms || 0}
                          </p>
                        </div>
                        <div>
                          <h4 className="mb-1 font-medium text-gray-700">
                            Số đơn vị
                          </h4>
                          <p className="text-gray-600">
                            {accommodation.totalUnits || 0}
                          </p>
                        </div>
                        <div>
                          <h4 className="mb-1 font-medium text-gray-700">
                            Diện tích
                          </h4>
                          <p className="text-gray-600">
                            {accommodation.size}{" "}
                            {accommodation.unit === "square"
                              ? "m²"
                              : accommodation.unit}
                          </p>
                        </div>
                        <div>
                          <h4 className="mb-1 font-medium text-gray-700">
                            Giá cơ bản
                          </h4>
                          <p className="font-semibold text-blue-600">
                            {formatPrice(accommodation.basePrice)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Hình ảnh */}
                    <div>
                      <h4 className="mb-2 font-medium text-gray-700">
                        Hình ảnh
                      </h4>
                      {accommodation.extra_images &&
                      accommodation.extra_images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {accommodation.extra_images.map((image, index) => (
                            <div
                              key={index}
                              className="aspect-video overflow-hidden rounded-md border border-gray-200"
                            >
                              <img
                                src={image}
                                alt={`${accommodation.name} - Ảnh ${index + 1}`}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/300x200?text=Image+Not+Found";
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                          <p className="text-sm text-gray-500">
                            Không có hình ảnh
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer với các nút hành động */}
                  <div className="mt-6 flex justify-end space-x-3 border-t border-gray-100 pt-4">
                    <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Chỉnh sửa
                    </button>
                    <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                      Quản lý đặt phòng
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Accommodation;
