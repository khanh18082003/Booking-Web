import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hostAxios from "../../configuration/hostAxiosCustomize";
import { useStore } from "../../utils/AuthProvider";
import { FaEdit, FaEye, FaTimes, FaSave } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import countries from "../../utils/countries";
import { PAGE_TITLES, setPageTitle } from "../../utils/pageTitle";

// Helper function để convert file thành base64
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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

  // States cho địa chỉ Việt Nam
  const [selectedCountry, setSelectedCountry] = useState("Vietnam");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // States cho ảnh
  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    setPageTitle(PAGE_TITLES.DASHBOARD_HOST);
  }, []);

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

  // Fetch amenities
  useEffect(() => {
    const fetchAmenities = async () => {
      if (!store.hostProfile) {
        return;
      }
      try {
        const res = await hostAxios.get("/amenities");
        if (res.data.code === "M000") {
          setAmenities(res.data.data.data); // data.data là mảng amenities
        }
      } catch (err) {
        setAmenities([]);
      }
    };
    fetchAmenities();
  }, [store.hostProfile]);

  // Fetch provinces when country is Vietnam
  useEffect(() => {
    if (selectedCountry === "Vietnam") {
      fetch("https://provinces.open-api.vn/api/")
        .then((res) => res.json())
        .then((data) => setProvinces(data))
        .catch(() => setProvinces([]));
    } else {
      setProvinces([]);
      setDistricts([]);
      setWards([]);
    }
  }, [selectedCountry]);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedCountry === "Vietnam" && selectedProvince) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((res) => res.json())
        .then((data) => setDistricts(data.districts || []))
        .catch(() => setDistricts([]));
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedCountry, selectedProvince]);

  // Fetch wards when district changes
  useEffect(() => {
    if (selectedCountry === "Vietnam" && selectedDistrict) {
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then((res) => res.json())
        .then((data) => setWards(data.wards || []))
        .catch(() => setWards([]));
    } else {
      setWards([]);
    }
  }, [selectedCountry, selectedDistrict]);

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
      // Khởi tạo các state cho địa chỉ
      setSelectedCountry(propertyToEdit.country || "Vietnam");

      // Set up property object with empty values for new fields if they don't exist
      const enhancedProperty = {
        ...propertyToEdit,
        extra_images: propertyToEdit.extra_images || [],
        amenities: propertyToEdit.amenities || [],
      };

      setEditingProperty(enhancedProperty);
      setIsEditModalOpen(true);

      // Nếu đã có dữ liệu địa điểm, cần tìm code tương ứng để hiển thị đúng
      if (propertyToEdit.country === "Vietnam") {
        // Chúng ta sẽ cập nhật selectedProvince, selectedDistrict, selectedWard sau khi có dữ liệu provinces
        setTimeout(() => {
          if (provinces.length > 0 && propertyToEdit.province) {
            const provinceObj = provinces.find(
              (p) => p.name === propertyToEdit.province,
            );
            if (provinceObj) {
              setSelectedProvince(String(provinceObj.code));

              // Tương tự với district và ward, cần đợi dữ liệu được load
              setTimeout(() => {
                if (districts.length > 0 && propertyToEdit.district) {
                  const districtObj = districts.find(
                    (d) => d.name === propertyToEdit.district,
                  );
                  if (districtObj) {
                    setSelectedDistrict(String(districtObj.code));

                    setTimeout(() => {
                      if (wards.length > 0 && propertyToEdit.ward) {
                        const wardObj = wards.find(
                          (w) => w.name === propertyToEdit.ward,
                        );
                        if (wardObj) {
                          setSelectedWard(String(wardObj.code));
                        }
                      }
                    }, 300);
                  }
                }
              }, 300);
            }
          }
        }, 300);
      }
    }
  };

  // Đóng modal chỉnh sửa
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProperty(null);
    setFormErrors({});
    setSelectedCountry("Vietnam");
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
  };

  // Xử lý thay đổi trường input trong form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProperty((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Khi chọn quốc gia
  const handleCountryChange = (e) => {
    const value = e.target.value;
    setSelectedCountry(value);
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setEditingProperty((p) => ({
      ...p,
      country: value,
      province: "",
      district: "",
      ward: "",
    }));
  };

  // Khi chọn tỉnh/thành
  const handleProvinceChange = (e) => {
    const value = e.target.value;
    setSelectedProvince(value);
    setSelectedDistrict("");
    setSelectedWard("");
    setEditingProperty((p) => ({
      ...p,
      province: value,
      district: "",
      ward: "",
    }));
  };

  // Khi chọn quận/huyện
  const handleDistrictChange = (e) => {
    const value = e.target.value;
    setSelectedDistrict(value);
    setSelectedWard("");
    setEditingProperty((p) => ({ ...p, district: value, ward: "" }));
  };

  // Khi chọn phường/xã
  const handleWardChange = (e) => {
    const value = e.target.value;
    setSelectedWard(value);
    setEditingProperty((p) => ({ ...p, ward: value }));
  };

  // Chọn tiện nghi
  const handleAmenityChange = (id) => {
    setEditingProperty((prev) => {
      const amenities_id = prev.amenities || [];
      const exists = amenities_id.includes(id);
      return {
        ...prev,
        amenities: exists
          ? amenities_id.filter((a) => a !== id)
          : [...amenities_id, id],
      };
    });
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

    if (selectedCountry === "Vietnam") {
      if (!selectedProvince) {
        errors.province = "Vui lòng chọn tỉnh/thành phố";
      }
      if (!selectedDistrict) {
        errors.district = "Vui lòng chọn quận/huyện";
      }
      if (!selectedWard) {
        errors.ward = "Vui lòng chọn phường/xã";
      }
    } else {
      if (!editingProperty.province) {
        errors.province = "Vui lòng nhập tỉnh/thành phố";
      }
      if (!editingProperty.district) {
        errors.district = "Vui lòng nhập quận/huyện";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Lưu thông tin property đã sửa
  const handleSaveProperty = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      const formData = new FormData();

      // Lấy tên province, district, ward từ code nếu là Vietnam
      let provinceName = editingProperty.province;
      let districtName = editingProperty.district;
      let wardName = editingProperty.ward;
      let cityName = editingProperty.city || "";

      if (selectedCountry === "Vietnam") {
        const foundProvince = provinces.find(
          (p) => String(p.code) === String(selectedProvince),
        );
        provinceName = foundProvince
          ? foundProvince.name
          : editingProperty.province;

        // Nếu là thành phố trực thuộc trung ương thì city = province
        cityName =
          foundProvince && foundProvince.name.includes("Thành phố")
            ? foundProvince.name
            : "";

        const foundDistrict = districts.find(
          (d) => String(d.code) === String(selectedDistrict),
        );
        districtName = foundDistrict
          ? foundDistrict.name
          : editingProperty.district;

        const foundWard = wards.find(
          (w) => String(w.code) === String(selectedWard),
        );
        wardName = foundWard ? foundWard.name : editingProperty.ward;
      }

      // Tạo object request
      const requestObj = {
        name: editingProperty.name,
        description: editingProperty.description,
        address: editingProperty.address,
        ward: wardName,
        district: districtName,
        city: cityName,
        province: provinceName,
        country: selectedCountry,
        status: editingProperty.status,
        check_in_time: editingProperty.check_in_time,
        check_out_time: editingProperty.check_out_time,
        amenities_id: editingProperty.amenities || [],
        extra_images: editingProperty.extra_images || [],
      };

      console.log("Request object:", requestObj);

      formData.append(
        "request",
        new Blob([JSON.stringify(requestObj)], { type: "application/json" }),
      );
      console.log("Main image base64:", editingProperty.image);
      // Thêm file ảnh đại diện
      if (editingProperty.imageFile) {
        formData.append("image", editingProperty.imageFile);
        console.log("Adding main image file:", editingProperty.imageFile);
        console.log("Main image base64:", editingProperty.image);
      }

      // Thêm các file ảnh bổ sung

      if (
        editingProperty.extraImageFiles &&
        editingProperty.extraImageFiles.length > 0
      ) {
        for (let file of editingProperty.extraImageFiles) {
          formData.append("extra_image", file);
          console.log("Adding extra image file:", file);
          console.log("Extra image base64:", editingProperty.extra_images);
        }
      }

      const response = await hostAxios.put(
        `/properties/${editingProperty.id}`,
        formData,
      );

      if (response.data) {
        // Cập nhật lại danh sách properties
        const updatedProperty = response.data.data || editingProperty;
        console.log("Updated property:", updatedProperty);
        setProperties((prev) =>
          prev.map((p) => (p.id === editingProperty.id ? updatedProperty : p)),
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
                  {/* Overlay cho status - làm nó có thể click để toggle status */}
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

      {/* Modal Chỉnh sửa Property */}
      {isEditModalOpen && editingProperty && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 cursor-pointer bg-black/50 transition-opacity"
              onClick={handleCloseEditModal}
            ></div>

            {/* Modal content */}
            <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl sm:p-8">
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
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Quốc gia */}
                    <div>
                      <label
                        htmlFor="country"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Quốc gia <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        required
                      >
                        {countries.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tỉnh/Thành */}
                    <div>
                      <label
                        htmlFor="province"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Tỉnh/Thành <span className="text-red-500">*</span>
                      </label>
                      {selectedCountry === "Vietnam" ? (
                        <select
                          className={`block w-full rounded-md border ${formErrors.province ? "border-red-500" : "border-gray-300"} p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                          value={selectedProvince}
                          onChange={handleProvinceChange}
                          required
                        >
                          <option value="">Chọn tỉnh/thành</option>
                          {provinces.map((p) => (
                            <option key={p.code} value={p.code}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="province"
                          value={editingProperty.province || ""}
                          onChange={handleInputChange}
                          className={`block w-full rounded-md border ${formErrors.province ? "border-red-500" : "border-gray-300"} p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                          placeholder="Nhập tỉnh/thành"
                        />
                      )}
                      {formErrors.province && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.province}
                        </p>
                      )}
                    </div>

                    {/* Quận/Huyện */}
                    <div>
                      <label
                        htmlFor="district"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Quận/Huyện <span className="text-red-500">*</span>
                      </label>
                      {selectedCountry === "Vietnam" ? (
                        <select
                          className={`block w-full rounded-md border ${formErrors.district ? "border-red-500" : "border-gray-300"} p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                          value={selectedDistrict}
                          onChange={handleDistrictChange}
                          required
                          disabled={!selectedProvince}
                        >
                          <option value="">Chọn quận/huyện</option>
                          {districts.map((d) => (
                            <option key={d.code} value={d.code}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="district"
                          value={editingProperty.district || ""}
                          onChange={handleInputChange}
                          className={`block w-full rounded-md border ${formErrors.district ? "border-red-500" : "border-gray-300"} p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                          placeholder="Nhập quận/huyện"
                        />
                      )}
                      {formErrors.district && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.district}
                        </p>
                      )}
                    </div>

                    {/* Phường/Xã */}
                    <div>
                      <label
                        htmlFor="ward"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Phường/Xã
                        {selectedCountry === "Vietnam" && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      {selectedCountry === "Vietnam" ? (
                        <select
                          className={`block w-full rounded-md border ${formErrors.ward ? "border-red-500" : "border-gray-300"} p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                          value={selectedWard}
                          onChange={handleWardChange}
                          required={selectedCountry === "Vietnam"}
                          disabled={!selectedDistrict}
                        >
                          <option value="">Chọn phường/xã</option>
                          {wards.map((w) => (
                            <option key={w.code} value={w.code}>
                              {w.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="ward"
                          value={editingProperty.ward || ""}
                          onChange={handleInputChange}
                          className={`block w-full rounded-md border ${formErrors.ward ? "border-red-500" : "border-gray-300"} p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                          placeholder="Nhập phường/xã"
                        />
                      )}
                      {formErrors.ward && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.ward}
                        </p>
                      )}
                    </div>

                    {/* Địa chỉ (số nhà, tên đường...) */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="address"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Địa chỉ (số nhà, tên đường...){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={editingProperty.address || ""}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md border ${formErrors.address ? "border-red-500" : "border-gray-300"} p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Giờ nhận - trả phòng */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="check_in_time"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Giờ nhận phòng
                      </label>
                      <input
                        type="time"
                        id="check_in_time"
                        name="check_in_time"
                        value={editingProperty.check_in_time || "14:00"}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="check_out_time"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Giờ trả phòng
                      </label>
                      <input
                        type="time"
                        id="check_out_time"
                        name="check_out_time"
                        value={editingProperty.check_out_time || "12:00"}
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
                    <ReactQuill
                      theme="snow"
                      value={editingProperty.description}
                      onChange={(value) =>
                        setEditingProperty((prev) => ({
                          ...prev,
                          description: value,
                        }))
                      }
                      style={{ background: "white" }}
                    />
                    {formErrors.description && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.description}
                      </p>
                    )}
                  </div>

                  {/* Tiện nghi */}
                  {amenities.length > 0 && (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Tiện nghi
                      </label>
                      <div className="flex flex-wrap gap-4">
                        {amenities.map((a) => (
                          <label key={a.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={editingProperty.amenities?.includes(
                                a.id,
                              )}
                              onChange={() => handleAmenityChange(a.id)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span
                              dangerouslySetInnerHTML={{ __html: a.icon }}
                            />
                            {a.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ảnh đại diện */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Ảnh đại diện
                    </label>
                    <div className="mt-1 flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        {editingProperty.image && (
                          <img
                            src={editingProperty.image}
                            alt="Ảnh đại diện"
                            className="h-24 w-24 rounded-md object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-400 bg-blue-50 px-6 py-4 transition hover:bg-blue-100">
                          <svg
                            className="mb-2 h-6 w-6 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          <span className="text-sm text-blue-700">
                            Thay đổi ảnh đại diện
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const base64 = await getBase64(file);
                                setEditingProperty((p) => ({
                                  ...p,
                                  image: base64,
                                  imageFile: file,
                                }));
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Ảnh bổ sung */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Ảnh bổ sung (có thể chọn nhiều ảnh)
                    </label>
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-400 bg-blue-50 px-6 py-4 transition hover:bg-blue-100">
                      <svg
                        className="mb-2 h-8 w-8 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="text-sm text-blue-700">
                        Chọn ảnh bổ sung
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={async (e) => {
                          const files = Array.from(e.target.files);
                          const base64Arr = await Promise.all(
                            files.map(getBase64),
                          );
                          setEditingProperty((p) => ({
                            ...p,
                            extra_images: [
                              ...(p.extra_images || []),
                              ...base64Arr,
                            ],
                            extraImageFiles: [
                              ...(p.extraImageFiles || []),
                              ...files,
                            ], // Lưu file gốc để gửi lên server
                          }));
                        }}
                      />
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {editingProperty.extra_images &&
                        editingProperty.extra_images.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={img}
                              alt={`extra-${idx}`}
                              className="h-24 w-24 rounded-lg object-cover shadow"
                            />
                            <button
                              type="button"
                              className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow-md hover:bg-red-600"
                              onClick={() => {
                                setEditingProperty((prev) => ({
                                  ...prev,
                                  extra_images: prev.extra_images.filter(
                                    (_, i) => i !== idx,
                                  ),
                                  extraImageFiles: prev.extraImageFiles?.filter(
                                    (_, i) => i !== idx,
                                  ),
                                }));
                              }}
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}
                    </div>
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
