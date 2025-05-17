import { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "react-feather";
import PropTypes from "prop-types";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { IoLocationOutline } from "react-icons/io5";
import { TiLocation } from "react-icons/ti";
import { setPageTitle } from "../../utils/pageTitle";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";

const containerStyle = {
  width: "100%",
  height: "170px",
};

const mapOptions = {
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

const OverviewContent = ({ hotelData, reviewsData }) => {
  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 10.762622,
    lng: 106.660172,
  }); // Default to Ho Chi Minh City
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    setPageTitle(hotelData.name);
  }, []);

  const handleNextReview = () => {
    if (reviewsData && reviewsData.data && reviewsData.data.length > 0) {
      setCurrentReviewIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevReview = () => {
    if (reviewsData && reviewsData.data && reviewsData.data.length > 0) {
      setCurrentReviewIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  // Set map center based on hotel coordinates when available
  useEffect(() => {
    if (hotelData && hotelData.latitude && hotelData.longitude) {
      setMapCenter({
        lat: parseFloat(hotelData.latitude),
        lng: parseFloat(hotelData.longitude),
      });
    } else if (hotelData && hotelData.address) {
      // You could potentially use a geocoding service here to get coordinates from address
      console.log(
        "Hotel coordinates not available, using address for display only",
      );
    }
  }, [hotelData]);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Render the map with error handling
  const renderMap = () => {
    if (loadError) {
      return (
        <div className="flex h-40 items-center justify-center bg-gray-100 text-red-500">
          <p>Map cannot be loaded right now, sorry.</p>
        </div>
      );
    }

    if (!isLoaded) {
      return (
        <div className="flex h-40 items-center justify-center bg-gray-100">
          <p>Loading map...</p>
        </div>
      );
    }

    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={14}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker position={mapCenter} icon={<TiLocation />} />
      </GoogleMap>
    );
  };

  return (
    <div className="mx-auto w-full">
      {/* Hotel Title and Rating */}
      <div className="px-6 py-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">
            {hotelData.name || "Hotel Name"}
          </h1>
          <Link
            to={`/properties/${hotelData.id}/${hotelData.name}/info`}
            className="flex space-x-2"
          >
            <button className="cursor-pointer rounded-md bg-third px-4 py-2 text-white duration-200 hover:bg-secondary">
              Đặt ngay
            </button>
          </Link>
        </div>

        {/* Location */}
        <div className="mt-2 flex items-center text-gray-600">
          <MapPin size={18} className="mr-2 text-third" />
          <p className="text-sm">
            {hotelData.address} -
            <span className="text-third"> Vị trí tuyệt vời</span> -
            <span className="text-third"> Hiển thị bản đồ</span>
          </p>
        </div>
      </div>

      {/* Hotel Images Grid - Left-Right Layout */}
      <div className="mb-6 grid grid-cols-1 gap-4 px-6 md:grid-cols-4">
        {/* Left Column - Images */}
        <div className="md:col-span-3">
          {hotelData.image_urls && hotelData.image_urls.length <= 6 ? (
            <>
              <div className="mb-2 h-85 w-full overflow-hidden rounded-lg">
                <img
                  src={hotelData.image_urls[0]}
                  alt={`${hotelData.name} main view`}
                  className="h-full w-full cursor-pointer object-cover"
                  loading="lazy"
                />
              </div>

              {(() => {
                // Calculate how many images we have to display (after the first 3)
                const remainingImagesCount = Math.min(
                  hotelData.image_urls.length - 1,
                  5,
                );

                // If we don't have any images to display in this row, return null
                if (remainingImagesCount <= 0) return null;

                // Render the grid with the appropriate columns based on image count
                return (
                  <div
                    className={`mt-2 grid gap-2 ${
                      remainingImagesCount === 1
                        ? "grid-cols-1"
                        : remainingImagesCount === 2
                          ? "grid-cols-2"
                          : remainingImagesCount === 3
                            ? "grid-cols-3"
                            : remainingImagesCount === 4
                              ? "grid-cols-4"
                              : "grid-cols-5"
                    }`}
                  >
                    {[1, 2, 3, 4, 5].map(
                      (index) =>
                        index < hotelData.image_urls.length && (
                          <div
                            key={index}
                            className="h-25 overflow-hidden rounded-md"
                          >
                            <img
                              src={hotelData.image_urls[index]}
                              alt={`Property image ${index + 1}`}
                              className="h-full w-full cursor-pointer object-cover"
                              loading="lazy"
                            />
                          </div>
                        ),
                    )}
                  </div>
                );
              })()}
            </>
          ) : (
            <>
              {/* Layout for more than 6 images - based on the provided screenshot */}
              <div className="grid h-85 grid-cols-3">
                {/* Large left image */}
                <div className="col-span-2 row-span-2 mr-2 overflow-hidden rounded-lg">
                  <img
                    src={hotelData.image_urls[0] || hotelData.image}
                    alt={`${hotelData.name} main view`}
                    className="h-full w-full cursor-pointer object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="grid h-85 grid-rows-2 gap-2">
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={hotelData.image_urls[1] || hotelData.image}
                      alt={`${hotelData.name} view 1`}
                      className="w-full cursor-pointer object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Right column bottom image */}
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={hotelData.image_urls[2] || hotelData.image}
                      alt={`${hotelData.name} view 2`}
                      className="w-full cursor-pointer object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom row with smaller images - Grid adjusts based on available images */}
              {(() => {
                // Calculate how many images we have to display (after the first 3)
                const remainingImagesCount = Math.min(
                  hotelData.image_urls.length - 3,
                  5,
                );

                // If we don't have any images to display in this row, return null
                if (remainingImagesCount <= 0) return null;

                // Render the grid with the appropriate columns based on image count
                return (
                  <div
                    className={`mt-2 grid gap-2 ${
                      remainingImagesCount === 1
                        ? "grid-cols-1"
                        : remainingImagesCount === 2
                          ? "grid-cols-2"
                          : remainingImagesCount === 3
                            ? "grid-cols-3"
                            : remainingImagesCount === 4
                              ? "grid-cols-4"
                              : "grid-cols-5"
                    }`}
                  >
                    {[3, 4, 5, 6, 7].map(
                      (index) =>
                        index < hotelData.image_urls.length && (
                          <div
                            key={index}
                            className="relative h-25 overflow-hidden rounded-md"
                          >
                            <img
                              src={hotelData.image_urls[index]}
                              alt={`Property image ${index + 1}`}
                              className="h-full w-full cursor-pointer object-cover"
                              loading="lazy"
                            />
                            {index === 7 && hotelData.image_urls.length > 8 && (
                              <div className="absolute top-0 left-0 flex h-full w-full cursor-pointer items-center justify-center text-white">
                                <div className="h-full w-full bg-black opacity-30"></div>
                                <span className="absolute font-extrabold underline">
                                  +{hotelData.image_urls.length - 8} ảnh
                                </span>
                              </div>
                            )}
                          </div>
                        ),
                    )}
                  </div>
                );
              })()}
            </>
          )}
        </div>

        {/* Right Column - Reviews and Map */}
        <div className="flex flex-col gap-2">
          {/* Rating card */}
          <div className="mb-4 flex flex-1 flex-col rounded-lg border-1 border-gray-300 bg-white p-3">
            {reviewsData && reviewsData?.data.length > 0 ? (
              <>
                <div className="mb-2 flex justify-end border-b-1 border-gray-300 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-md font-[400]">
                        {hotelData.rating >= 9
                          ? "Tuyệt vời"
                          : hotelData.rating >= 8
                            ? "Rất tốt"
                            : hotelData.rating >= 7
                              ? "Tốt"
                              : "Hài lòng"}
                      </span>
                      <span className="text-sm text-gray-600">
                        {hotelData.total_rating} đánh giá
                      </span>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-tl-md rounded-tr-md rounded-br-md bg-[#003b95]">
                      <span className="text-md font-bold text-white">
                        {hotelData.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top review */}
                <div className="relative flex flex-1 flex-col">
                  <div
                    onClick={handlePrevReview}
                    className={`${currentReviewIndex === 0 && "hidden"} absolute top-[50%] left-[-10px] translate-y-[-50%] cursor-pointer rounded-full p-1 duration-200 hover:bg-gray-200`}
                  >
                    <MdOutlineChevronLeft className="text-2xl" />
                  </div>
                  <div
                    onClick={handleNextReview}
                    className={`${currentReviewIndex === reviewsData.data.length - 1 && "hidden"} absolute top-[50%] right-[-10px] translate-y-[-50%] cursor-pointer rounded-full p-1 duration-200 hover:bg-gray-200`}
                  >
                    <MdOutlineChevronRight className="text-2xl" />
                  </div>
                  <h4 className="mb-1 text-[12px] font-[400]">
                    Khách lưu trú ở đây thích điều gì?
                  </h4>
                  <p className="mx-4 text-[12px] italic">
                    &quot;{reviewsData.data[currentReviewIndex].review}&quot;
                  </p>
                  <div className="mt-2 ml-4 flex flex-1 items-end">
                    <div className="flex items-center">
                      <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-center text-xs leading-6">
                        <img
                          src={
                            reviewsData.data[currentReviewIndex]?.avatar ||
                            "/src/assets/kh.png"
                          }
                          alt="Avatar"
                          className="h-8 w-8 rounded-full"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">
                          {reviewsData.data[currentReviewIndex]?.name || "KH"}
                        </span>
                        <div className="flex items-center">
                          {reviewsData.data[currentReviewIndex]?.nationality ===
                            "Vietnam" && (
                            <>
                              <img
                                src="/src/assets/vn-language.png"
                                alt="Vietnam flag"
                                className="mr-1 h-3 w-4"
                              />
                              <span className="text-xs text-gray-600">
                                {reviewsData.data[currentReviewIndex]
                                  ?.nationality || "Việt Nam"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="mb-3 text-base font-bold">
                  Chưa có điểm đánh giá...
                </h3>
                <div className="flex items-start">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                    <span className="text-xs">!</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Chúng tôi cần ít nhất 1 đánh giá để có thể tính điểm đánh
                    giá. Nếu bạn đặt phòng và đánh giá chỗ nghỉ, bạn có thể giúp{" "}
                    {hotelData.name} đạt được mục tiêu này.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Map card */}
          <div className="relative overflow-hidden rounded-lg border-gray-200 shadow-md">
            <div className="bg-gray-200">{renderMap()}</div>
            <div className="absolute top-[64%] left-[50%] flex w-full translate-x-[-50%] transform justify-center">
              <button
                className="flex h-[36px] cursor-pointer items-center justify-center gap-1 rounded-lg bg-secondary px-2 py-1 text-sm font-semibold text-white outline-third duration-200 hover:bg-third"
                // onClick={handleOpenMapModal}
              >
                <IoLocationOutline className="text-xl" />
                <span>Hiển thị trên bản đồ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-6 text-sm">
              <div
                dangerouslySetInnerHTML={{ __html: hotelData.description }}
              />{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

OverviewContent.propTypes = {
  hotelData: PropTypes.object.isRequired,
  reviewsData: PropTypes.object.isRequired,
};

export default OverviewContent;
