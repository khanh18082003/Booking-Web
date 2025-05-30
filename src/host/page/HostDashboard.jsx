import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hostAxios from "../../utils/hostAxiosCustomize";
import { useStore } from "../../utils/AuthProvider";
import { FaEdit, FaEye, FaTimes, FaSave } from "react-icons/fa";

const HostDashboard = () => {
  const navigate = useNavigate();
  const { store } = useStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho modal chỉnh sửa
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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

  // Mở modal chỉnh sửa khi click vào nút Edit
  const handleEditProperty = (e, propertyId) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan tỏa lên phần tử cha

    // Tìm property cần sửa
    const propertyToEdit = properties.find((p) => p.id === propertyId);
    if (propertyToEdit) {
      setEditingProperty({ ...propertyToEdit });
      setIsEditModalOpen(true);
    }
  };

  // Đóng modal chỉnh sửa
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProperty(null);
    setFormErrors({});
  };

  // Xử lý thay đổi trường input trong form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProperty((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Kiểm tra form có hợp lệ không
  const validateForm = () => {
    const errors = {};

    if (!editingProperty.name.trim()) {
      errors.name = "Tên không được để trống";
    }

    if (!editingProperty.address.trim()) {
      errors.address = "Địa chỉ không được để trống";
    }

    if (!editingProperty.description.trim()) {
      errors.description = "Mô tả không được để trống";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Lưu thông tin property đã sửa
  const handleSaveProperty = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);

      const response = await hostAxios.put(
        `/properties/${editingProperty.id}`,
        editingProperty,
      );

      if (response.data) {
        // Cập nhật lại danh sách properties
        setProperties((prev) =>
          prev.map((p) => (p.id === editingProperty.id ? editingProperty : p)),
        );

        // Đóng modal
        handleCloseEditModal();
        alert("Cập nhật thông tin chỗ nghỉ thành công!");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle trạng thái property
  const handleToggleStatus = async (e, propertyId) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan tỏa

    try {
      const propertyToUpdate = properties.find((p) => p.id === propertyId);
      if (!propertyToUpdate) return;

      const response = await hostAxios.put(`/properties/${propertyId}/status`, {
        status: !propertyToUpdate.status,
      });

      if (response.data) {
        // Cập nhật lại danh sách properties
        setProperties((prev) =>
          prev.map((p) =>
            p.id === propertyId ? { ...p, status: !p.status } : p,
          ),
        );
      }
    } catch (error) {
      console.error("Error toggling property status:", error);
      alert("Đã xảy ra lỗi khi cập nhật trạng thái. Vui lòng thử lại.");
    }
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
        <h1 className="text-3xl font-bold text-gray-800">Quản lý chỗ nghỉ</h1>
        <button
          onClick={handleAddProperty}
          className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          + Thêm chỗ nghỉ mới
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
                  {/* Overlay cho status - làm nó có thể click để toggle status */}
                  <div
                    className="absolute top-4 right-4 cursor-pointer"
                    onClick={(e) => handleToggleStatus(e, property.id)}
                  >
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium text-white ${
                        property.status
                          ? "bg-green-500 hover:bg-green-600"
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

      {/* Modal Chỉnh sửa Property */}
      {isEditModalOpen && editingProperty && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="bg-opacity-50 fixed inset-0 bg-black transition-opacity"
              onClick={handleCloseEditModal}
            ></div>

            {/* Modal content */}
            <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl sm:p-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  Chỉnh sửa chỗ nghỉ
                </h3>
                <button
                  className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
                  onClick={handleCloseEditModal}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mb-8 border-b border-gray-200 pb-1"></div>

              <div className="max-h-[70vh] overflow-y-auto pr-2">
                <form className="space-y-6">
                  {/* Tên chỗ nghỉ */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Tên chỗ nghỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editingProperty.name}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border ${formErrors.name ? "border-red-500" : "border-gray-300"} p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Địa chỉ */}
                  <div>
                    <label
                      htmlFor="address"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={editingProperty.address}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border ${formErrors.address ? "border-red-500" : "border-gray-300"} p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.address}
                      </p>
                    )}
                  </div>

                  {/* Thông tin địa chỉ chi tiết */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="ward"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Phường/Xã
                      </label>
                      <input
                        type="text"
                        id="ward"
                        name="ward"
                        value={editingProperty.ward || ""}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="district"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Quận/Huyện
                      </label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        value={editingProperty.district || ""}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="city"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Thành phố
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={editingProperty.city || ""}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="province"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Tỉnh
                      </label>
                      <input
                        type="text"
                        id="province"
                        name="province"
                        value={editingProperty.province || ""}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="country"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Quốc gia
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={editingProperty.country || ""}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Mô tả */}
                  <div>
                    <label
                      htmlFor="description"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Mô tả <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="4"
                      value={editingProperty.description}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border ${formErrors.description ? "border-red-500" : "border-gray-300"} p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                    ></textarea>
                    {formErrors.description && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.description}
                      </p>
                    )}
                  </div>

                  {/* Trạng thái */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="status"
                      name="status"
                      checked={editingProperty.status}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="status"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Đang hoạt động
                    </label>
                  </div>

                  {/* Hình ảnh hiện tại */}
                  {editingProperty.image && (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Ảnh hiện tại
                      </label>
                      <div className="mt-1 flex justify-center">
                        <img
                          src={editingProperty.image}
                          alt={editingProperty.name}
                          className="h-40 w-auto rounded-md object-cover"
                        />
                      </div>
                    </div>
                  )}
                </form>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  onClick={handleCloseEditModal}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
                  onClick={handleSaveProperty}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="mr-2 h-4 w-4 animate-spin text-white"
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
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" /> Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostDashboard;
