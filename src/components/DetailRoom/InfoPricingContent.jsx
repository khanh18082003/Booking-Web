import React from "react";
import FormSearchBox from "../FormSearchBox/FormSearchBox";
const InfoPricingContent = () => {
  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">Thông tin & giá</h2>
      <div className="overflow-hidden rounded-md border">
        <table className="w-full">
          <thead>
            <tr>
              <th className="border-r border-[#57a6f4] bg-[#4c76b2] p-3 text-left text-white">
                Loại chỗ nghỉ
              </th>
              <th className="border-r border-[#57a6f4] bg-[#4c76b2] p-3 text-left text-white">
                Số lượng khách
              </th>
              <th className="border-r border-[#57a6f4] bg-[#4c76b2] p-3 text-white"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="border-r border-[#57a6f4] p-4">
                <div>
                  <p className="mb-1 font-medium text-blue-600">
                    ▸ Phòng Deluxe Có Giường Cỡ Queen
                  </p>
                  <p className="text-sm">
                    1 giường đôi <span className="ml-1">🛏️</span>
                  </p>
                </div>
              </td>
              <td className="border-r border-[#57a6f4] p-4">
                <div className="flex items-center">
                  <span className="mr-1">👤👤</span>
                </div>
              </td>
              <td className="p-4 text-right">
                <button className="rounded-md bg-blue-600 px-4 py-2 text-white">
                  Hiển thị giá
                </button>
              </td>
            </tr>

            <tr className="border-b">
              <td className="border-r border-[#57a6f4] p-4">
                <div>
                  <p className="mb-1 font-medium text-blue-600">
                    ▸ Phòng 3 Người Nhìn Ra Thành Phố
                  </p>
                  <p className="text-sm">
                    1 giường đôi cực lớn <span className="ml-1">🛏️</span>
                  </p>
                </div>
              </td>
              <td className="border-r border-[#57a6f4] p-4">
                <div className="flex items-center">
                  <span className="mr-1">👤👤👤</span> +{" "}
                  <span className="ml-1">👤</span>
                  {/* Tooltip Container */}
                  <div className="group relative ml-1">
                    {/* Icon "i" */}
                    <span className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-gray-400 text-xs text-gray-500">
                      i
                    </span>

                    {/* Tooltip */}
                    <div className="absolute bottom-7 left-1/2 w-max max-w-xs -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Tối đa 3 khách, trong đó tối đa 3 người lớn.
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-right">
                <button className="rounded-md bg-blue-600 px-4 py-2 text-white">
                  Hiển thị giá
                </button>
              </td>
            </tr>

            <tr className="border-b">
              <td className="border-r border-[#57a6f4] p-4">
                <div>
                  <p className="mb-1 font-medium text-blue-600">
                    ▸ Phòng Tiêu Chuẩn Có 2 Giường Cỡ Queen
                  </p>
                  <p className="text-sm">
                    2 giường đôi lớn <span className="ml-1">🛏️</span>
                  </p>
                </div>
              </td>
              <td className="border-r border-[#57a6f4] p-4">
                <div className="flex items-center">
                  <span className="mr-1">👤</span> × 4 +{" "}
                  <span className="ml-1">👤👤👤</span>
                  <div className="group relative ml-1">
                    {/* Icon "i" */}
                    <span className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-gray-400 text-xs text-gray-500">
                      i
                    </span>

                    {/* Tooltip */}
                    <div className="absolute bottom-7 left-1/2 w-max max-w-xs -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Tối đa 4 khách, trong đó tối đa 3 người lớn.
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-right">
                <button className="rounded-md bg-blue-600 px-4 py-2 text-white">
                  Hiển thị giá
                </button>
              </td>
            </tr>

            <tr className="border-b">
              <td className="border-r border-[#57a6f4] p-4">
                <div>
                  <p className="mb-1 font-medium text-blue-600">
                    ▸ Phòng Đơn Có Phòng Tắm Riêng
                  </p>
                  <p className="text-sm">
                    1 giường đơn <span className="ml-1">🛏️</span>
                  </p>
                </div>
              </td>
              <td className="border-r border-[#57a6f4] p-4">
                <div className="flex items-center">
                  <span className="mr-1">👤</span>
                </div>
              </td>
              <td className="p-4 text-right">
                <button className="rounded-md bg-blue-600 px-4 py-2 text-white">
                  Hiển thị giá
                </button>
              </td>
            </tr>

            <tr>
              <td className="border-r border-[#57a6f4] p-4">
                <div>
                  <p className="mb-1 font-medium text-blue-600">
                    ▸ Phòng Deluxe
                  </p>
                  <p className="text-sm">
                    1 giường đôi <span className="ml-1">🛏️</span>
                  </p>
                </div>
              </td>
              <td className="border-r border-[#57a6f4] p-4">
                <div className="flex items-center">
                  <span className="mr-1">👤👤</span> +{" "}
                  <span className="ml-1">👤</span>
                  <div className="group relative ml-1">
                    {/* Icon "i" */}
                    <span className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-gray-400 text-xs text-gray-500">
                      i
                    </span>

                    {/* Tooltip */}
                    <div className="absolute bottom-7 left-1/2 w-max max-w-xs -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Tối đa 2 khách, trong đó tối đa 1 người lớn.
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-right">
                <button className="rounded-md bg-blue-600 px-4 py-2 text-white">
                  Hiển thị giá
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default InfoPricingContent;
