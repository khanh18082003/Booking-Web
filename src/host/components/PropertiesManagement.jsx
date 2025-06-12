import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hostAxios from "../../configuration/hostAxiosCustomize";
import { useStore } from "../../utils/AuthProvider";
import { FaEye, FaEdit, FaTimes, FaSave } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import countries from "../../utils/countries";

// Helper function to convert file to base64
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const PropertiesManagement = () => {
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

  // States cho tiện nghi
  const [amenities, setAmenities] = useState([]);

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
          console.log("Fetched properties:", response.data.data);
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
          setAmenities(res.data.data.data);
        }
      } catch (error) {
        console.error("Error fetching amenities:", error);
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

  // Handle edit property - open edit modal
  const handleEditProperty = async (e, propertyId) => {
    e.stopPropagation();

    // Find property to edit
    const propertyToEdit = properties.find((p) => p.id === propertyId);
    console.log("Editing Property:", propertyToEdit);

    if (propertyToEdit) {
      // Set up property object with empty values for new fields if they don't exist
      const enhancedProperty = {
        ...propertyToEdit,
        extra_images: propertyToEdit.extra_images || [],
        amenities: propertyToEdit.amenities || [],
      };

      setEditingProperty(enhancedProperty);
      setSelectedCountry(propertyToEdit.country || "Vietnam");
      setIsEditModalOpen(true);

      // If it's Vietnam, fetch and set up the location dropdowns
      if (propertyToEdit.country === "Vietnam") {
        try {
          // First, ensure provinces are loaded
          let currentProvinces = provinces;
          if (currentProvinces.length === 0) {
            const provincesResponse = await fetch(
              "https://provinces.open-api.vn/api/",
            );
            currentProvinces = await provincesResponse.json();
            setProvinces(currentProvinces);
          }

          // Find and set province
          if (currentProvinces.length > 0 && propertyToEdit.province) {
            const provinceObj = currentProvinces.find(
              (p) => p.name === propertyToEdit.province,
            );
            console.log("Province Object:", provinceObj);

            if (provinceObj) {
              setSelectedProvince(String(provinceObj.code));

              // Fetch districts for this province
              try {
                const districtsResponse = await fetch(
                  `https://provinces.open-api.vn/api/p/${provinceObj.code}?depth=2`,
                );
                const provinceData = await districtsResponse.json();
                const fetchedDistricts = provinceData.districts || [];
                setDistricts(fetchedDistricts);
                console.log("Fetched Districts:", fetchedDistricts);

                // Find and set district
                if (fetchedDistricts.length > 0 && propertyToEdit.district) {
                  const districtObj = fetchedDistricts.find(
                    (d) => d.name === propertyToEdit.district,
                  );
                  console.log("District Object:", districtObj);

                  if (districtObj) {
                    setSelectedDistrict(String(districtObj.code));

                    // Fetch wards for this district
                    try {
                      const wardsResponse = await fetch(
                        `https://provinces.open-api.vn/api/d/${districtObj.code}?depth=2`,
                      );
                      const districtData = await wardsResponse.json();
                      const fetchedWards = districtData.wards || [];
                      setWards(fetchedWards);
                      console.log("Fetched Wards:", fetchedWards);

                      // Find and set ward
                      if (fetchedWards.length > 0 && propertyToEdit.ward) {
                        const wardObj = fetchedWards.find(
                          (w) => w.name === propertyToEdit.ward,
                        );
                        console.log("Ward Object:", wardObj);

                        if (wardObj) {
                          setSelectedWard(String(wardObj.code));
                        }
                      }
                    } catch (error) {
                      console.error("Error fetching wards:", error);
                    }
                  }
                }
              } catch (error) {
                console.error("Error fetching districts:", error);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching provinces:", error);
        }
      }
    }
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProperty(null);
    setFormErrors({});
    setSelectedCountry("Vietnam");
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
  };

  // Handle input changes in form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProperty((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle country change
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

  // Handle province change
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

  // Handle district change
  const handleDistrictChange = (e) => {
    const value = e.target.value;
    setSelectedDistrict(value);
    setSelectedWard("");
    setEditingProperty((p) => ({ ...p, district: value, ward: "" }));
  };

  // Handle ward change
  const handleWardChange = (e) => {
    const value = e.target.value;
    setSelectedWard(value);
    setEditingProperty((p) => ({ ...p, ward: value }));
  };

  // Handle amenity selection
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

  // Validate form
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

    // Scroll to first error field if there are any errors
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      setTimeout(() => {
        const element = document.querySelector(
          `[name="${firstErrorField}"], .${firstErrorField}-field`,
        );
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
          // Focus on the field if it's an input
          if (
            element.tagName === "INPUT" ||
            element.tagName === "SELECT" ||
            element.tagName === "TEXTAREA"
          ) {
            element.focus();
          }
        }
      }, 100);
    }

    return Object.keys(errors).length === 0;
  };

  // Save property changes
  const handleSaveProperty = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      const formData = new FormData();

      // Get location names from codes if Vietnam
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

        const foundDistrict = districts.find(
          (d) => String(d.code) === String(selectedDistrict),
        );
        districtName = foundDistrict
          ? foundDistrict.name
          : editingProperty.district;

        cityName =
          foundProvince && foundProvince.name.includes("Thành phố")
            ? foundProvince.name
            : foundDistrict && foundDistrict.name.includes("Thành phố")
              ? foundDistrict.name
              : "";

        const foundWard = wards.find(
          (w) => String(w.code) === String(selectedWard),
        );
        wardName = foundWard ? foundWard.name : editingProperty.ward;
      }

      // Create request object
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

      formData.append(
        "request",
        new Blob([JSON.stringify(requestObj)], { type: "application/json" }),
      );

      // Add main image file if exists
      if (editingProperty.imageFile) {
        formData.append("image", editingProperty.imageFile);
      }

      // Add extra image files if exist
      if (
        editingProperty.extraImageFiles &&
        editingProperty.extraImageFiles.length > 0
      ) {
        for (let file of editingProperty.extraImageFiles) {
          formData.append("extra_image", file);
        }
      }

      const response = await hostAxios.put(
        `/properties/${editingProperty.id}`,
        formData,
      );

      if (response.data) {
        // Close modal and show success message
        handleCloseEditModal();
        alert("Cập nhật thông tin chỗ nghỉ thành công!");

        // Refresh properties list
        const refreshResponse = await hostAxios.get(
          "/properties/host-properties",
        );
        if (refreshResponse.data) {
          setProperties(refreshResponse.data.data || []);
        }
      }
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
    }
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
                    {property.district}, {property.province}
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

      {/* Edit Property Modal */}
      {isEditModalOpen && editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Chỉnh sửa chỗ nghỉ
              </h3>
              <button
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
                onClick={handleCloseEditModal}
                disabled={isSaving}
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <form className="space-y-6">
                {/* Property Name */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tên chỗ nghỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editingProperty.name || ""}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md border ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    } p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Address Fields */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Country */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Quốc gia <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={selectedCountry}
                      onChange={handleCountryChange}
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Province */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Tỉnh/Thành <span className="text-red-500">*</span>
                    </label>
                    {selectedCountry === "Vietnam" ? (
                      <select
                        name="province"
                        className={`province-field block w-full rounded-md border ${
                          formErrors.province
                            ? "border-red-500"
                            : "border-gray-300"
                        } p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                        value={selectedProvince}
                        onChange={handleProvinceChange}
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
                        className={`block w-full rounded-md border ${
                          formErrors.province
                            ? "border-red-500"
                            : "border-gray-300"
                        } p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                        placeholder="Nhập tỉnh/thành"
                      />
                    )}
                    {formErrors.province && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.province}
                      </p>
                    )}
                  </div>

                  {/* District */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </label>
                    {selectedCountry === "Vietnam" ? (
                      <select
                        name="district"
                        className={`district-field block w-full rounded-md border ${
                          formErrors.district
                            ? "border-red-500"
                            : "border-gray-300"
                        } p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
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
                        className={`block w-full rounded-md border ${
                          formErrors.district
                            ? "border-red-500"
                            : "border-gray-300"
                        } p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                        placeholder="Nhập quận/huyện"
                      />
                    )}
                    {formErrors.district && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.district}
                      </p>
                    )}
                  </div>

                  {/* Ward */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Phường/Xã
                      {selectedCountry === "Vietnam" && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    {selectedCountry === "Vietnam" ? (
                      <select
                        name="ward"
                        className={`ward-field block w-full rounded-md border ${
                          formErrors.ward ? "border-red-500" : "border-gray-300"
                        } p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                        value={selectedWard}
                        onChange={handleWardChange}
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
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Nhập phường/xã"
                      />
                    )}
                    {formErrors.ward && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.ward}
                      </p>
                    )}
                  </div>

                  {/* Street Address */}
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Địa chỉ (số nhà, tên đường...){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={editingProperty.address || ""}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border ${
                        formErrors.address
                          ? "border-red-500"
                          : "border-gray-300"
                      } p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Mô tả <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`description-field ${formErrors.description ? "border-red-500" : ""}`}
                  >
                    <ReactQuill
                      value={editingProperty.description || ""}
                      onChange={(value) =>
                        setEditingProperty((prev) => ({
                          ...prev,
                          description: value,
                        }))
                      }
                    />
                  </div>
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.description}
                    </p>
                  )}
                </div>

                {/* Check-in/Check-out Times */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Giờ nhận phòng
                    </label>
                    <input
                      type="time"
                      name="check_in_time"
                      value={editingProperty.check_in_time || ""}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Giờ trả phòng
                    </label>
                    <input
                      type="time"
                      name="check_out_time"
                      value={editingProperty.check_out_time || ""}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Tiện nghi
                  </label>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {amenities.map((amenity) => (
                      <label
                        key={amenity.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={(editingProperty.amenities || []).includes(
                            amenity.id,
                          )}
                          onChange={() => handleAmenityChange(amenity.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {amenity.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Main Image Upload */}
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

                {/* Extra Images Upload */}
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
                          ],
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

                {/* Status */}
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

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 border-t border-gray-200 bg-gray-50 p-6">
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSaving}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveProperty}
                disabled={isSaving}
                className="relative flex items-center rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-75"
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 h-4 w-4" />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesManagement;
