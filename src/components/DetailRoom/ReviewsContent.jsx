import React from "react";
const ReviewsContent = () => {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Đánh giá của khách</h2>
        <div className="flex items-center">
          <span className="rounded bg-blue-800 px-3 py-1 text-lg font-bold text-white">
            8,5
          </span>
          <div className="ml-3">
            <p className="font-medium">Rất tốt</p>
            <p className="text-sm text-gray-600">570 đánh giá</p>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Sạch sẽ</span>
            <div className="flex items-center">
              <div className="mr-2 h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: "85%" }}
                ></div>
              </div>
              <span className="text-sm font-medium">8,5</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Tiện nghi</span>
            <div className="flex items-center">
              <div className="mr-2 h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: "82%" }}
                ></div>
              </div>
              <span className="text-sm font-medium">8,2</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Vị trí</span>
            <div className="flex items-center">
              <div className="mr-2 h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: "90%" }}
                ></div>
              </div>
              <span className="text-sm font-medium">9,0</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Thoải mái</span>
            <div className="flex items-center">
              <div className="mr-2 h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: "87%" }}
                ></div>
              </div>
              <span className="text-sm font-medium">8,7</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Giá trị</span>
            <div className="flex items-center">
              <div className="mr-2 h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: "88%" }}
                ></div>
              </div>
              <span className="text-sm font-medium">8,8</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Nhân viên</span>
            <div className="flex items-center">
              <div className="mr-2 h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: "95%" }}
                ></div>
              </div>
              <span className="text-sm font-medium">9,5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sample reviews */}
      <div className="space-y-6">
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="mb-3 flex justify-between">
            <div className="flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500 font-bold text-white">
                M
              </div>
              <div>
                <p className="font-medium">Mai</p>
                <div className="flex items-center">
                  <img
                    src="src/assets/vn-language.png"
                    alt="Flag"
                    className="mr-1 h-3 w-4"
                  />
                  <span className="text-sm">Việt Nam</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="rounded bg-blue-800 px-2 py-1 font-bold text-white">
                9,2
              </div>
              <span className="mt-1 text-sm text-gray-600">Tuyệt vời</span>
            </div>
          </div>
          <p className="mb-2 text-sm">
            "Phòng rộng rãi, thoáng mát. Nhân viên vui vẻ, nhiệt tình, và dễ
            thương. Vị trí thuận tiện đi lại, gần các điểm tham quan."
          </p>
          <p className="text-xs text-gray-500">Đã đánh giá: 10 tháng 2, 2025</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <div className="mb-3 flex justify-between">
            <div className="flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
                T
              </div>
              <div>
                <p className="font-medium">Thanh</p>
                <div className="flex items-center">
                  <img
                    src="src/assets/vn-language.png"
                    alt="Flag"
                    className="mr-1 h-3 w-4"
                  />
                  <span className="text-sm">Việt Nam</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="rounded bg-blue-800 px-2 py-1 font-bold text-white">
                8,8
              </div>
              <span className="mt-1 text-sm text-gray-600">Rất tốt</span>
            </div>
          </div>
          <p className="mb-2 text-sm">
            "Phòng sạch sẽ, thoáng mát. Vị trí thuận tiện, dễ dàng tìm kiếm. Bữa
            sáng đa dạng. Nhân viên nhiệt tình, thân thiện."
          </p>
          <p className="text-xs text-gray-500">Đã đánh giá: 5 tháng 1, 2025</p>
        </div>
      </div>

      <button className="mt-6 w-full rounded-md border border-blue-600 py-3 font-medium text-blue-600 hover:bg-blue-50">
        Xem tất cả 570 đánh giá
      </button>
    </div>
  );
};
export default ReviewsContent;
