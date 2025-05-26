import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { resizeSvg } from "../../utils/convertIconToSVG";
import { formatDate, getNights, getRatingText } from "../../utils/utility";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const LeftBooking = ({ bookingData, params }) => {
  const [showAccommodations, setShowAccommodations] = useState(false);
  const toggleAccommodations = () => {
    setShowAccommodations(!showAccommodations);
  };
  return (
    <div className="w-full space-y-4 lg:w-1/3">
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-sm font-[400]">
          {bookingData.properties.properties_type}
        </h2>
        <div className="mb-4">
          <h3 className="text-lg font-bold">{bookingData.properties.name}</h3>
          <p className="text-sm">{bookingData.properties.address}</p>
          {bookingData.properties.total_rating > 0 ? (
            <div className="mt-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-tl-md rounded-tr-md rounded-br-md bg-[#003b95]">
                <span className="text-sm font-bold text-white">
                  {bookingData.properties.rating}
                </span>
              </div>
              <span className="text-sm font-bold">
                {getRatingText(bookingData.properties.rating)}
              </span>
              <span className="ml-1 text-sm">
                {bookingData.properties.total_rating} đánh giá
              </span>
            </div>
          ) : (
            <div>
              <span>Chưa có điểm đánh giá</span>
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {bookingData.properties.amenities.map((amenity, index) => (
              <span key={index} className="flex items-center gap-1">
                <div
                  dangerouslySetInnerHTML={{
                    __html: resizeSvg(amenity.icon, 16, 16),
                  }}
                />
                <span className="text-[12px]">
                  {amenity.name.charAt(0).toUpperCase() + amenity.name.slice(1)}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="mb-2">
            <span className="text-l font-bold">Chi tiết đặt phòng của bạn</span>
          </div>
          <div className="mb-3 flex items-center justify-between gap-1">
            <div>
              <div className="mb-2 text-left text-sm font-[400]">
                Nhận phòng
              </div>
              <div className="flex items-center">
                <div className="flex flex-col">
                  <div className="text-md font-bold">
                    {formatDate(bookingData.check_in)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {bookingData.properties.check_in_time}
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[60px] w-[2px] bg-gray-200"></div>
            <div>
              <div className="mb-2 text-left text-sm font-[400]">Trả phòng</div>
              <div className="flex items-center">
                <div className="flex flex-col">
                  <div className="text-md font-bold">
                    {formatDate(bookingData.check_out)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {bookingData.properties.check_out_time}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm">
            <span className="font-[400]">Tổng thời gian lưu trú:</span>{" "}
            <span className="text-md font-bold">
              {getNights(bookingData.check_in, bookingData.check_out)} đêm
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-1 flex items-center">
                <div className="text-md font-bold">Bạn đã chọn</div>
              </div>
              <div className="mb-1 text-sm">
                <span className="text-[18px] font-bold">
                  {bookingData.accommodations.length} phòng cho{" "}
                  {bookingData.adults} người lớn{" "}
                  {bookingData.children > 0 &&
                    `và ${bookingData.children} trẻ em`}
                </span>
              </div>
            </div>
            <div>
              <span
                className="cursor-pointer p-2 transition-transform duration-300 ease-in-out"
                onClick={toggleAccommodations}
              >
                {showAccommodations ? (
                  <FaChevronUp className="text-blue-500" />
                ) : (
                  <FaChevronDown className="text-blue-500" />
                )}
              </span>
            </div>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showAccommodations ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {bookingData.accommodations.map((accommodation, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-100 py-2 text-sm last:border-0"
              >
                <span className="mr-2 font-[400]">
                  {accommodation.quantity} x
                </span>
                <span className="flex-1">{accommodation.name}</span>
              </div>
            ))}
          </div>
          <Link
            to={{
              pathname: `/properties/${bookingData.properties.id}/${bookingData.properties.name}/info`,
              search: `${params}`,
            }}
            className="ml-[-8px] inline max-w-[170px] cursor-pointer rounded-md px-2 py-1 duration-200 hover:bg-third/10"
          >
            <span className="inline-flex text-third">Đổi lựa chọn của bạn</span>
          </Link>
        </div>
      </div>

      <div className="rounded-lg bg-third/15 p-4 shadow">
        <h3 className="mb-2 text-lg font-bold">Tóm tắt giá</h3>
        <div className="mb-2 flex justify-between">
          <span>
            Giá cho {getNights(bookingData.check_in, bookingData.check_out)} đêm
          </span>
          <span></span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-2 text-2xl font-bold">
          <span>Tổng cộng</span>
          <span className="text-third">
            VND {bookingData.total_price.toLocaleString("vi-VN")}
          </span>
        </div>
        <div className="mt-1 text-right text-xs text-gray-500">
          Đã bao gồm thuế và phí
        </div>
      </div>
      <div className="rounded-lg bg-white p-4 shadow">
        <h3 className="mb-3 font-bold">Lịch thanh toán của bạn</h3>
        <div className="text-sm text-green-700">
          Không cần thanh toán hôm nay. Bạn sẽ trả khi đến nghỉ.
        </div>
      </div>
    </div>
  );
};

LeftBooking.propTypes = {
  bookingData: PropTypes.shape({
    properties: PropTypes.shape({
      properties_type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      total_rating: PropTypes.number.isRequired,
      rating: PropTypes.number.isRequired,
      amenities: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        }),
      ).isRequired,
      check_in_time: PropTypes.string.isRequired,
      check_out_time: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired,
    check_in: PropTypes.string.isRequired,
    check_out: PropTypes.string.isRequired,
    accommodations: PropTypes.arrayOf(
      PropTypes.shape({
        quantity: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ).isRequired,
    adults: PropTypes.number.isRequired,
    children: PropTypes.number.isRequired,
    total_price: PropTypes.number.isRequired,
  }).isRequired,
  params: PropTypes.string.isRequired,
};

export default LeftBooking;
