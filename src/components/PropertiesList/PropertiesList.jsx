import PropertiesHorizontalItem from "./PropertiesHorizontalItem";
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import PropertiesVerticalItem from "./PropertiesVerticalItem";
import { BsGrid3X3Gap } from "react-icons/bs";
import { FaListUl } from "react-icons/fa";
import { RiArrowDropDownLine, RiArrowUpDownFill } from "react-icons/ri";
import { getRatingText } from "../../utils/utility";
const VIEW_MODE_KEY = "properties-view-mode";

const PropertiesList = (props) => {
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
  const [selectedSort, setSelectedSort] = useState(
    "Lựa chọn hàng đầu của chúng tôi",
  );
  const sortDropdownRef = useRef(null);

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

  const sortOptions = [
    "Lựa chọn hàng đầu của chúng tôi",
    "Ưu tiên nhà & căn hộ",
    "Giá (ưu tiên thấp nhất)",
    "Giá (ưu tiên cao nhất)",
    "Được đánh giá tốt nhất và có giá thấp nhất",
    "Xếp hạng chỗ nghỉ (cao đến thấp)",
    "Xếp hạng chỗ nghỉ (thấp đến cao)",
    "Xếp hạng chỗ nghỉ và giá",
  ];

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
    setSelectedSort(option);
    setShowSortDropdown(false);
  };

  const toggleViewMode = (horizontal) => {
    setIsHorizontal(horizontal);
  };

  return (
    <>
      {/* Right Column: Properties List */}
      <div className="w-full lg:flex-auto lg:shrink-1 lg:grow">
        <div className="flex items-center justify-between p-3">
          <h2 className="mb-3 text-2xl font-bold">
            {`${props.destination.split(", ")[0]}: tìm thấy ${props.total ? props.total : 0} chỗ nghỉ`}
          </h2>

          {/* Improved toggle switch */}
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
            <span>Sắp xếp theo: {selectedSort}</span>
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
                  className={`cursor-pointer px-4 py-3 text-sm hover:bg-blue-50 ${selectedSort === option ? "bg-blue-100" : ""}`}
                  onClick={() => handleSortSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Properties List with proper className based on view mode */}
        <div
          className={
            !isHorizontal
              ? "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
              : "space-y-4"
          }
        >
          {props.propertiesList.map((property) =>
            isHorizontal ? (
              <PropertiesHorizontalItem
                key={property.properties_id}
                property={property}
                getRatingText={getRatingText}
                searchParams={props.searchParams}
              />
            ) : (
              <PropertiesVerticalItem
                key={property.id}
                property={property}
                getRatingText={getRatingText}
                searchParams={props.searchParams}
              />
            ),
          )}
        </div>
      </div>
    </>
  );
};
PropertiesList.propTypes = {
  propertiesList: PropTypes.array.isRequired,
  destination: PropTypes.string.isRequired,
  total: PropTypes.number, // Add validation for total
  meta: PropTypes.shape({
    total: PropTypes.number.isRequired,
  }).isRequired,
  searchParams: PropTypes.object, // Add validation for searchParams
};

export default PropertiesList;
