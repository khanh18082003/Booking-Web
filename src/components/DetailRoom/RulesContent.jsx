const RulesContent = () => {
  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">Quy tắc chung</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 font-medium">Thời gian</h3>
          <div className="mb-2 flex justify-between">
            <span className="text-sm">Nhận phòng:</span>
            <span className="text-sm font-medium">14:00 - 00:00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Trả phòng:</span>
            <span className="text-sm font-medium">Đến 12:00</span>
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-medium">Quy định khác</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <div className="mt-1.5 mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
              <span>Không hút thuốc</span>
            </li>
            <li className="flex items-start">
              <div className="mt-1.5 mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
              <span>Không cho phép thú cưng</span>
            </li>
            <li className="flex items-start">
              <div className="mt-1.5 mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
              <span>Tiệc tùng không được phép</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default RulesContent;
