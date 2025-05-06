import PropTypes from "prop-types";
import { FaBed } from "react-icons/fa";
import { Link } from "react-router";

const PropertiesVerticalItem = ({ property, getRatingText }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Image container with wishlist button */}
      <div className="relative overflow-hidden">
        <img
          src={property?.image}
          alt={property?.name}
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
        <div className="flex h-full flex-col items-center gap-2">
          <div className="flex w-full flex-col">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="flex-1 text-lg font-bold text-blue-600">
                {property?.name}
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
              <div className="ml-2 flex items-center text-sm text-gray-600">
                <span className="font-medium">
                  {getRatingText(property.rating)}
                </span>
                <span className="mx-1"> · </span>
                <span>{property?.reviews} đánh giá</span>
              </div>
            </div>
            <div className="text-[12px]">
              <Link to={`/properties/`} target="_blank">
                <span className="text-[12px] text-third">
                  <span className="underline">{property?.location}</span>
                  <span className="px-1"></span>
                  <span className="underline">Xem trên bản đồ</span>
                </span>
              </Link>
              <span>
                <span className="px-1"></span>
                <span>Cách trung tâm {property?.centre}</span>
              </span>
              {property?.beachDistance && (
                <span>
                  <span className="px-1"></span>
                  <span>Cách bãi biển {property?.beachDistance}</span>
                </span>
              )}
            </div>
          </div>

          {/* Property Detail */}
          <div className="flex w-full flex-1 shrink grow flex-col">
            {/* Accommodation type */}
            <div className="flex-1">
              <div className="mb-3">
                <h4 className="font-medium">{property?.accommodation}</h4>
                {property?.details && (
                  <p className="text-sm text-gray-600">{property?.details}</p>
                )}
                {property?.beds && (
                  <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                    <FaBed />
                    <span>{property?.beds}</span>
                  </div>
                )}
              </div>

              {/* Features (optional) */}
              {property?.breakfastIncluded && (
                <div className="mb-2 text-sm font-medium text-green-600">
                  Bữa sáng miễn phí
                </div>
              )}

              {/* Payment options */}
              {property?.paymentOption && (
                <div className="mb-2 flex items-center gap-1 text-sm text-green-600">
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                  </svg>
                  <span>{property?.paymentOption}</span>
                </div>
              )}

              {/* Availability info */}
              {property?.availability && (
                <div className="mt-1 mb-2 text-sm text-red-600">
                  Chỉ còn {property?.availability}{" "}
                  {property?.accommodationType === "room" ? "phòng" : "căn"} với
                  giá này trên trang của chúng tôi
                </div>
              )}
            </div>

            {/* Bottom section with CTA and Price */}
            <div className="mt-4 w-full items-end justify-between">
              {/* Price information - styled at bottom right */}
              <div className="text-right">
                {property?.oldPrice && (
                  <div className="text-sm text-gray-500 line-through">
                    {property?.oldPrice}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900">
                    {property?.price}
                  </span>
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

PropertiesVerticalItem.propTypes = {
  property: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    featuredTag: PropTypes.string,
    rating: PropTypes.number,
    reviews: PropTypes.number,
    location: PropTypes.string,
    centre: PropTypes.string,
    beachDistance: PropTypes.string,
    accommodationType: PropTypes.string,
    accommodation: PropTypes.string,
    details: PropTypes.string,
    beds: PropTypes.number,
    breakfastIncluded: PropTypes.bool,
    paymentOption: PropTypes.string,
    availability: PropTypes.number,
    oldPrice: PropTypes.string,
    price: PropTypes.string,
    taxAndFee: PropTypes.string,
  }).isRequired,
  getRatingText: PropTypes.func.isRequired,
};

export default PropertiesVerticalItem;
