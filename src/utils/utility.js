export const getRatingText = (rating) => {
  switch (true) {
    case rating >= 9.5:
      return "Xuất sắc";
    case rating >= 8.0:
      return "Rất tốt";
    case rating >= 7.0:
      return "Tốt";
    default:
      return "Trung bình";
  }
};

export const getNights = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = Math.abs(end - start);
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const formatDate = (date) => {
  const dateFormat =
    typeof date === "string" ? new Date(date + "T00:00:00") : new Date(date);

  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const day = dateFormat.getDate();
  const month = dateFormat.getMonth() + 1;
  const year = dateFormat.getFullYear();
  const weekday = weekdays[dateFormat.getDay()];

  return `${weekday}, ${day} tháng ${month} ${year}`;
};
