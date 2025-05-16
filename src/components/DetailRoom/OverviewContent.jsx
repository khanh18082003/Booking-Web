import React, { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Share, Star, MapPin, ArrowRight, Server } from "react-feather";
import PropTypes from "prop-types";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { IoLocationOutline } from "react-icons/io5";
import { TiLocation } from "react-icons/ti";
import { setPageTitle } from "../../utils/pageTitle";
const containerStyle = {
  width: "100%",
  height: "170px",
};

// Larger container style for the modal map
const modalMapContainerStyle = {
  width: "100%",
  height: "80vh",
  maxHeight: "700px",
};

const mapOptions = {
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

const OverviewContent = ({ hotelData }) => {
  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 10.762622,
    lng: 106.660172,
  }); // Default to Ho Chi Minh City

  useEffect(() => {
    setPageTitle(hotelData.name);
  }, []);

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
          <div className="flex space-x-2">
            <button className="rounded-md border p-2">
              <Heart size={20} className="text-gray-400" />
            </button>
            <button className="rounded-md border p-2">
              <Share size={20} className="text-gray-400" />
            </button>
            <button className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white">
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
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Thumbnails row */}
              <div
                className={`grid grid-cols-${hotelData.image_urls.length - 1} gap-2`}
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
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ),
                )}
              </div>
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
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="grid h-85 grid-rows-2 gap-2">
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={hotelData.image_urls[1] || hotelData.image}
                      alt={`${hotelData.name} view 1`}
                      className="w-full object-cover"
                    />
                  </div>

                  {/* Right column bottom image */}
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={hotelData.image_urls[2] || hotelData.image}
                      alt={`${hotelData.name} view 2`}
                      className="w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom row with 5 smaller images */}
              <div
                className={`mt-2 grid grid-cols-${hotelData.image_urls.length - 3 <= 5 ? hotelData.image_urls.length - 3 : 5} gap-2`}
              >
                {[3, 4, 5, 6, 7].map(
                  (index) =>
                    index < hotelData.image_urls.length && (
                      <div
                        key={index}
                        className="h-25 overflow-hidden rounded-md"
                      >
                        <img
                          src={hotelData.image_urls[index]}
                          alt={`Property image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ),
                )}
              </div>

              {/* More photos button */}
              {hotelData.image_urls.length > 7 && (
                <div className="mt-2 text-right">
                  <button className="flex items-center justify-end text-sm font-medium text-blue-600">
                    +{hotelData.image_urls.length - 7} ảnh{" "}
                    <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Column - Reviews and Map */}
        <div className="flex flex-col gap-2">
          {/* Rating card */}
          <div className="mb-4 flex-1 rounded-lg bg-blue-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-bold">Đánh giá</h3>
              <div className="flex items-center">
                <div className="mr-2 flex items-center rounded bg-blue-600 px-2 py-1 text-white">
                  <span className="text-sm font-bold">7.9</span>
                </div>
                <span className="text-sm font-medium">Tốt</span>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-center text-yellow-400">
                <Star size={16} fill="#FBBF24" />
                <Star size={16} fill="#FBBF24" />
                <Star size={16} fill="#FBBF24" />
                <Star size={16} fill="#FBBF24" />
                <Star size={16} stroke="#FBBF24" fill="none" />
              </div>
            </div>
            <p className="text-xs text-gray-600">48 đánh giá</p>

            {/* Sample review */}
            <div className="mt-3 border-t pt-3">
              <p className="text-sm italic">
                "Phòng rộng, mới và đẹp. Giường cũng êm. Mình đến vào 2h sáng,
                vẫn có người mở cửa."
              </p>
              <div className="mt-2 flex items-center">
                <div className="mr-2 h-6 w-6 rounded-full bg-gray-300 text-center text-xs leading-6">
                  N
                </div>
                <span className="text-xs">Nghĩa - Việt Nam</span>
              </div>
            </div>
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
            {/* Genius Discount Info */}
            <div className="mb-6 text-sm">
              <p className="mb-2">
                Bạn có thể đủ điều kiện hưởng giảm giá Genius tại{" "}
                {hotelData.name || "khách sạn này"}. Để biết giảm giá Genius có
                áp dụng cho ngày bạn đã chọn hay không, hãy{" "}
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
              <p className="mb-4">{hotelData.description}</p>
              <p className="mb-4">
                Với phòng tắm riêng được trang bị với xít/chậu rửa và đồ vệ sinh
                cá nhân miễn phí, một số phòng tại khách sạn cũng có view thành
                phố. Tại {hotelData.name || "khách sạn này"}, tất cả các phòng
                đều có ga trải giường và khăn tắm.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            {/* Amenities */}
            <div className="mb-4">
              <h3 className="mb-4 text-lg font-bold">
                Điểm nổi bật của chỗ nghỉ
              </h3>

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

OverviewContent.propTypes = {
  hotelData: PropTypes.object,
};

export default OverviewContent;
