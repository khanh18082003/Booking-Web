import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const PropertiesFilter = ({ onFilterChange, amenities }) => {
  // State for accommodation types
  const [accommodationTypes, setAccommodationTypes] = useState({
    hotel: false,
    villa: false,
    apartment: false,
    resort: false,
  });

  // State for price range
  const [priceRange, setPriceRange] = useState([100000, 3000000]);

  // State for selected amenities
  const [selectedAmenities, setSelectedAmenities] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Update selected amenities when amenities prop changes
  useEffect(() => {
    if (amenities && amenities.length > 0) {
      const amenitiesObj = { ...selectedAmenities };
      amenities.forEach((amenity) => {
        if (amenitiesObj[amenity.id] === undefined) {
          amenitiesObj[amenity.id] = false;
        }
      });
      setSelectedAmenities(amenitiesObj);
    }
  }, [amenities]);

  // Handle accommodation type checkbox change
  const handleAccommodationChange = (e) => {
    const { name, checked } = e.target;
    const updatedTypes = { ...accommodationTypes, [name]: checked };
    setAccommodationTypes(updatedTypes);

    // Call the parent component's callback with updated filters
    updateFilters(updatedTypes, selectedAmenities, priceRange);
  };

  // Handle amenity checkbox change
  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    const updatedAmenities = { ...selectedAmenities, [name]: checked };
    setSelectedAmenities(updatedAmenities);

    // Call the parent component's callback with updated filters
    updateFilters(accommodationTypes, updatedAmenities, priceRange);
  };

  // Handle price range change
  const handlePriceChange = (e) => {
    const { id, value } = e.target;
    let newPriceRange;

    if (id === "min-price") {
      const minPrice = parseInt(value);
      // Ensure minPrice doesn't exceed maxPrice
      newPriceRange = [
        Math.min(minPrice, priceRange[1] - 10000),
        priceRange[1],
      ];
    } else {
      const maxPrice = parseInt(value);
      // Ensure maxPrice is at least 10000 more than minPrice
      newPriceRange = [
        priceRange[0],
        Math.max(maxPrice, priceRange[0] + 10000),
      ];
    }

    setPriceRange(newPriceRange);

    // Don't update filters immediately on every slider move to avoid excessive API calls
    // Use a debounce effect instead
  };

  // Debounce effect for price range changes
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters(accommodationTypes, selectedAmenities, priceRange);
    }, 500);

    return () => clearTimeout(timer);
  }, [priceRange]);

  // Format price as VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Helper function to update filters
  const updateFilters = (accTypes, amenitiesObj, priceRange) => {
    // Format for properties_type filters
    const propertyTypeFilters = [];

    // Add selected property types to the filter array
    if (accTypes.hotel) propertyTypeFilters.push("properties_type:Hotel");
    if (accTypes.villa) propertyTypeFilters.push("properties_type:Villa");
    if (accTypes.apartment)
      propertyTypeFilters.push("properties_type:Apartment");
    if (accTypes.resort) propertyTypeFilters.push("properties_type:Resort");

    // Format for amenities filters - using name instead of ID
    const amenityFilters = Object.entries(amenitiesObj)
      .filter(([id, isSelected]) => isSelected)
      .map(([id]) => {
        // Find the amenity object with this ID to get its name
        const amenity = amenities.find((a) => a.id === id);
        // Use the amenity name for the filter if found, otherwise use the ID as fallback
        return `amenities:${amenity ? amenity.name : id}`;
      });

    // Combine all filters into a single array
    const allFilters = [...propertyTypeFilters, ...amenityFilters];

    // Create the filter object
    const filters = {
      filters: allFilters.length > 0 ? allFilters : undefined,
      price_range: `${priceRange[0]},${priceRange[1]}`,
    };

    // Call the parent component's callback with the filter object
    onFilterChange(filters);
  };

  return (
    <div
      className="flex flex-col overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm"
      style={{
        scrollbarWidth: "thin",
        height: "calc(100vh - 150px)",
      }}
    >
      {/* Fixed header section */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-4">
        <h3 className="text-lg font-bold text-gray-800">Bộ lọc</h3>
      </div>

      {/* Scrollable content section */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Accommodation Types section */}
        <div className="mb-6">
          <h4 className="mb-3 font-semibold text-gray-800">Loại chỗ nghỉ</h4>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center">
              <input
                type="checkbox"
                name="hotel"
                checked={accommodationTypes.hotel}
                onChange={handleAccommodationChange}
                className="mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Khách sạn</span>
            </label>
            <label className="flex cursor-pointer items-center">
              <input
                type="checkbox"
                name="villa"
                checked={accommodationTypes.villa}
                onChange={handleAccommodationChange}
                className="mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Villa</span>
            </label>
            <label className="flex cursor-pointer items-center">
              <input
                type="checkbox"
                name="apartment"
                checked={accommodationTypes.apartment}
                onChange={handleAccommodationChange}
                className="mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Căn hộ</span>
            </label>
            <label className="flex cursor-pointer items-center">
              <input
                type="checkbox"
                name="resort"
                checked={accommodationTypes.resort}
                onChange={handleAccommodationChange}
                className="mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Resort</span>
            </label>
          </div>
        </div>

        {/* Price Range section */}
        <div className="mb-6 border-t border-gray-200 pt-6">
          <h4 className="mb-3 font-semibold text-gray-800">
            Ngân sách của bạn (mỗi đêm)
          </h4>
          <div className="mb-4 text-sm text-gray-700">
            VND {formatPrice(priceRange[0])} - VND {formatPrice(priceRange[1])}
            {priceRange[1] >= 3000000 ? "+" : ""}
          </div>

          {/* Price range slider */}
          <div className="relative mt-6 mb-2">
            {/* Price bar background */}
            <div className="h-1 w-full rounded-full bg-gray-200"></div>

            {/* Active price range */}
            <div
              className="absolute h-1 rounded-full bg-blue-500"
              style={{
                left: `${((priceRange[0] - 0) / 3000000) * 100}%`,
                right: `${100 - ((priceRange[1] - 0) / 3000000) * 100}%`,
              }}
            ></div>

            {/* Min price handle */}
            <div
              className="absolute -mt-1.5 h-4 w-4 cursor-pointer rounded-full bg-blue-500"
              style={{
                left: `calc(${((priceRange[0] - 0) / 3000000) * 100}% - 8px)`,
              }}
            ></div>

            {/* Max price handle */}
            <div
              className="absolute -mt-1.5 h-4 w-4 cursor-pointer rounded-full bg-blue-500"
              style={{
                left: `calc(${((priceRange[1] - 0) / 3000000) * 100}% - 8px)`,
              }}
            ></div>

            {/* Hidden input sliders (for actual functionality) */}
            <input
              type="range"
              id="min-price"
              min="0"
              max="3000000"
              step="50000"
              value={priceRange[0]}
              onChange={handlePriceChange}
              className="absolute h-1 w-full cursor-pointer opacity-0"
            />
            <input
              type="range"
              id="max-price"
              min="0"
              max="3000000"
              step="50000"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="absolute h-1 w-full cursor-pointer opacity-0"
            />
          </div>
        </div>

        {/* Amenities section */}
        <div className="mb-6 border-t border-gray-200 pt-6">
          <h4 className="mb-3 font-semibold text-gray-800">Tiện nghi</h4>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {amenities && amenities.length > 0 ? (
                amenities.map((amenity) => (
                  <label
                    key={amenity.id}
                    className="flex cursor-pointer items-center"
                  >
                    <input
                      type="checkbox"
                      name={amenity.id}
                      checked={selectedAmenities[amenity.id] || false}
                      onChange={handleAmenityChange}
                      className="mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex w-full items-center justify-between">
                      <span className="text-sm text-gray-700">
                        {amenity.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {amenity.quantity}
                      </span>
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  Không có tiện nghi nào cho các chỗ nghỉ này
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Apply filters button */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4">
        <button
          onClick={() =>
            updateFilters(accommodationTypes, selectedAmenities, priceRange)
          }
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-center font-medium text-white transition hover:bg-blue-700"
        >
          Áp dụng bộ lọc
        </button>
      </div>
    </div>
  );
};

PropertiesFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  amenities: PropTypes.array,
};

PropertiesFilter.defaultProps = {
  amenities: [],
};

export default PropertiesFilter;
