import PropTypes from "prop-types";

const BookingTooltip = ({
  propertyName,
  accommodationInfo,
  checkIn,
  checkOut,
  isVisible,
}) => {
  if (!isVisible) return null;

  // Calculate number of nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24),
  );

  // Format dates for display in Vietnamese format
  const formatDate = (date) => {
    const d = new Date(date);
    const weekdays = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const weekday = weekdays[d.getDay()];

    return `${weekday}, ngày ${day} tháng ${month} năm ${year}`;
  };

  return (
    <div className="absolute right-0 bottom-full mb-2 w-[400px] transform rounded-md border border-gray-200 bg-primary-light p-3 text-white shadow-lg">
      <div className="mb-2 text-xl font-bold text-white">{propertyName}</div>
      <div className="mb-2 text-sm font-semibold text-white">
        {accommodationInfo.map((info, index) => (
          <span key={index}>
            {info.name}
            {index < accommodationInfo.length - 1 && ", "}
          </span>
        ))}
      </div>

      <div className="mb-2 text-sm">
        <span className="font-medium">Tổng thời gian lưu trú: </span>
        {nights} đêm
      </div>

      <div className="mb-1 text-sm">
        <span className="font-medium">Nhận phòng: </span>
        {formatDate(checkIn)}
      </div>

      <div className="mb-3 text-sm">
        <span className="font-medium">Trả phòng: </span>
        {formatDate(checkOut)}
      </div>

      <div className="rounded-md bg-yellow-100 p-2 text-sm font-medium text-yellow-800">
        Lựa chọn tuyệt vời! Đặt phòng ngay chỉ tốn 2 phút.
      </div>
    </div>
  );
};

BookingTooltip.propTypes = {
  propertyName: PropTypes.string,
  accommodationInfo: PropTypes.array,
  checkIn: PropTypes.string.isRequired,
  checkOut: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

export default BookingTooltip;
