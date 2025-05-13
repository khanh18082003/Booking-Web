import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { IoLocationOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

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

const PropertiesMap = ({ properties = [] }) => {
  const [map, setMap] = useState(null);
  const [modalMap, setModalMap] = useState(null);
  const [location, setLocation] = useState({
    lat: 10.8231,
    lng: 106.6297,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [bounds, setBounds] = useState(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Memoize callbacks
  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Callbacks for modal map
  const onModalMapLoad = useCallback((map) => {
    setModalMap(map);
  }, []);

  const onModalMapUnmount = useCallback(() => {
    setModalMap(null);
  }, []);

  const fetchLocation = useCallback(async (destination) => {
    if (!destination) {
      console.log("No destination found");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: destination,
            key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          },
        },
      );

      if (response.data.status === "OK" && response.data.results.length > 0) {
        const locationData = response.data.results[0].geometry.location;
        const newLocation = {
          lat: Number(locationData.lat),
          lng: Number(locationData.lng),
        };

        setLocation(newLocation);
      } else {
        console.error("Geocoding error:", response.data.status);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calculate bounds for properties
  const calculateMapBounds = useCallback(
    (map) => {
      if (
        map &&
        properties.length > 0 &&
        properties.some((p) => p.latitude && p.longitude)
      ) {
        const bounds = new window.google.maps.LatLngBounds();

        // Add main location
        bounds.extend(location);

        // Add all property locations
        properties.forEach((property) => {
          if (property.latitude && property.longitude) {
            bounds.extend({
              lat: Number(property.latitude),
              lng: Number(property.longitude),
            });
          }
        });

        // Store bounds for later use
        setBounds(bounds);
        return bounds;
      }
      return null;
    },
    [location, properties],
  );

  // Effect to handle modalMap bounds when opened
  useEffect(() => {
    if (isMapModalOpen && modalMap) {
      const bounds = calculateMapBounds(modalMap);
      if (bounds) {
        // Add a small delay to ensure the map is fully rendered
        setTimeout(() => {
          modalMap.fitBounds(bounds);
        }, 100);
      }
    }
  }, [isMapModalOpen, modalMap, calculateMapBounds]);

  useEffect(() => {
    let destination = null;

    try {
      const searchParamsStr = localStorage.getItem("booking_search_params");
      if (searchParamsStr) {
        const searchParams = JSON.parse(searchParamsStr);
        destination = searchParams?.destination;
      }
    } catch (error) {
      console.error("Error parsing search params:", error);
    }

    if (!destination) {
      destination = localStorage.getItem("destination");
    }

    if (destination) {
      fetchLocation(destination);
    } else {
      setIsLoading(false);
    }
  }, [fetchLocation]);

  // Open modal handler
  const handleOpenMapModal = () => {
    setIsMapModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  // Close modal handler
  const handleCloseMapModal = () => {
    setIsMapModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && isMapModalOpen) {
        handleCloseMapModal();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
      // Make sure to re-enable scrolling if component unmounts while modal is open
      document.body.style.overflow = "auto";
    };
  }, [isMapModalOpen]);

  if (loadError) {
    return (
      <div className="flex h-[170px] items-center justify-center rounded-lg bg-gray-100">
        <p className="text-gray-500">Error loading maps</p>
      </div>
    );
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="flex h-[170px] items-center justify-center rounded-lg bg-gray-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-1 overflow-hidden rounded-lg">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={14}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* Property markers if available */}
          {properties.map(
            (property) =>
              property.latitude &&
              property.longitude && (
                <Marker
                  key={property.id}
                  position={{
                    lat: Number(property.latitude),
                    lng: Number(property.longitude),
                  }}
                  title={property.name}
                />
              ),
          )}
        </GoogleMap>
      </div>

      <div className="absolute top-[64%] left-[50%] flex w-full translate-x-[-50%] transform justify-center">
        <button
          className="flex h-[36px] cursor-pointer items-center justify-center gap-1 rounded-lg bg-secondary px-2 py-1 text-sm font-semibold text-white outline-third duration-200 hover:bg-third"
          onClick={handleOpenMapModal}
        >
          <IoLocationOutline className="text-xl" />
          <span>Hiển thị trên bản đồ</span>
        </button>
      </div>

      {/* Full-screen Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-5xl rounded-lg bg-white p-4 shadow-xl">
            {/* Modal header */}
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Bản đồ khu vực</h3>
              <button
                onClick={handleCloseMapModal}
                className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <IoMdClose className="text-2xl" />
              </button>
            </div>

            {/* Modal map */}
            <div className="overflow-hidden rounded-lg">
              <GoogleMap
                mapContainerStyle={modalMapContainerStyle}
                center={location}
                zoom={14}
                options={{
                  ...mapOptions,
                  mapTypeControl: true,
                }}
                onLoad={onModalMapLoad}
                onUnmount={onModalMapUnmount}
              >
                {/* Property markers if available */}
                {properties.map(
                  (property) =>
                    property.latitude &&
                    property.longitude && (
                      <Marker
                        key={property.id}
                        position={{
                          lat: Number(property.latitude),
                          lng: Number(property.longitude),
                        }}
                        title={property.properties_name}
                      />
                    ),
                )}
              </GoogleMap>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

PropertiesMap.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
  ),
};

export default PropertiesMap;
