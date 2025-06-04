import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import hostAxios from "../../configuration/hostAxiosCustomize";
import { useStore } from "../../utils/AuthProvider";
import {
  FaAngleDown,
  FaAngleUp,
  FaChevronLeft,
  FaBed,
  FaUsers,
  FaRulerCombined,
  FaPlus,
  FaTimes,
  FaSave,
  FaTrash,
  FaCalendarAlt,
  FaEdit,
} from "react-icons/fa";
import PriceCalendar from "../../components/DetailRoom/PriceCalendar";

// Tạo component chọn giường ngủ
const BedTypeSelector = ({ bedTypes, value, onChange, onRemove, index }) => {
  const [availableBedTypes, setAvailableBedTypes] = useState([]);

  useEffect(() => {
    // Fetch danh sách loại giường từ API
    const fetchBedTypes = async () => {
      try {
        const response = await hostAxios.get("/bed-types");
        if (response.data && response.data.data) {
          setAvailableBedTypes(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching bed types:", error);
        // Dữ liệu mẫu nếu API không hoạt động
        setAvailableBedTypes([
          { id: 1, name: "Giường đơn" },
          { id: 2, name: "Giường đôi" },
          { id: 3, name: "Giường đôi lớn (King)" },
          { id: 4, name: "Giường Queen" },
          { id: 5, name: "Sofa giường" },
        ]);
      }
    };

    fetchBedTypes();
  }, []);

  // Tạo mảng số lượng từ 1-10
  const quantityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <select
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={value.id || ""}
          onChange={(e) => onChange({ ...value, id: Number(e.target.value) })}
        >
          <option value="">Chọn loại giường</option>
          {availableBedTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      <div className="w-24">
        <select
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={value.quantity || 1}
          onChange={(e) =>
            onChange({ ...value, quantity: Number(e.target.value) })
          }
        >
          {quantityOptions.map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="rounded p-2 text-red-500 hover:bg-red-50"
      >
        <FaTrash size={14} />
      </button>
    </div>
  );
};

// Tạo component phòng
const RoomInput = ({ room, onChange, onRemove, index }) => {
  const handleBedTypeChange = (bedType, bedIndex) => {
    const newBeds = [...room.bed_types];
    newBeds[bedIndex] = bedType;
    onChange({ ...room, bed_types: newBeds });
  };

  const addBedType = () => {
    onChange({
      ...room,
      bed_types: [...room.bed_types, { id: "", quantity: 1 }],
    });
  };

  const removeBedType = (bedIndex) => {
    const newBeds = room.bed_types.filter((_, idx) => idx !== bedIndex);
    onChange({ ...room, bed_types: newBeds });
  };

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1">
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Tên phòng (VD: Phòng ngủ chính)"
            value={room.room_name}
            onChange={(e) => onChange({ ...room, room_name: e.target.value })}
          />
        </div>
        <select
          className="ml-2 w-40 rounded-md border border-gray-300 px-3 py-2"
          value={room.room_type_id}
          onChange={(e) =>
            onChange({ ...room, room_type_id: Number(e.target.value) })
          }
        >
          <option value={1}>Phòng ngủ</option>
          <option value={2}>Phòng khách</option>
          <option value={3}>Phòng tắm</option>
          <option value={4}>Phòng khác</option>
        </select>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="ml-2 rounded p-2 text-red-500 hover:bg-red-50"
        >
          <FaTrash size={16} />
        </button>
      </div>

      <div className="mb-3">
        <h4 className="mb-2 text-sm font-medium text-gray-600">
          Giường trong phòng
        </h4>
        {room.bed_types.length === 0 && (
          <p className="mb-2 text-sm text-gray-500 italic">Không có giường</p>
        )}
        <div className="space-y-2">
          {room.bed_types.map((bed, bedIndex) => (
            <BedTypeSelector
              key={bedIndex}
              bedTypes={[]}
              value={bed}
              onChange={(newBed) => handleBedTypeChange(newBed, bedIndex)}
              onRemove={() => removeBedType(bedIndex)}
              index={bedIndex}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addBedType}
          className="mt-2 flex items-center rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100"
        >
          <FaPlus className="mr-1" size={12} /> Thêm giường
        </button>
      </div>
    </div>
  );
};

const Accommodation = () => {
  const { id } = useParams();
  const { store } = useStore();
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [propertyName, setPropertyName] = useState("");

  // State cho modal thêm mới
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAccommodation, setNewAccommodation] = useState({
    name: "",
    base_price: 0,
    capacity: 2,
    total_units: 1,
    description: "",
    size: 0,
    unit: "square",
    total_rooms: 1,
    properties_id: id, // Lấy từ param URL
    amenities_ids: [],
    rooms: [
      {
        room_name: "Phòng ngủ 1",
        room_type_id: 1,
        bed_types: [{ id: 2, quantity: 1 }],
      },
    ],
    extra_images: [],
  });
  const [amenities, setAmenities] = useState([]);
  const [extraImageFiles, setExtraImageFiles] = useState([]);
  const [extraImagePreviews, setExtraImagePreviews] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // State cho modal cài đặt giá
  const [isPriceCalendarOpen, setIsPriceCalendarOpen] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);

  // Fetch danh sách accommodation
  useEffect(() => {
    const fetchAccommodations = async () => {
      if (!store.hostProfile) return;
      try {
        setLoading(true);
        const response = await hostAxios.get(
          `/properties/${id}/host-accommodations`,
        );

        if (response.data && response.data.data) {
          setAccommodations(response.data.data);
          console.log("Accommodations:", response.data.data);
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

  // Fetch danh sách tiện nghi
  useEffect(() => {
    const fetchAmenities = async () => {
      if (!store.hostProfile) {
        return;
      }
      try {
        const res = await hostAxios.get("/amenities");

        if (res.data && res.data.data) {
          // Lọc chỉ lấy tiện nghi cho accommodation
          const accommodationAmenities = res.data.data.data.filter(
            (amenity) => amenity.type === "ACCOMMODATION",
          );
          setAmenities(accommodationAmenities);
        }
      } catch (err) {
        console.error("Error fetching amenities:", err);
      }
    };
    fetchAmenities();
  }, [store.hostProfile]);

  // Hàm toggle mở/đóng chi tiết
  const toggleDetails = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  // Mở modal thêm accommodation
  const openAddModal = () => {
    setIsAddModalOpen(true);
    // Reset form
    setNewAccommodation({
      name: "",
      base_price: 0,
      capacity: 2,
      total_units: 1,
      description: "",
      size: 0,
      unit: "square",
      total_rooms: 1,
      properties_id: id,
      amenities_ids: [],
      rooms: [
        {
          room_name: "Phòng ngủ 1",
          room_type_id: 1,
          bed_types: [{ id: 2, quantity: 1 }],
        },
      ],
    });
    setExtraImageFiles([]);
    setExtraImagePreviews([]);
  };

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Xử lý thay đổi trường input
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setNewAccommodation((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // Thêm phòng mới
  const addRoom = () => {
    const roomCount = newAccommodation.rooms.length + 1;
    setNewAccommodation((prev) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        {
          room_name: `Phòng ${roomCount}`,
          room_type_id: 1,
          bed_types: [{ id: 2, quantity: 1 }],
        },
      ],
      total_rooms: prev.total_rooms + 1,
    }));
  };

  // Cập nhật thông tin phòng
  const updateRoom = (roomData, index) => {
    const updatedRooms = [...newAccommodation.rooms];
    updatedRooms[index] = roomData;
    setNewAccommodation((prev) => ({
      ...prev,
      rooms: updatedRooms,
    }));
  };

  // Xóa phòng
  const removeRoom = (index) => {
    const updatedRooms = newAccommodation.rooms.filter(
      (_, idx) => idx !== index,
    );
    setNewAccommodation((prev) => ({
      ...prev,
      rooms: updatedRooms,
      total_rooms: prev.total_rooms - 1,
    }));
  };

  // Chọn tiện nghi
  const handleAmenityChange = (id) => {
    setNewAccommodation((prev) => {
      const exists = prev.amenities_ids.includes(id);
      return {
        ...prev,
        amenities_ids: exists
          ? prev.amenities_ids.filter((a) => a !== id)
          : [...prev.amenities_ids, id],
      };
    });
  };

  // Xử lý thêm hình ảnh
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    // Kiểm tra số lượng hình ảnh (tối đa 10 ảnh)
    const totalImages = extraImagePreviews.length + files.length;
    if (totalImages > 10) {
      alert("Bạn chỉ có thể tải lên tối đa 10 hình ảnh");
      return;
    }

    // Lọc file quá lớn
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" vượt quá 5MB và sẽ không được tải lên`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setExtraImageFiles((prev) => [...prev, ...validFiles]);

      // Tạo previews cho files mới
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setExtraImagePreviews((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Xóa hình ảnh
  const removeImage = (index) => {
    setExtraImagePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setExtraImageFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      // Tạo FormData để gửi dữ liệu và files
      const formData = new FormData();

      // Thêm dữ liệu accommodation dưới dạng JSON
      formData.append(
        "request",
        new Blob([JSON.stringify(newAccommodation)], {
          type: "application/json",
        }),
      );

      // Thêm các hình ảnh nếu có
      extraImageFiles.forEach((file) => {
        formData.append("extra_image", file);
      });
      console.log("Form data:", formData.get("request"));
      console.log("Extra images:", extraImageFiles);
      // Gọi API để tạo accommodation mới
      const response = await hostAxios.post("/accommodations", formData);

      if (response.data) {
        // Thêm accommodation mới vào danh sách với định dạng dữ liệu phù hợp với hiển thị
        const newData = response.data.data;

        // Tạo đối tượng accommodation mới có cấu trúc giống với dữ liệu từ API fetch
        const formattedNewData = {
          ...newData,
          // Đảm bảo tên thuộc tính phù hợp với hiển thị
          basePrice: newData.base_price || newData.basePrice,
          totalRooms: newData.total_rooms || newData.totalRooms,
          totalUnits: newData.total_units || newData.totalUnits,
          // Đảm bảo URL hình ảnh đúng định dạng
          extra_images: newData.extra_images || [],
        };

        setAccommodations((prev) => [...prev, formattedNewData]);

        // Đóng modal
        setIsAddModalOpen(false);
        alert("Thêm loại phòng thành công!");
      }
    } catch (error) {
      console.error("Error creating accommodation:", error);
      alert("Đã xảy ra lỗi khi thêm loại phòng!");
    } finally {
      setIsSaving(false);
    }
  };

  // Mở modal chỉnh sửa giá theo ngày
  const openPriceCalendar = (accommodation) => {
    setSelectedAccommodation(accommodation);
    setIsPriceCalendarOpen(true);
  };

  // Xử lý lưu giá mới
  const handleSavePrices = async (dailyPrices) => {
    if (!selectedAccommodation) return;

    try {
      // Trong triển khai thực tế, gọi API để lưu giá theo ngày
      console.log("Saving prices for accommodation:", selectedAccommodation.id);
      console.log("Daily prices:", dailyPrices);

      // Giả lập API call thành công
      alert("Đã lưu giá phòng thành công!");

      // Đóng modal sau khi lưu
      setIsPriceCalendarOpen(false);
    } catch (error) {
      console.error("Error saving prices:", error);
      alert("Đã xảy ra lỗi khi lưu giá phòng!");
    }
  };

  // Render component
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
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="mr-4 cursor-pointer rounded-full p-3 text-gray-600 duration-200 hover:bg-white/70"
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
        <div className="">
          <button
            onClick={openAddModal}
            className="flex cursor-pointer items-center rounded-lg bg-secondary px-3 py-3 font-medium text-white transition hover:bg-primary"
          >
            <span>
              <GoPlus size={20} />
            </span>
            <span className="text-sm">Thêm loại phòng mới</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      {accommodations.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-center">
          <p className="mb-4 text-lg text-gray-500">
            Chưa có loại phòng nào được thêm vào
          </p>
          <button
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
            onClick={openAddModal}
          >
            <FaPlus className="mr-2 inline" /> Thêm loại phòng mới
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
                    <button
                      onClick={() => openPriceCalendar(accommodation)}
                      className="flex items-center rounded-md border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                    >
                      <FaCalendarAlt className="mr-2" /> Chỉnh sửa giá theo ngày
                    </button>
                    <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <FaEdit className="mr-2 inline" /> Chỉnh sửa
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

      {/* Modal thêm accommodation mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white/50">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  Thêm loại phòng mới
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="max-h-[70vh] overflow-y-auto pr-2"
              >
                <div className="space-y-6">
                  {/* Thông tin cơ bản */}
                  <div>
                    <h4 className="mb-3 font-medium text-gray-700">
                      Thông tin cơ bản
                    </h4>

                    <div className="mb-4">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Tên loại phòng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newAccommodation.name}
                        onChange={handleInputChange}
                        required
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Giá cơ bản (VND){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="base_price"
                          value={newAccommodation.base_price}
                          onChange={handleInputChange}
                          min="0"
                          required
                          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Sức chứa (người){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="capacity"
                          value={newAccommodation.capacity}
                          onChange={handleInputChange}
                          min="1"
                          required
                          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Số đơn vị <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="total_units"
                          value={newAccommodation.total_units}
                          onChange={handleInputChange}
                          min="1"
                          required
                          className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Diện tích
                        </label>
                        <div className="flex">
                          <input
                            type="number"
                            name="size"
                            value={newAccommodation.size}
                            onChange={handleInputChange}
                            min="0"
                            className="block w-full rounded-l-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                          <select
                            name="unit"
                            value={newAccommodation.unit}
                            onChange={handleInputChange}
                            className="rounded-r-md border border-gray-300 p-2"
                          >
                            <option value="square">m²</option>
                            <option value="feet">ft²</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Mô tả
                      </label>
                      <textarea
                        name="description"
                        value={newAccommodation.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      ></textarea>
                    </div>
                  </div>

                  {/* Tiện nghi */}
                  <div>
                    <h4 className="mb-3 font-medium text-gray-700">
                      Tiện nghi
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      {amenities.map((amenity) => (
                        <label
                          key={amenity.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={newAccommodation.amenities_ids.includes(
                              amenity.id,
                            )}
                            onChange={() => handleAmenityChange(amenity.id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600"
                          />
                          <span className="flex items-center">
                            <span
                              dangerouslySetInnerHTML={{ __html: amenity.icon }}
                            ></span>
                            <span className="ml-1">{amenity.name}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Cấu trúc phòng */}
                  <div>
                    <h4 className="mb-3 font-medium text-gray-700">
                      Cấu trúc phòng
                    </h4>

                    {newAccommodation.rooms.map((room, index) => (
                      <RoomInput
                        key={index}
                        room={room}
                        onChange={(updatedRoom) =>
                          updateRoom(updatedRoom, index)
                        }
                        onRemove={() => removeRoom(index)}
                        index={index}
                      />
                    ))}

                    <button
                      type="button"
                      onClick={addRoom}
                      className="mt-2 flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                    >
                      <FaPlus className="mr-2" /> Thêm phòng
                    </button>
                  </div>

                  {/* Hình ảnh */}
                  <div>
                    <h4 className="mb-3 font-medium text-gray-700">
                      Hình ảnh{" "}
                      <span className="text-sm font-normal text-gray-500">
                        (Tối đa 10 ảnh, mỗi ảnh tối đa 5MB)
                      </span>
                    </h4>

                    {/* Upload area */}
                    <div className="mb-4">
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="mb-3 h-10 w-10 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Nhấn để tải ảnh lên
                            </span>{" "}
                            hoặc kéo thả
                          </p>
                          <p className="text-xs text-gray-500">
                            SVG, PNG, JPG hoặc GIF
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          disabled={extraImagePreviews.length >= 10}
                        />
                      </label>
                    </div>

                    {/* Image previews */}
                    {extraImagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {extraImagePreviews.map((preview, index) => (
                          <div key={index} className="group relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="h-24 w-full rounded-md border border-gray-200 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3 border-t border-gray-200 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
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
                        <FaSave className="mr-2" /> Tạo loại phòng
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal hiển thị lịch giá */}
      {isPriceCalendarOpen && selectedAccommodation && (
        <PriceCalendar
          accommodationId={selectedAccommodation.id}
          basePrice={
            selectedAccommodation.basePrice ||
            selectedAccommodation.base_price ||
            0
          }
          onClose={() => setIsPriceCalendarOpen(false)}
          onSave={handleSavePrices}
        />
      )}
    </div>
  );
};

export default Accommodation;
