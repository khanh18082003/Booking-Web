import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaSave, FaTimes } from "react-icons/fa";
import hostAxios from "../../configuration/hostAxiosCustomize";

// Tạo component chỉnh sửa giá theo ngày
const PriceCalendar = ({ accommodationId, basePrice, onClose, onSave }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [newPrice, setNewPrice] = useState("");
  const [dailyPrices, setDailyPrices] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  const [modifiedPrices, setModifiedPrices] = useState({}); // Lưu trữ các ngày đã thay đổi giá

  // Ngày hiện tại thực tế (để kiểm tra quá khứ)
  const todayActual = new Date();
  todayActual.setHours(0, 0, 0, 0);

  // Lấy dữ liệu giá hàng ngày từ API
  useEffect(() => {
    const fetchDailyPrices = async () => {
      if (!accommodationId) return;

      setIsLoading(true);
      try {
        // Call API to get availability data
        const response = await hostAxios.get(
          `/accommodations/${accommodationId}/available`,
        );

        if (response.data && response.data.data) {
          const priceData = {};

          // Convert API response to our dailyPrices format
          response.data.data.forEach((day) => {
            priceData[day.date] = {
              id: day.id,
              price: day.price,
              totalInventory: day.totalInventory,
              totalReserved: day.totalReserved,
              available: day.totalInventory - day.totalReserved,
            };
          });

          setDailyPrices(priceData);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu giá:", error);

        // Fallback to dummy data if API fails
        generateDummyData();
      } finally {
        setIsLoading(false);
      }
    };

    // Tạo dữ liệu giả khi API không hoạt động (chỉ dùng cho development)
    const generateDummyData = () => {
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      // Tạo dữ liệu giả với giá cơ bản
      const dummyData = {};
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      for (let i = 1; i <= daysInMonth; i++) {
        const dateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${i.toString().padStart(2, "0")}`;
        // Giá ngẫu nhiên xung quanh giá cơ bản
        const randomVariation = Math.floor(Math.random() * 20) - 10;
        const price = basePrice + randomVariation * 5000;

        // Đặt giá cao hơn cho cuối tuần
        const dayOfWeek = new Date(currentYear, currentMonth, i).getDay();
        const weekendPrice = basePrice + 50000;

        dummyData[dateString] = {
          id: 9500 + i,
          price: dayOfWeek === 5 || dayOfWeek === 6 ? weekendPrice : price,
          totalInventory: 10,
          totalReserved: Math.floor(Math.random() * 5),
          available: Math.floor(Math.random() * 10),
        };
      }

      setDailyPrices(dummyData);
    };

    fetchDailyPrices();
  }, [currentDate, accommodationId, basePrice]);

  // Kiểm tra xem một ngày có phải là quá khứ không
  const isPastDate = (year, month, day) => {
    const date = new Date(year, month, day);
    return date < todayActual;
  };

  // Tạo mảng ngày của tháng hiện tại
  const getDaysArray = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Tạo mảng các ô trống cho những ngày trước ngày đầu tiên của tháng
    const days = Array(firstDay).fill(null);

    // Thêm các ngày trong tháng
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // Xử lý chọn ngày
  const handleDateSelect = (day) => {
    if (!day) return; // Bỏ qua ô trống

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Kiểm tra ngày quá khứ
    if (isPastDate(year, month, day)) return;

    const dateString = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    setSelectedDates((prev) => {
      const isAlreadySelected = prev.includes(dateString);

      // Cập nhật thông tin ngày được chọn để hiển thị ở panel bên phải
      if (!isAlreadySelected) {
        const dayInfo = dailyPrices[dateString] || { price: basePrice };
        setSelectedDateInfo({
          date: dateString,
          day: day,
          month: month,
          year: year,
          price: dayInfo.price,
          available: dayInfo.totalInventory - (dayInfo.totalReserved || 0),
        });
        return [...prev, dateString];
      } else {
        // Nếu ngày được bỏ chọn và nó là ngày đang hiển thị chi tiết, xóa chi tiết
        if (selectedDateInfo && selectedDateInfo.date === dateString) {
          setSelectedDateInfo(null);
        }
        return prev.filter((date) => date !== dateString);
      }
    });
  };

  // Xử lý chuyển tháng
  const handleMonthChange = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
    // Reset selected dates when changing month
    setSelectedDates([]);
    setSelectedDateInfo(null);
  };

  // Áp dụng giá mới cho các ngày đã chọn
  const applyPriceToSelected = () => {
    if (!newPrice || selectedDates.length === 0) return;

    const priceValue = parseInt(newPrice);
    if (isNaN(priceValue) || priceValue <= 0) return;

    const updatedPrices = { ...dailyPrices };
    const updatedModifiedPrices = { ...modifiedPrices };

    selectedDates.forEach((date) => {
      if (updatedPrices[date]) {
        updatedPrices[date] = {
          ...updatedPrices[date],
          price: priceValue,
        };
      } else {
        updatedPrices[date] = {
          price: priceValue,
          totalInventory: 10,
          totalReserved: 0,
          available: 10,
        };
      }

      // Lưu vào modifiedPrices để theo dõi các thay đổi
      updatedModifiedPrices[date] = {
        date: date,
        price: priceValue,
      };
    });

    setDailyPrices(updatedPrices);
    setModifiedPrices(updatedModifiedPrices);

    // Cập nhật thông tin ngày đang xem nếu có
    if (selectedDateInfo) {
      setSelectedDateInfo({
        ...selectedDateInfo,
        price: priceValue,
      });
    }

    setNewPrice("");
  };

  // Xử lý lưu thay đổi
  const handleSave = async () => {
    // Kiểm tra nếu không có giá nào thay đổi
    if (Object.keys(modifiedPrices).length === 0) {
      onClose();
      return;
    }

    setIsSaving(true);

    try {
      // Nhóm các ngày theo giá để gọi API riêng cho từng mức giá
      const priceGroups = {};

      Object.entries(modifiedPrices).forEach(([date, data]) => {
        const { price } = data;
        if (!priceGroups[price]) {
          priceGroups[price] = [];
        }
        priceGroups[price].push(date);
      });

      // Gọi API riêng cho từng nhóm giá
      const apiCalls = Object.entries(priceGroups).map(
        async ([price, dates]) => {
          const data = {
            id: accommodationId,
            dates: dates,
            price: parseInt(price),
          };

          console.log("Saving price data:", data);

          const response = await hostAxios.put(
            "/accommodations/available",
            data,
          );
          return response.data;
        },
      );

      // Chờ tất cả các API call hoàn thành
      const results = await Promise.all(apiCalls);
      console.log("API save results:", results);

      // Cập nhật lại dailyPrices với dữ liệu mới từ API
      const updatedPrices = { ...dailyPrices };

      results.forEach((result) => {
        if (result && result.data) {
          result.data.forEach((day) => {
            updatedPrices[day.date] = {
              id: day.id,
              price: day.price,
              totalInventory: day.totalInventory,
              totalReserved: day.totalReserved,
              available: day.totalInventory - day.totalReserved,
            };
          });
        }
      });

      setDailyPrices(updatedPrices);
      setModifiedPrices({}); // Reset danh sách giá đã thay đổi

      // Thông báo thành công cho người dùng
      alert("Đã lưu thành công giá mới cho các ngày đã chọn!");

      // Gọi hàm callback từ component cha (nếu có)
      if (onSave) {
        onSave(updatedPrices);
      }

      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu giá mới:", error);
      alert("Đã xảy ra lỗi khi lưu giá mới. Vui lòng thử lại sau!");
    } finally {
      setIsSaving(false);
    }
  };

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format ngày
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Tên tháng
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  // Tên các ngày trong tuần
  const weekdayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">
      <div className="w-full max-w-7xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-[#003b95]">
            Chỉnh sửa giá theo ngày
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="grid max-h-[80vh] min-h-[500px] grid-cols-1 gap-6 overflow-y-auto p-6 lg:grid-cols-5">
          {/* Phần lịch - chiếm 3/5 */}
          <div className="overflow-x-auto lg:col-span-3">
            {/* Điều khiển tháng */}
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => handleMonthChange(-1)}
                className="rounded-full p-3 text-[#003b95] hover:bg-gray-100"
              >
                <FaChevronLeft size={18} />
              </button>
              <h3 className="text-xl font-medium text-[#003b95]">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={() => handleMonthChange(1)}
                className="rounded-full p-3 text-[#003b95] hover:bg-gray-100"
              >
                <FaChevronRight size={18} />
              </button>
            </div>

            {/* Lịch */}
            {isLoading ? (
              <div className="flex h-96 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#006ce4] border-t-transparent"></div>
              </div>
            ) : (
              <div className="calendar-container pb-4">
                {/* Header của lịch */}
                <div className="mb-2 grid grid-cols-7 gap-1">
                  {weekdayNames.map((day, index) => (
                    <div
                      key={index}
                      className="py-3 text-center text-sm font-medium text-gray-700"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Lưới ngày */}
                <div className="grid grid-cols-7 gap-1">
                  {getDaysArray().map((day, index) => {
                    if (day === null) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square bg-gray-50"
                        ></div>
                      );
                    }

                    const year = currentDate.getFullYear();
                    const month = currentDate.getMonth();
                    const dateString = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                    const isSelected = selectedDates.includes(dateString);

                    // Lấy dữ liệu ngày nếu có
                    const dayData = dailyPrices[dateString];
                    const price = dayData ? dayData.price : basePrice;

                    // Kiểm tra nếu đây là ngày hôm nay
                    const today = new Date();
                    const isToday =
                      day === today.getDate() &&
                      month === today.getMonth() &&
                      year === today.getFullYear();

                    // Kiểm tra nếu đây là ngày quá khứ
                    const isPast = isPastDate(year, month, day);

                    // Trạng thái inventory
                    const totalInventory = dayData?.totalInventory || 10;
                    const totalReserved = dayData?.totalReserved || 0;
                    const availableRooms = totalInventory - totalReserved;

                    // Style dựa vào trạng thái của ngày
                    let cellClasses =
                      "flex aspect-square rounded-[10px] flex-col items-center justify-center border p-2";
                    let dayTextClasses = "text-sm font-medium";
                    let priceClasses = "text-xs";

                    // Ngày quá khứ
                    if (isPast) {
                      cellClasses +=
                        " opacity-50 bg-gray-100 cursor-not-allowed";
                      dayTextClasses += " text-gray-400";
                      priceClasses += " text-gray-400";
                    }
                    // Ngày hiện tại & tương lai
                    else {
                      cellClasses += " cursor-pointer hover:border-[#006ce4]";

                      // Ngày đã chọn
                      if (isSelected) {
                        cellClasses += " border-2 border-[#006ce4] bg-blue-50";
                      } else {
                        cellClasses += " border-gray-200";

                        // Style dựa vào tình trạng available
                        if (availableRooms <= 0) {
                          cellClasses += " bg-red-50";
                        } else if (availableRooms < 3) {
                          cellClasses += " bg-yellow-50";
                        }
                      }

                      // Ngày hôm nay
                      if (isToday) {
                        cellClasses += " ring-1 ring-[#006ce4]";
                        dayTextClasses += " text-[#006ce4]";
                      }

                      // Style giá
                      if (price > basePrice) {
                        priceClasses += " text-green-600 font-medium";
                      } else if (price < basePrice) {
                        priceClasses += " text-red-600";
                      }
                    }

                    return (
                      <div
                        key={dateString}
                        onClick={() => !isPast && handleDateSelect(day)}
                        className={cellClasses}
                      >
                        <div className={dayTextClasses}>{day}</div>
                        <div className={priceClasses}>{formatPrice(price)}</div>
                        <div
                          className={`mt-1 text-xs ${isPast ? "text-gray-400" : "text-gray-500"}`}
                        >
                          Còn {availableRooms}/{totalInventory}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Phần thông tin và điều chỉnh giá - chiếm 2/5 */}
          <div className="flex flex-col rounded-lg border border-gray-200 bg-gray-50 lg:col-span-2">
            <div className="p-5">
              <h3 className="mb-4 text-xl font-medium text-[#003b95]">
                Chỉnh sửa giá phòng
              </h3>

              {/* Thông tin ngày đang chọn */}
              {selectedDateInfo ? (
                <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
                  <h4 className="font-medium text-[#006ce4]">
                    {formatDate(selectedDateInfo.date)}
                  </h4>
                  <div className="mt-3 flex justify-between">
                    <span className="text-gray-600">Giá hiện tại:</span>
                    <span className="font-medium text-gray-800">
                      {formatPrice(selectedDateInfo.price)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-gray-600">Phòng còn trống:</span>
                    <span className="font-medium text-gray-800">
                      {selectedDateInfo.available || "N/A"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-6 rounded-lg border border-dashed border-gray-300 bg-white p-5 text-center text-gray-500">
                  Chọn một ngày để xem chi tiết
                </div>
              )}

              {/* Điều khiển giá */}
              <div className="mb-6">
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Chọn giá mới cho {selectedDates.length} ngày đã chọn:
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="Nhập giá mới"
                      min="0"
                      className="block w-full rounded-l-md border border-gray-300 p-3 shadow-sm focus:border-[#006ce4] focus:ring-[#006ce4]"
                    />
                    <button
                      onClick={applyPriceToSelected}
                      disabled={!newPrice || selectedDates.length === 0}
                      className="flex min-w-[100px] items-center justify-center rounded-r-md bg-[#006ce4] px-4 py-2 font-medium text-white hover:bg-[#0057b8] disabled:bg-gray-300"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>

                {/* Các thao tác nhanh */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Thao tác nhanh:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setNewPrice(Math.round(basePrice * 1.2).toString());
                      }}
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      +20%
                    </button>
                    <button
                      onClick={() => {
                        setNewPrice(Math.round(basePrice * 1.1).toString());
                      }}
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      +10%
                    </button>
                    <button
                      onClick={() => {
                        setNewPrice(basePrice.toString());
                      }}
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Giá gốc
                    </button>
                    <button
                      onClick={() => {
                        setNewPrice(Math.round(basePrice * 0.9).toString());
                      }}
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      -10%
                    </button>
                    <button
                      onClick={() => {
                        setNewPrice(Math.round(basePrice * 0.8).toString());
                      }}
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      -20%
                    </button>
                  </div>
                </div>
              </div>

              {/* Thông tin tổng quan */}
              <div className="mb-6 space-y-3 rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Giá gốc:</span>
                  <span className="font-medium">{formatPrice(basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ngày đã chọn:</span>
                  <span className="font-medium text-[#006ce4]">
                    {selectedDates.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Ngày đã thay đổi giá:
                  </span>
                  <span className="font-medium text-[#006ce4]">
                    {Object.keys(modifiedPrices).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Giá cao nhất:</span>
                  <span className="font-medium text-green-600">
                    {formatPrice(
                      Math.max(
                        ...Object.values(dailyPrices).map(
                          (d) => d.price || basePrice,
                        ),
                        basePrice,
                      ),
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Giá thấp nhất:</span>
                  <span className="font-medium text-red-600">
                    {formatPrice(
                      Math.min(
                        ...Object.values(dailyPrices).map(
                          (d) => d.price || basePrice,
                        ),
                        basePrice,
                      ),
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Nút lưu - fixed ở dưới */}
            <div className="mt-auto space-y-3 rounded-b-lg border-t border-gray-200 bg-white p-5">
              <button
                onClick={handleSave}
                disabled={isSaving || Object.keys(modifiedPrices).length === 0}
                className="flex w-full items-center justify-center rounded-md bg-[#006ce4] px-4 py-3 font-medium text-white hover:bg-[#0057b8] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Lưu{" "}
                    {Object.keys(modifiedPrices).length > 0
                      ? Object.keys(modifiedPrices).length
                      : ""}{" "}
                    ngày đã thay đổi
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isSaving}
                className="w-full rounded-md border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalendar;
