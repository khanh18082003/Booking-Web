import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../utils/axiosCustomize";
const PROPERTY_TYPE_MAP = {
  villa: {
    type_id: 1,
    name: "DELUXE VILLA",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/square600/559484004.webp?k=d4b3c0795ecaed2cd701671761cc076f87ce2f592756c743926c1fb7881aa0d4&o=",
    description:
      "Tọa lạc ở Huế, DELUXE VILLA cung cấp chỗ nghỉ có Wi-Fi miễn phí, điều hòa, xe đạp miễn phí và khu vườn với hồ bơi ngoài trời mở quanh năm. Biệt thự cung cấp phòng chờ chung, nhà hàng, cũng như quầy bar.Có sân hiên nhìn ra thành phố, biệt thự có 4 phòng ngủ, phòng khách, TV màn hình phẳng truyền hình vệ tinh, bếp đầy đủ tiện nghi, 4 phòng tắm với vòi xịt/chậu rửa vệ sinh và vòi sen. Khăn tắm và ga trải giường có sẵn ở biệt thự.Thành thạo tiếng Anh và tiếng Việt, đội ngũ nhân viên luôn túc trực 24/7 tại lễ tân.Khách tại biệt thự có thể sử dụng phòng tập gym hoặc thư giãn ở trung tâm chăm sóc sức khỏe, bao gồm hồ bơi trong nhà, phòng xông hơi khô và bể sục. Khách có thể sử dụng sân chơi trẻ em và BBQ tại DELUXE VILLA. Chỗ nghỉ cách Cầu Tràng Tiền 2.4 km. Sân bay quốc tế Phú Bài cách 13 km, đồng thời chỗ nghỉ có cung cấp dịch vụ đưa đón sân bay mất phí.",
    extra_images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/559484004.jpg?k=77a40a4e501e6f5484d3a2a8c5d10c227a9d419afd726ea3b916072b2028468c&o=&hp=1",
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/578846090.jpg?k=ba7c83bd181321a13cf7cd9d4b7d5bc9329e82df6c849c6b61924d8c3a1ee738&o=&hp=1",
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/577522766.jpg?k=50709226cb56e1a9caa5e4b8deadfbd1ac60b41eb404700506c0b92e88523f08&o=&hp=1",
    ],
  },
  hotel: {
    type_id: 2,
    name: "DELUXE HOTEL",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/square600/559484004.webp?k=d4b3c0795ecaed2cd701671761cc076f87ce2f592756c743926c1fb7881aa0d4&o=",
    description:
      "Khách sạn hiện đại, đầy đủ tiện nghi, vị trí trung tâm, phục vụ chuyên nghiệp, có nhà hàng, phòng gym, hồ bơi, wifi miễn phí.",
    extra_images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/559484004.jpg?k=77a40a4e501e6f5484d3a2a8c5d10c227a9d419afd726ea3b916072b2028468c&o=&hp=1",
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/578846090.jpg?k=ba7c83bd181321a13cf7cd9d4b7d5bc9329e82df6c849c6b61924d8c3a1ee738&o=&hp=1",
    ],
  },
  apartment: {
    type_id: 3,
    name: "DELUXE APARTMENT",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/square600/559484004.webp?k=d4b3c0795ecaed2cd701671761cc076f87ce2f592756c743926c1fb7881aa0d4&o=",
    description:
      "Căn hộ tiện nghi, phù hợp gia đình, có bếp, phòng khách, wifi miễn phí, gần trung tâm.",
    extra_images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/559484004.jpg?k=77a40a4e501e6f5484d3a2a8c5d10c227a9d419afd726ea3b916072b2028468c&o=&hp=1",
    ],
  },
};

const DEFAULT_ADDRESS = {
  address: "20 Lý Tự Trọng",
  ward: "phường Xuân Phú",
  district: "Quận Thuận Hóa",
  city: "Tp.Huế",
  province: "TP.Huế",
  country: "Việt Nam",
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

  // ...existing code...

  useEffect(() => {
    // Fetch amenities từ API thật
    const fetchAmenities = async () => {
      try {
        const res = await axios.get("/amenities");
        if (res.data.code === "M000") {
          setAmenities(res.data.data.data); // data.data là mảng amenities
        }
      } catch (err) {
        setAmenities([]);
      }
    };
    fetchAmenities();
  }, []);

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

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Tạo object request với amenities_id là mảng id
    const requestObj = {
      name: property.name,
      description: property.description,
      address: property.address,
      ward: property.ward,
      district: property.district,
      city: property.city,
      province: property.province,
      country: property.country,
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
      console.log("Request object:", requestObj);
      console.log("Extra images:", property.extraImageFiles);
      console.log("image file:", property.imageFile);
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      await axios.post("/properties", formData);
      alert("Tạo chỗ nghỉ thành công!");
      navigate("/host/properties");
    } catch (err) {
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
          <textarea
            className="w-full rounded border px-3 py-2"
            rows={4}
            value={property.description}
            onChange={(e) =>
              setProperty((p) => ({ ...p, description: e.target.value }))
            }
            required
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
              Địa chỉ
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
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Phường/Xã
            </label>
            <input
              className="w-full rounded border px-3 py-2"
              value={property.ward}
              onChange={(e) =>
                setProperty((p) => ({ ...p, ward: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Quận/Huyện
            </label>
            <input
              className="w-full rounded border px-3 py-2"
              value={property.district}
              onChange={(e) =>
                setProperty((p) => ({ ...p, district: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Thành phố
            </label>
            <input
              className="w-full rounded border px-3 py-2"
              value={property.city}
              onChange={(e) =>
                setProperty((p) => ({ ...p, city: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Tỉnh/Thành
            </label>
            <input
              className="w-full rounded border px-3 py-2"
              value={property.province}
              onChange={(e) =>
                setProperty((p) => ({ ...p, province: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Quốc gia
            </label>
            <input
              className="w-full rounded border px-3 py-2"
              value={property.country}
              onChange={(e) =>
                setProperty((p) => ({ ...p, country: e.target.value }))
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
