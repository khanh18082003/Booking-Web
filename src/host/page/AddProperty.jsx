import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import hostAxios from "../../utils/hostAxiosCustomize";
import axios from "axios";
import countries from "../../utils/countries";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const PROPERTY_TYPE_MAP = {
  villa: {
    type_id: 1,
    name: "",
    image: "",
    description: "",
    extra_images: [],
  },
  hotel: {
    type_id: 2,
    name: "",
    image: "",
    description: "",
    extra_images: [],
  },
  apartment: {
    type_id: 1,
    name: "",
    image: "",
    description: "",
    extra_images: [],
  },
};

const DEFAULT_ADDRESS = {
  address: "",
  ward: "",
  district: "",
  city: "",
  province: "",
  country: "",
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AddProperty = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Lấy type từ query param
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type") || "villa";

  // State property
  const [property, setProperty] = useState({
    ...PROPERTY_TYPE_MAP[type],
    ...DEFAULT_ADDRESS,
    status: true,
    check_in_time: "14:00",
    check_out_time: "12:00",
    amenities_id: [],
  });

  // State amenities
  const [amenities, setAmenities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("Vietnam");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    // Fetch amenities từ API thật
    const fetchAmenities = async () => {
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
  }, []);

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

  // Khi đổi loại property
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setProperty((prev) => ({
      ...prev,
      ...PROPERTY_TYPE_MAP[newType],
      amenities_id: [],
    }));
    // Cập nhật url query param
    navigate(`/host/add-property?type=${newType}`, { replace: true });
  };

  // Chọn tiện nghi
  const handleAmenityChange = (id) => {
    setProperty((prev) => {
      const exists = prev.amenities_id.includes(id);
      return {
        ...prev,
        amenities_id: exists
          ? prev.amenities_id.filter((a) => a !== id)
          : [...prev.amenities_id, id],
      };
    });
  };

  // Khi chọn quốc gia
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setProperty((p) => ({
      ...p,
      country: e.target.value,
      province: "",
      district: "",
      ward: "",
    }));
  };
  // Khi chọn tỉnh/thành
  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict("");
    setSelectedWard("");
    setProperty((p) => ({
      ...p,
      province: e.target.value,
      district: "",
      ward: "",
    }));
  };
  // Khi chọn quận/huyện
  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedWard("");
    setProperty((p) => ({ ...p, district: e.target.value, ward: "" }));
  };
  // Khi chọn phường/xã
  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
    setProperty((p) => ({ ...p, ward: e.target.value }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Lấy tên province, district, ward từ code
    let provinceName = property.province;
    let districtName = property.district;
    let wardName = property.ward;
    let cityName = property.city;

    if (selectedCountry === "Vietnam") {
      const foundProvince = provinces.find(
        (p) => String(p.code) === String(selectedProvince),
      );
      provinceName = foundProvince ? foundProvince.name : property.province;
      // Nếu là thành phố trực thuộc trung ương thì city = province
      cityName =
        foundProvince && foundProvince.name.includes("Thành phố")
          ? foundProvince.name
          : "";
      const foundDistrict = districts.find(
        (d) => String(d.code) === String(selectedDistrict),
      );
      districtName = foundDistrict ? foundDistrict.name : property.district;
      const foundWard = wards.find(
        (w) => String(w.code) === String(selectedWard),
      );
      wardName = foundWard ? foundWard.name : property.ward;
    }

    // Tạo object request với amenities_id là mảng id
    const requestObj = {
      name: property.name,
      description: property.description,
      address: property.address,
      ward: wardName,
      district: districtName,
      city: cityName,
      province: provinceName,
      country: selectedCountry,
      status: property.status,
      check_in_time: property.check_in_time,
      check_out_time: property.check_out_time,
      type_id: property.type_id,
      amenities_id: property.amenities_id, // là mảng id
    };
    formData.append(
      "request",
      new Blob([JSON.stringify(requestObj)], { type: "application/json" }),
    );
    console.log("Request object:", requestObj);
    // Thêm file ảnh đại diện
    if (property.imageFile) {
      formData.append("image", property.imageFile);
    }

    // Thêm các file ảnh bổ sung
    if (property.extraImageFiles && property.extraImageFiles.length > 0) {
      for (let file of property.extraImageFiles) {
        formData.append("extra_image", file);
      }
    }

    try {
      console.log("Submitting property:", formData);

      await hostAxios.post("/properties", formData);
      alert("Tạo chỗ nghỉ thành công!");
      navigate("/host/dashboard");
    } catch (err) {
      console.error("Error creating property:", err);
      alert("Tạo chỗ nghỉ thất bại!");
    }
  };

  return (
    <div className="mx-auto my-10 max-w-3xl rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-2xl font-bold text-blue-700">
        Thêm chỗ nghỉ mới
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Chọn loại */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Loại chỗ nghỉ
          </label>
          <select
            className="w-full rounded border px-3 py-2"
            value={type}
            onChange={handleTypeChange}
          >
            <option value="villa">Villa</option>
            <option value="hotel">Hotel</option>
            <option value="apartment">Apartment</option>
          </select>
        </div>
        {/* Tên, mô tả, ảnh */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Tên chỗ nghỉ
          </label>
          <input
            className="w-full rounded border px-3 py-2"
            value={property.name}
            onChange={(e) =>
              setProperty((p) => ({ ...p, name: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <label className="mb-2 block font-medium text-gray-700">Mô tả</label>
          <ReactQuill
            theme="snow"
            value={property.description}
            onChange={(value) =>
              setProperty((p) => ({ ...p, description: value }))
            }
            style={{ background: "white" }}
          />
        </div>
        {/* Ảnh đại diện */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Ảnh đại diện
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
            <span className="text-sm text-blue-700">Chọn ảnh đại diện</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const base64 = await getBase64(file);
                  setProperty((p) => ({
                    ...p,
                    image: base64,
                    imageFile: file,
                  }));
                }
              }}
            />
          </label>
          {property.image && (
            <img
              src={property.image}
              alt="Preview"
              className="mt-2 h-24 w-24 rounded-lg object-cover shadow"
            />
          )}
        </div>
        {/* Ảnh bổ sung */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
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
            <span className="text-sm text-blue-700">Chọn ảnh bổ sung</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={async (e) => {
                const files = Array.from(e.target.files);
                const base64Arr = await Promise.all(files.map(getBase64));
                setProperty((p) => ({
                  ...p,
                  extra_images: base64Arr,
                  extraImageFiles: files, // Lưu file gốc để gửi lên server
                }));
              }}
            />
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {property.extra_images &&
              property.extra_images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`extra-${idx}`}
                  className="h-16 w-16 rounded-lg object-cover shadow"
                />
              ))}
          </div>
        </div>
        {/* Địa chỉ */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Quốc gia
            </label>
            <select
              className="w-full rounded border px-3 py-2"
              value={selectedCountry}
              onChange={handleCountryChange}
              required
            >
              {countries.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {/* Tỉnh/Thành */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Tỉnh/Thành
            </label>
            {selectedCountry === "Vietnam" ? (
              <select
                className="w-full rounded border px-3 py-2"
                value={selectedProvince}
                onChange={handleProvinceChange}
                required
                disabled={selectedCountry !== "Vietnam"}
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
                className="w-full rounded border px-3 py-2"
                type="text"
                value={property.province}
                onChange={(e) =>
                  setProperty((p) => ({ ...p, province: e.target.value }))
                }
                required
                placeholder="Nhập tỉnh/thành"
              />
            )}
          </div>
          {/* Quận/Huyện */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Quận/Huyện
            </label>
            {selectedCountry === "Vietnam" ? (
              <select
                className="w-full rounded border px-3 py-2"
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
                className="w-full rounded border px-3 py-2"
                type="text"
                value={property.district}
                onChange={(e) =>
                  setProperty((p) => ({ ...p, district: e.target.value }))
                }
                required
                placeholder="Nhập quận/huyện"
              />
            )}
          </div>
          {/* Phường/Xã */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Phường/Xã
            </label>
            {selectedCountry === "Vietnam" ? (
              <select
                className="w-full rounded border px-3 py-2"
                value={selectedWard}
                onChange={handleWardChange}
                required
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
                className="w-full rounded border px-3 py-2"
                type="text"
                value={property.ward}
                onChange={(e) =>
                  setProperty((p) => ({ ...p, ward: e.target.value }))
                }
                required
                placeholder="Nhập phường/xã"
              />
            )}
          </div>
          <div className="col-span-2">
            <label className="mb-2 block font-medium text-gray-700">
              Địa chỉ (đường, số nhà...)
            </label>
            <input
              className="w-full rounded border px-3 py-2"
              value={property.address}
              onChange={(e) =>
                setProperty((p) => ({ ...p, address: e.target.value }))
              }
              required
            />
          </div>
        </div>
        {/* Checkin/Checkout */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Giờ nhận phòng
            </label>
            <input
              type="time"
              className="w-full rounded border px-3 py-2"
              value={property.check_in_time}
              onChange={(e) =>
                setProperty((p) => ({ ...p, check_in_time: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Giờ trả phòng
            </label>
            <input
              type="time"
              className="w-full rounded border px-3 py-2"
              value={property.check_out_time}
              onChange={(e) =>
                setProperty((p) => ({ ...p, check_out_time: e.target.value }))
              }
              required
            />
          </div>
        </div>
        {/* Chọn tiện nghi */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Tiện nghi
          </label>
          <div className="flex flex-wrap gap-4">
            {amenities.map((a) => (
              <label key={a.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={property.amenities_id.includes(a.id)}
                  onChange={() => handleAmenityChange(a.id)}
                />
                <span dangerouslySetInnerHTML={{ __html: a.icon }} />
                {a.name}
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700 active:scale-95"
        >
          Thêm chỗ nghỉ
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
