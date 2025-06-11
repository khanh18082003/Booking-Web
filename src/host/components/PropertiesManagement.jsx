import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import hostAxios from "../../configuration/hostAxiosCustomize";
import { useStore } from "../../utils/AuthProvider";
import { FaEye, FaEdit } from "react-icons/fa";
import { GoPlus } from "react-icons/go";

const PropertiesManagement = ({ onEditProperty }) => {
  const navigate = useNavigate();
  const { store } = useStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!store.hostProfile) {
        return;
      }
      try {
        setLoading(true);
        const response = await hostAxios.get("/properties/host-properties");

        if (response.data) {
          setProperties(response.data.data || []);
        } else {
          setError("Không thể tải danh sách chỗ nghỉ");
        }
      } catch (error) {
        console.error("Error fetching properties:", error);

        if (error.response?.status !== 401) {
          setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [store.hostProfile]);

  const handleAddProperty = () => {
    navigate("/host/properties-type");
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/host/property/${propertyId}`);
  };

  const handleEditProperty = (e, propertyId) => {
    e.stopPropagation();
    onEditProperty(e, propertyId);
  };
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Đang tải danh sách chỗ nghỉ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="text-6xl">⚠️</div>
          <h2 className="mb-2 text-xl font-bold text-gray-800">
            Đã xảy ra lỗi
          </h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition duration-200 hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý chỗ nghỉ</h1>
        <button
          onClick={handleAddProperty}
          className="flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          <span>
            <GoPlus size={20} />
          </span>
          <span>Thêm chỗ nghỉ mới</span>
        </button>
      </div>

      {/* Danh sách chỗ nghỉ */}
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Danh sách chỗ nghỉ của bạn
      </h2>

      {properties.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
          <p className="mb-4 text-lg text-gray-500">Bạn chưa có chỗ nghỉ nào</p>
          <button
            onClick={handleAddProperty}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow transition hover:bg-blue-700"
          >
            Thêm chỗ nghỉ đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div
                className="relative cursor-pointer"
                onClick={() => handleViewProperty(property.id)}
              >
                {/* Ảnh property */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      property.image ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={property.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {/* Overlay cho status */}
                  <div className="absolute top-4 right-4 cursor-pointer">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium text-white duration-200 ${
                        property.status
                          ? "bg-secondary hover:bg-primary"
                          : "bg-gray-500 hover:bg-gray-600"
                      }`}
                    >
                      {property.status ? "Hoạt động" : "Tạm dừng"}
                    </span>
                  </div>
                </div>

                {/* Thông tin property */}
                <div className="p-4">
                  <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-gray-800">
                    {property.name}
                  </h3>
                  <p className="mb-3 line-clamp-1 text-sm text-gray-600">
                    {property.address}
                  </p>
                  <p className="text-sm text-gray-500">
                    {property.district}, {property.city}
                  </p>
                </div>

                {/* Các nút hành động */}
                <div className="flex items-center justify-between border-t border-gray-100 p-4">
                  <div className="flex items-center">
                    {property.rating > 0 ? (
                      <div className="flex items-center">
                        <span className="mr-1 text-sm font-medium text-gray-700">
                          {property.rating.toFixed(1)}
                        </span>
                        <svg
                          className="h-4 w-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.585l-6.327 3.322a1 1 0 01-1.45-1.054l1.208-7.04-5.118-4.987a1 1 0 01.555-1.705l7.073-1.027L9.95.435a1 1 0 011.1 0l3.008 6.092 7.073 1.027a1 1 0 01.555 1.705l-5.118 4.987 1.208 7.04a1 1 0 01-1.45 1.054L10 15.585z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Chưa có đánh giá
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="rounded-full p-2 text-blue-600 transition hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProperty(property.id);
                      }}
                      title="Xem chi tiết"
                    >
                      <FaEye className="text-lg" />
                    </button>
                    <button
                      className="rounded-full p-2 text-yellow-600 transition hover:bg-yellow-50"
                      onClick={(e) => handleEditProperty(e, property.id)}
                      title="Chỉnh sửa"
                    >
                      <FaEdit className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

PropertiesManagement.propTypes = {
  onEditProperty: PropTypes.func,
};

export default PropertiesManagement;
