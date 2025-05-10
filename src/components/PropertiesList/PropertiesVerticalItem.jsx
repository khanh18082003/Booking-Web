import PropTypes from "prop-types";
import { BsInfoCircle } from "react-icons/bs";
import { FaBed } from "react-icons/fa";
import { Link } from "react-router";

const PropertiesVerticalItem = ({ property, getRatingText }) => {
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
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Image container with wishlist button */}
      <div className="relative overflow-hidden">
        <img
          src={property.image}
          alt={property.properties_name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <button className="absolute top-2 right-2 rounded-full bg-white p-2 text-gray-600 hover:bg-gray-100">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      {/* Content section */}
      <div className="flex-1 p-4">
        {/* Header with name and rating */}
        <div className="flex h-full flex-col items-center gap-1">
          <div className="flex w-full flex-col border-b border-gray-200 pb-2">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="flex-1 text-lg font-bold text-blue-600 hover:text-black active:text-[#b10a0a]">
                {property.properties_name}
              </h3>
            </div>
            <div className="mb-2 flex w-full items-center">
              <div className="text-xs text-gray-600">
                <div className="flex h-8 w-8 items-center justify-center rounded-tl-md rounded-tr-md rounded-br-md bg-[#003b95]">
                  <span className="text-sm font-bold text-white">
                    {property.rating}
                  </span>
                </div>
              </div>
              <div className="ml-2 flex items-center text-sm">
                <span className="font-medium">
                  {getRatingText(property.rating)}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-1 text-[12px]">
              <Link to={`/properties/`} target="_blank">
                <span className="text-[12px] text-third">
                  <span className="underline">{`${property.district} ${property.district && ","} ${property.city}`}</span>
                  <span className="px-2"></span>
                  <span className="underline">Xem trên bản đồ</span>
                </span>
              </Link>
              <span>
                <span>
                  Cách trung tâm{" "}
                  {property.distance > 1000
                    ? `${(property.distance / 1000).toFixed(1)} km`
                    : `${property.distance} m`}
                </span>
              </span>
              <span className="rounded bg-[#008234] px-1 py-[1px] text-[12px] text-white">
                Ưu đãi mùa du lịch
              </span>
            </div>
          </div>

          {/* Property Detail */}
          <div className="flex w-full flex-1 shrink grow flex-col">
            {/* Accommodation type */}
            <div className="flex-1">
              <span className="rounded-[6px] border-1 px-1 py-[1px] text-[12px] font-light">
                <span>Được đề xuất cho nhóm của bạn</span>
              </span>
              <div className="mb-3">
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
                          <div className="flex items-center gap-1">
                            <span className="text-xl">
                              <FaBed />
                            </span>
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
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-xl">
                              <FaBed />
                            </span>
                            <span>
                              {accommodation.total_beds}{" "}
                              {accommodation.bed_names &&
                                accommodation.bed_names[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features (optional) */}
              {property?.breakfastIncluded && (
                <div className="mb-2 text-sm font-medium text-green-600">
                  Bữa sáng miễn phí
                </div>
              )}
            </div>

            {/* Bottom section with CTA and Price */}
            <div className="mt-4 w-full items-end justify-between">
              {/* Price information - styled at bottom right */}
              <div className="text-right">
                <div className="flex flex-col">
                  <div className="text-xs text-gray-500">
                    {property.nights} đêm, {property.adults} người lớn
                    {property.children !== 0
                      ? `, ${property.children} trẻ em`
                      : ""}
                  </div>
                  <div className="flex items-center justify-end">
                    <div className="text-xl font-bold">
                      {formatPrice(property.total_price)}
                    </div>
                    <BsInfoCircle className="ml-1 text-gray-400" size={14} />
                  </div>
                  <span className="text-xs text-gray-500">
                    {property?.taxAndFee}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesVerticalItem;
