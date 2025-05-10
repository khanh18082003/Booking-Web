import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import { BsInfoCircle } from "react-icons/bs";
import { AiOutlineArrowRight } from "react-icons/ai";
import { FiHeart } from "react-icons/fi";

const PropertiesHorizontalItem = ({ property, getRatingText }) => {
  // formatting VND price
  const formatPrice = (price) => {
    if (!price && price !== 0) return "VND 0";

    // Convert to number if it's a string
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;

    // Format with thousand separators (without currency symbol)
    const formattedNumber = new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 0,
    }).format(numericPrice);

    // Return with VND at the beginning
    return `VND ${formattedNumber}`;
  };
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-[#e7e7e7] bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex">
        {/* Image section - improved styling */}
        <div className="relative h-[240px] w-[240px] flex-shrink-0 overflow-hidden">
          <Link
            to={`/properties/${property.properties_id}`}
            className="block h-full w-full"
          >
            <img
              src={property.image}
              alt={property.properties_name}
              className="h-full w-full rounded-[8px] object-cover"
            />
          </Link>
          <button
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-100"
            aria-label="Save to favorites"
          >
            <FiHeart size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Content section */}
        <div className="ml-4 flex flex-1 flex-col gap-1.5 py-1">
          {/* Top section */}
          <div className="flex items-start justify-between">
            {/* Hotel name and location */}
            <div className="flex-1">
              <div className="flex items-center">
                <Link to={`/properties/${property.properties_id}`}>
                  <h3 className="text-xl font-bold text-[#006ce4] hover:text-[#00487a] active:text-[#b10a0a]">
                    {property.properties_name}
                  </h3>
                </Link>
              </div>

              <div className="mt-1 flex items-center text-[12px]">
                <Link
                  to={`/properties/${property.id}`}
                  className="text-[#006ce4] underline"
                >
                  {`${property.district} ${property.district && ","} ${property.city}`}
                </Link>
                <Link
                  to={`/map/${property.properties_id}`}
                  className="ml-2 text-[#006ce4] underline"
                >
                  Xem trên bản đồ
                </Link>
                <span className="mx-2 text-gray-400">·</span>
                <span className="text-gray-500">
                  Cách trung tâm{" "}
                  {property.distance > 1000
                    ? `${(property.distance / 1000).toFixed(1)} km`
                    : `${property.distance} m`}
                </span>
              </div>

              {/* Tags section */}
              <div className="mt-2 flex items-center">
                {property.beachDistance && (
                  <div className="mr-2 flex items-center text-xs text-gray-600">
                    <IoLocationOutline className="mr-0.5" />
                    <span>Cách bãi biển {property.beachDistance}</span>
                  </div>
                )}
                {property.specialTag && (
                  <div className="ml-1 inline-flex items-center rounded bg-[#008009] px-2 py-0.5 text-xs font-medium text-white">
                    {property.specialTag}
                  </div>
                )}
              </div>
            </div>

            {/* Rating section */}
            <div className="flex items-center">
              <div className="mr-2 text-right">
                <div className="font-medium">
                  {getRatingText(property.rating)}
                </div>
                <div className="text-xs text-gray-500">
                  {property.total_rating} đánh giá
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-tl-md rounded-tr-md rounded-br-md bg-[#003b95]">
                <span className="text-sm font-bold text-white">
                  {property.rating}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-1 text-[12px]">
            <span className="rounded bg-[#008234] px-1 py-[1px] text-[12px] text-white">
              Ưu đãi mùa du lịch
            </span>
          </div>

          {/* Bottom section with room details and price */}
          <div className="flex justify-between pt-1">
            {/* Room details */}
            <div className="max-w-[350px] flex-1">
              <span className="rounded-[6px] border-1 px-1 py-[1px] text-[12px] font-light">
                <span>Được đề xuất cho nhóm của bạn</span>
              </span>
              <div>
                {property.accommodations.map((accommodation) => (
                  <div key={accommodation.accommodation_id}>
                    <h4>
                      {property.accommodations.length > 1 ? (
                        <>
                          <span className="text-[14px]">
                            {accommodation.suggested_quantity}×
                          </span>
                          <span className="text-[14px] font-semibold">
                            {accommodation.accommodation_name}
                          </span>
                        </>
                      ) : (
                        <span>{accommodation.accommodation_name}</span>
                      )}
                    </h4>
                    <div className="mt-1 ml-2 flex items-center text-[13px]">
                      {accommodation.bed_names &&
                      accommodation.bed_names.length > 1 ? (
                        <span>
                          {accommodation.total_beds} giường (
                          {accommodation.bed_names.map((bed, index) => (
                            <span key={index}>
                              {bed}
                              {index < accommodation.bed_names.length - 1
                                ? ", "
                                : ""}
                            </span>
                          ))}
                          )
                        </span>
                      ) : (
                        <span>
                          {accommodation.total_beds}{" "}
                          {accommodation.bed_names &&
                            accommodation.bed_names[0]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price section */}
            <div className="flex flex-col items-end">
              <div className="text-right">
                <div className="text-xs text-gray-500">
                  {property.nights} đêm, {property.adults} người lớn
                  {`${property.children !== 0 && `, ${property.children} trẻ em`}`}
                </div>

                <div className="flex items-center justify-end">
                  <div className="text-xl font-bold">
                    {formatPrice(property.total_price)}
                  </div>
                  <BsInfoCircle className="ml-1 text-gray-400" size={14} />
                </div>
                <div className="text-xs text-gray-500">
                  {property.taxAndFee}
                </div>
              </div>
              <Link
                to={`/properties/${property.properties_id}`}
                className="mt-2 flex items-center justify-center rounded-md bg-[#006ce4] px-4 py-2 font-medium text-white hover:bg-[#00487a]"
              >
                <span>Xem chỗ trống</span>
                <AiOutlineArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesHorizontalItem;
