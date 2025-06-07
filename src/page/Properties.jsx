import { useState, useEffect, useRef } from "react";
import Banner from "../components/layout/Banner";
import PropertiesList from "../components/PropertiesList/PropertiesList";
import { TbArrowsSort } from "react-icons/tb";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { IoMapOutline } from "react-icons/io5";
import PropertiesFilter from "../components/PropertiesList/PropertiesFilter";
import PropertiesMap from "../components/PropertiesList/PropertiesMap";
import { setPageTitle, PAGE_TITLES } from "../utils/pageTitle";
import { useLocation } from "react-router-dom";
import axiosInstance from "../configuration/axiosCustomize";

const Properties = () => {
  const location = useLocation();
  const [properties, setProperties] = useState({
    data: [],
    meta: { total: 0 },
  });
  const [propertyIds, setPropertyIds] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialSearch, setIsInitialSearch] = useState(true);
  const [filters, setFilters] = useState(null);
  const [selectedSort, setSelectedSort] = useState(0);

  // Reference to track if we already fetched amenities
  const amenitiesLoaded = useRef(false);

  useEffect(() => {
    setPageTitle(PAGE_TITLES.PROPERTIES);
    window.scrollTo(0, 0);
  }, []);

  const searchParams = new URLSearchParams(location.search);
  const destination = searchParams.get("destination");
  const startDate = searchParams.get("checkin");
  const endDate = searchParams.get("checkout");
  const adults = searchParams.get("adults");
  const children = searchParams.get("children");
  const rooms = searchParams.get("rooms");

  // Define sort options
  const sortOptions = [
    {
      id: 0,
      label: "Lựa chọn hàng đầu của chúng tôi",
      sortBy: "",
    },
    {
      id: 1,
      label: "Giá (ưu tiên thấp nhất)",
      sortBy: "total_price:asc",
    },
    {
      id: 2,
      label: "Giá (ưu tiên cao nhất)",
      sortBy: "total_price:desc",
    },
    {
      id: 3,
      label: "Được đánh giá hàng đầu",
      sortBy: "rating:desc",
    },
    {
      id: 4,
      label: "Khoảng cách từ trung tâm",
      sortBy: "distance:asc",
    },
    {
      id: 5,
      label: "Được đánh giá tốt nhất và có giá thấp nhất",
      sortBy: "rating:desc,total_price:asc",
    },
  ];

  // Handler for filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handler for sort changes
  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
  };

  // Search for properties based on filters, sort and search params
  useEffect(() => {
    const searchProperties = async () => {
      if (!destination || !startDate || !endDate) return;

      setIsLoading(true);
      try {
        // Create params object for API request
        const params = {
          location: destination,
          start_date: startDate,
          end_date: endDate,
          adults,
          children,
          rooms,
        };

        // Add sort parameter if available
        if (sortOptions[selectedSort].sortBy) {
          params.sort = sortOptions[selectedSort].sortBy;
        }

        // Add filters if they exist
        if (filters) {
          // Add formatted filters string if available
          if (filters.filters && filters.filters.length > 0) {
            params.filters = filters.filters.join(",");
          }

          // Add price range filter
          if (filters.price_range) {
            params.price_range = filters.price_range;
          }
        }

        const response = await axiosInstance.get(`/properties/search`, {
          params,
        });
        const propertiesData = response.data.data || {
          data: [],
          meta: { total: 0 },
        };
        setProperties(propertiesData);

        // Extract property IDs for fetching amenities
        if (propertiesData.data && propertiesData.data.length > 0) {
          const ids = propertiesData.data.map(
            (property) => property.properties_id || property.id,
          );

          // Only update property IDs and trigger amenities fetch for initial search
          // or when we have different results (not just filtering the same properties)
          if (isInitialSearch || !arraysEqual(ids, propertyIds)) {
            setPropertyIds(ids);

            // Fetch amenities directly here for the initial search
            if (isInitialSearch) {
              fetchAmenities(ids);
              setIsInitialSearch(false);
            }
          }
        } else {
          setPropertyIds([]);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        setProperties({ data: [], meta: { total: 0 } });
        setPropertyIds([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchProperties();
  }, [
    destination,
    startDate,
    endDate,
    adults,
    children,
    rooms,
    filters,
    selectedSort,
  ]);

  // Helper function to compare arrays
  const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, idx) => val === sortedB[idx]);
  };

  // Separate function to fetch amenities
  const fetchAmenities = async (ids) => {
    if (!ids || ids.length === 0) {
      setAmenities([]);
      return;
    }

    try {
      const response = await axiosInstance.get("/amenities/properties", {
        params: {
          property_ids: ids.join(","),
        },
      });

      if (response.data.code === "M000") {
        setAmenities(response.data.data);
        amenitiesLoaded.current = true;
      }
    } catch (error) {
      console.error("Error fetching amenities:", error);
      setAmenities([]);
    }
  };

  // Fetch amenities when property IDs change, but only if it's not the initial search
  useEffect(() => {
    // Only fetch amenities when propertyIds change AND it's not the initial search
    // This prevents duplicate API calls on first load
    if (
      !isInitialSearch &&
      propertyIds.length > 0 &&
      !amenitiesLoaded.current
    ) {
      fetchAmenities(propertyIds);
    }
  }, [propertyIds, isInitialSearch]);

  // Format search params for child components
  const formattedSearchParams = new URLSearchParams({
    checkin: startDate,
    checkout: endDate,
    adults: adults,
    children: children,
    rooms: rooms,
  }).toString();

  return (
    <>
      <Banner showTitle={false} />
      <div className="mx-auto my-0 flex max-w-[1110px] min-w-[620px] flex-col px-2 pt-[10px] lg:flex-auto lg:shrink-0 lg:grow lg:flex-row">
        {/* Sort, Filter, Map < 768px */}
        <div className="w-full text-third lg:hidden">
          <div className="flex items-center justify-between px-4 py-2">
            <button
              className="flex min-h-[36px] grow cursor-pointer items-center justify-center gap-1 rounded-lg px-2 py-1 outline-third duration-200 hover:bg-[#f0f6fd]"
              type="button"
            >
              <span>
                <span>
                  <TbArrowsSort />
                </span>
              </span>
              <span>Sắp xếp</span>
            </button>
            <button
              className="flex min-h-[36px] grow cursor-pointer items-center justify-center gap-1 rounded-lg px-2 py-1 outline-third duration-200 hover:bg-[#f0f6fd]"
              type="button"
            >
              <span>
                <span>
                  <HiOutlineAdjustmentsHorizontal />
                </span>
              </span>
              <span>Lọc</span>
            </button>
            <button
              className="flex min-h-[36px] grow cursor-pointer items-center justify-center gap-1 rounded-lg px-2 py-1 outline-third duration-200 hover:bg-[#f0f6fd]"
              type="button"
            >
              <span>
                <span>
                  <IoMapOutline />
                </span>
              </span>
              <span>Bản đồ</span>
            </button>
          </div>
        </div>
        {/* Sort, Filter, Map > 768px */}
        <div className="mr-4 hidden flex-col lg:block lg:w-[30%]">
          <PropertiesMap properties={properties.data} />
          <PropertiesFilter
            onFilterChange={handleFilterChange}
            amenities={amenities}
          />
        </div>
        <PropertiesList
          properties={properties}
          isLoading={isLoading}
          destination={destination}
          searchParams={formattedSearchParams}
          onSortChange={handleSortChange}
          selectedSort={selectedSort}
          sortOptions={sortOptions}
        />
      </div>
    </>
  );
};

export default Properties;
