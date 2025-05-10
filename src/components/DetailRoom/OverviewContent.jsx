import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Share,
  Star,
  MapPin,
  ArrowRight,
  Coffee,
  Server,
} from "react-feather";
import { add } from "date-fns";

const OverviewContent = ({ hotelData }) => {
  return (
    <div className="mx-auto w-full max-w-[1140px]">
      {/* Hotel Title and Rating */}
      <div className="p-6">
        <div className="mb-2 flex items-center">
          <div className="mr-2 flex items-center rounded bg-amber-400 px-2 py-1 text-sm text-white">
            <Star size={16} />
            <Star size={16} />
            <Star size={16} />
          </div>
          <span className="text-sm text-gray-600">Xe đưa đón sân bay</span>
        </div>

        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">{hotelData.title}</h1>
          <div className="flex space-x-2">
            <button className="rounded-md border p-2">
              <Heart size={20} className="text-gray-400" />
            </button>
            <button className="rounded-md border p-2">
              <Share size={20} className="text-gray-400" />
            </button>
            <button className="rounded-md bg-blue-600 px-4 py-2 text-white">
              Đặt ngay
            </button>
          </div>
        </div>

        {/* Location */}
        <div className="mt-2 flex items-center text-gray-600">
          <MapPin size={18} className="mr-2 text-blue-500" />
          <p className="text-sm">
            {hotelData.address} -
            <span className="text-blue-500"> Vị trí tuyệt vời</span> -
            <span className="text-blue-500"> Hiển thị bản đồ</span>
          </p>
        </div>
      </div>

      {/* Hotel Images Grid */}
      <div className="mb-6 grid grid-cols-3 gap-2 px-6">
        <div className="col-span row-span-1 h-64 overflow-hidden rounded-md">
          <img
            src="src/img/494872778.jpg"
            alt="Room view"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="col-span row-span-1 h-64 overflow-hidden rounded-md">
          <img
            src="src/img/494876728.jpg"
            alt="Room interior"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="col-span row-span-1 h-64 overflow-hidden rounded-md">
          <img
            src="src/img/494876731.jpg"
            alt="Bathroom"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Thumbnail row */}
        <div className="col-span-3 mt-2 flex space-x-2">
          <div className="h-16 w-24 overflow-hidden rounded-md">
            <img
              src="src/img/494876740.jpg"
              alt="Food"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-16 w-24 overflow-hidden rounded-md">
            <img
              src="src/img/494880434.jpg"
              alt="Living area"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-16 w-24 overflow-hidden rounded-md">
            <img
              src="src/img/541647187.jpg"
              alt="Dining"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-16 w-24 overflow-hidden rounded-md">
            <img
              src="src/img/651864311.jpg"
              alt="Reception"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="relative h-16 w-24 overflow-hidden rounded-md">
            <img
              src="src/img/651864311.jpg"
              alt="More photos"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            {/* Genius Discount Info */}
            <div className="mb-6 text-sm">
              <p className="mb-2">
                Bạn có thể đủ điều kiện hưởng giảm giá Genius tại Shogun Hotel.
                Để biết giảm giá Genius có áp dụng cho ngày bạn đã chọn hay
                không, hãy{" "}
                <span className="min-h-[36px] rounded-[4px] bg-white leading-7">
                  <Link to="/login">
                    <span className="text-[14px] font-light text-third">
                      Đăng nhập
                    </span>
                  </Link>
                </span>
              </p>
              <p className="mb-2">
                Giảm giá Genius tại chỗ nghỉ này tùy thuộc vào ngày đặt phòng,
                ngày lưu trú và các ưu đãi có sẵn khác.
              </p>
              <p className="mb-4">
                Nằm ở TP. Hồ Chí Minh, cách Bảo tàng Mỹ thuật 1.9 km, Shogun
                Hotel cung cấp chỗ nghỉ có sân hiên, chỗ đậu xe riêng miễn phí
                và nhà hàng. Khách sạn 3 sao này có máy ATM, dịch vụ tiền sảnh.
                Chỗ nghỉ cung cấp lễ tân 24/24, dịch vụ đưa đón sân bay, dịch vụ
                phòng và Wi-Fi miễn phí ở toàn bộ chỗ nghỉ.
              </p>
              <p className="mb-4">
                Với phòng tắm riêng được trang bị với xít/chậu rửa và đồ vệ sinh
                cá nhân miễn phí, một số phòng tại khách sạn cũng có view thành
                phố. Tại Shogun Hotel, tất cả các phòng đều có ga trải giường và
                khăn tắm.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            {/* Amenities */}
            <div className="mb-4">
              <h3 className="mb-4 text-lg font-bold">
                Điểm nổi bật của chỗ nghỉ
              </h3>

              <div className="mb-3 flex items-start">
                <Coffee size={24} className="mt-1 mr-3 text-gray-700" />
                <div>
                  <h4 className="font-medium">Có bữa sáng</h4>
                  <p className="text-sm text-gray-600">Bữa sáng ngon</p>
                </div>
              </div>

              <div className="mb-3 flex items-start">
                <div>
                  <h4 className="font-medium">Dịch vụ đưa đón</h4>
                  <p className="text-sm text-gray-600">Xe đưa đón sân bay</p>
                </div>
              </div>

              <div className="mb-3 flex items-start">
                <div>
                  <h4 className="font-medium">Chỗ đậu xe</h4>
                  <p className="text-sm text-gray-600">
                    Bãi đỗ xe miễn phí, Bãi đỗ xe riêng,
                  </p>
                  <p className="text-sm text-gray-600">
                    Bãi đỗ xe trong khuôn viên
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Server size={24} className="mt-1 mr-3 text-gray-700" />
                <div>
                  <h4 className="font-medium">Tắm nhanh</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OverviewContent;
