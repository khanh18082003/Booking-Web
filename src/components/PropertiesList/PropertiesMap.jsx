import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { IoLocationOutline } from "react-icons/io5";

const PropertiesMap = () => {
  // Google Map configuration
  const containerStyle = {
    width: "100%",
    height: "170px",
  };

  const center = {
    lat: 10.346, // Example coordinates for Vung Tau, Vietnam
    lng: 107.084,
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBIFd57sMvn5ZJLfk4-NTQLxST6DQYfwPw",
  });
  return (
    <div className="relative mb-1 overflow-hidden rounded-lg">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          options={{
            zoomControl: false,
          }}
        >
          {/* Child components, such as markers, info windows, etc. */}
          <></>
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
      {/* Map controls similar to booking.com */}
      <div className="absolute bottom-1/5 left-1/2 z-10 flex w-full translate-x-[-50%] justify-center">
        <button
          className="flex cursor-pointer items-center rounded-sm bg-blue-600 px-3 py-1 text-sm leading-7 whitespace-nowrap text-white"
          onClick={() =>
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`,
              "_blank",
            )
          }
        >
          <span className="material-icons mr-1 text-sm">
            <IoLocationOutline />
          </span>
          Hiển thị trên bản đồ
        </button>
      </div>
    </div>
  );
};

export default PropertiesMap;
