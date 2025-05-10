const AmenitiesContent = () => {
  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">Tiện nghi</h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
        <div>
          <h3 className="mb-3 font-medium">Tiện nghi phòng</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>Máy
              điều hòa
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>TV
              màn hình phẳng
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
              Minibar
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
              Phòng tắm riêng
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
              WiFi miễn phí
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-medium">Dịch vụ</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>Lễ
              tân 24/24
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
              Dịch vụ phòng
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>Đưa
              đón sân bay
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
              Giặt ủi
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-medium">Tiện ích chung</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>Nhà
              hàng
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>Bãi
              đỗ xe
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>Sân
              hiên
            </li>
            <li className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>Máy
              ATM
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default AmenitiesContent;
