import PropertiesHorizontalItem from "./PropertiesHorizontalItem";
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import PropertiesVerticalItem from "./PropertiesVerticalItem";
import { BsGrid3X3Gap } from "react-icons/bs";
import { FaListUl } from "react-icons/fa";
import { RiArrowDropDownLine, RiArrowUpDownFill } from "react-icons/ri";
import { getRatingText } from "../../utils/utility";
import { useLocation } from "react-router";

const VIEW_MODE_KEY = "properties-view-mode";

const PropertiesList = ({
  properties,
  isLoading,
  destination,
  searchParams,
  onSortChange,
  selectedSort,
  sortOptions,
}) => {
  const [isHorizontal, setIsHorizontal] = useState(() => {
    // Try to get saved preference from localStorage, default to true if not found
    try {
      const savedMode = localStorage.getItem(VIEW_MODE_KEY);
      return savedMode === null ? true : savedMode === "horizontal";
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return true;
    }
  });

  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef(null);
  const location = useLocation();

  // Save view mode to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        VIEW_MODE_KEY,
        isHorizontal ? "horizontal" : "vertical",
      );
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [isHorizontal]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSortSelect = (option) => {
    onSortChange(option.id);
    setShowSortDropdown(false);
  };

  const toggleViewMode = (horizontal) => {
    setIsHorizontal(horizontal);
  };

  // Extract city name safely
  const cityName =
    destination && typeof destination === "string"
      ? destination.split(", ")[0]
      : "Địa điểm";

  // Get total properties count safely
  const totalProperties = properties?.meta?.total || 0;

  return (
    <div className="w-full lg:flex-auto lg:shrink-1 lg:grow">
      <div className="flex flex-wrap items-center justify-between gap-2 p-3">
        <h2 className="mb-3 text-2xl font-bold">
          {`${cityName}: tìm thấy ${totalProperties} chỗ nghỉ`}
        </h2>

        {/* View mode toggle - Desktop */}
        <div className="hidden self-end sm:mb-0 lg:block">
          <div className="flex overflow-hidden rounded-md border border-gray-300">
            <button
              className={`flex items-center gap-1.5 px-4 py-2 transition-colors duration-200 ${
                isHorizontal
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => toggleViewMode(true)}
              aria-pressed={isHorizontal}
              aria-label="View in horizontal mode"
            >
              <BsGrid3X3Gap size={14} />
              <span className="text-sm font-medium">Xem ngang</span>
            </button>
            <button
              className={`flex items-center gap-1.5 border-l border-gray-300 px-4 py-2 transition-colors duration-200 ${
                !isHorizontal
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => toggleViewMode(false)}
              aria-pressed={!isHorizontal}
              aria-label="View in vertical mode"
            >
              <FaListUl size={14} />
              <span className="text-sm font-medium">Xem dọc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Improved Sort Dropdown Component */}
      <div
        className="relative mb-3 hidden cursor-pointer lg:block"
        ref={sortDropdownRef}
      >
        <button
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          onClick={() => setShowSortDropdown(!showSortDropdown)}
        >
          <RiArrowUpDownFill className="text-gray-500" />
          <span>Sắp xếp theo: {sortOptions[selectedSort].label}</span>
          <RiArrowDropDownLine
            className={`text-xl transition-transform ${showSortDropdown ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {showSortDropdown && (
          <div className="absolute top-full left-0 z-20 mt-1 w-72 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
            {sortOptions.map((option, index) => (
              <div
                key={index}
                className={`cursor-pointer px-4 py-3 text-sm hover:bg-blue-50 ${selectedSort === option.id ? "bg-blue-100" : ""}`}
                onClick={() => handleSortSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        /* Properties List with proper className based on view mode */
        <div
          className={
            !isHorizontal
              ? "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
              : "space-y-4"
          }
        >
          {properties.data && properties.data.length > 0 ? (
            properties.data.map((property) =>
              isHorizontal ? (
                <PropertiesHorizontalItem
                  key={property.id || property.properties_id}
                  property={property}
                  getRatingText={getRatingText}
                  searchParams={searchParams}
                />
              ) : (
                <PropertiesVerticalItem
                  key={property.id || property.properties_id}
                  property={property}
                  getRatingText={getRatingText}
                  searchParams={searchParams}
                />
              ),
            )
          ) : (
            <div className="col-span-full py-8 text-center text-gray-500">
              Không tìm thấy kết quả phù hợp với yêu cầu của bạn
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Update PropTypes to match actual component usage
PropertiesList.propTypes = {
  properties: PropTypes.shape({
    data: PropTypes.array,
    meta: PropTypes.shape({
      total: PropTypes.number,
    }),
  }),
  isLoading: PropTypes.bool.isRequired,
  destination: PropTypes.string,
  searchParams: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  selectedSort: PropTypes.number.isRequired,
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      sortBy: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

PropertiesList.defaultProps = {
  properties: { data: [], meta: { total: 0 } },
  destination: "Địa điểm",
};

export default PropertiesList;
