import { memo, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { IoLocationOutline } from "react-icons/io5";

// Define these outside component to prevent recreations
const containerStyle = {
  width: "100%",
  height: "170px",
};

const defaultCenter = {
  lat: 10.346,
  lng: 107.084,
};

const mapOptions = {
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

// Using memo for performance optimization
const PropertiesMap = memo(({ location = defaultCenter, properties = [] }) => {
  const [map, setMap] = useState(null);

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

  // Error handling
  if (loadError) {
    return (
      <div className="flex h-[170px] items-center justify-center rounded-lg bg-gray-100">
        <p className="text-gray-500">Error loading maps</p>
      </div>
    );
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex h-[170px] items-center justify-center rounded-lg bg-gray-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative mb-1 overflow-hidden rounded-lg">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={14}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Main location marker */}
        <Marker position={location} />

        {/* Property markers if available */}
        {properties.map(
          (property) =>
            property.location && (
              <Marker
                key={property.id}
                position={property.location}
                title={property.name}
              />
            ),
        )}
      </GoogleMap>

      {/* Map zoom controls */}
      <div className="absolute right-2 bottom-2 z-10">
        <button
          className="mb-1 flex h-8 w-8 items-center justify-center rounded bg-white text-gray-700 shadow-md hover:bg-gray-100"
          onClick={() => map?.setZoom((map.getZoom() || 14) + 1)}
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          className="flex h-8 w-8 items-center justify-center rounded bg-white text-gray-700 shadow-md hover:bg-gray-100"
          onClick={() => map?.setZoom((map.getZoom() || 14) - 1)}
          aria-label="Zoom out"
        >
          -
        </button>
      </div>

      {/* Location indicator */}
      <div className="absolute bottom-2 left-2 z-10 flex items-center rounded bg-white/90 px-2 py-1 text-sm text-gray-700 shadow-sm">
        <IoLocationOutline className="mr-1" />
        <span>Map view</span>
      </div>
    </div>
  );
});

PropertiesMap.displayName = "PropertiesMap";

export default PropertiesMap;
