import React from "react";
const NotesContent = () => {
  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">Ghi chú</h2>
      <div className="mb-4 rounded-md bg-blue-50 p-4">
        <h3 className="mb-2 font-medium text-blue-700">Thông tin quan trọng</h3>
        <p className="text-sm">
          Vui lòng thông báo trước cho Shogun Hotel về thời gian đến dự kiến của
          quý khách. Quý khách có thể sử dụng ô Yêu cầu đặc biệt khi đặt phòng
          hoặc liên hệ trực tiếp với khách sạn qua thông tin liên lạc được ghi
          trong xác nhận đặt phòng.
        </p>
      </div>
      <div>
        <h3 className="mb-2 font-medium">Đặc điểm nổi bật</h3>
        <p className="mb-4 text-sm">
          Shogun Hotel nằm ở vị trí thuận tiện, cách các điểm tham quan chính
          của TP. Hồ Chí Minh chỉ vài phút đi bộ và đi xe. Khách sạn được thiết
          kế theo phong cách Nhật Bản với nội thất gỗ ấm cúng và không gian
          thoáng đãng.
        </p>
      </div>
    </div>
  );
};
export default NotesContent;
