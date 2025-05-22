import { useState, useEffect } from "react";
import OverviewContent from "../components/DetailRoom/OverviewContent";
import InfoPricingContent from "../components/DetailRoom/InfoPricingContent";
import AmenitiesContent from "../components/DetailRoom/AmenitiesContent";
import RulesContent from "../components/DetailRoom/RulesContent";
import NotesContent from "../components/DetailRoom/NotesContent";
import ReviewsContent from "../components/DetailRoom/ReviewsContent";
import Banner from "../components/layout/Banner";
import { useParams, useNavigate, useLocation, Outlet } from "react-router-dom";
import axios from "../utils/axiosCustomize";
import { setPageTitle } from "../utils/pageTitle";

const RoomDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [hotelData, setHotelData] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);
  const [error, setError] = useState(null);

  // Use location to determine active tab from URL
  const location = useLocation();
  const navigate = useNavigate();

  // Get active tab from URL path
  const path = location.pathname.split("/");
  const activeTab = path[path.length - 1] || "overview";

  // Preserve the search parameters when switching tabs
  const searchParams = location.search;

  const tabs = [
    { id: "overview", label: "Tổng quan" },
    { id: "info", label: "Thông tin & giá" },
    { id: "amenities", label: "Tiện nghi" },
    { id: "rules", label: "Quy tắc chung" },
    { id: "notes", label: "Ghi chú" },
    { id: "reviews", label: "Đánh giá của khách", count: 570 },
  ];

  // Get property id from URL
  const { id, propertiesName } = useParams();
  useEffect(() => {
    setPageTitle(propertiesName);
  }, []);
  // Fetch property data from API
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await axios.get(`/properties/${id}`);

        if (response.data.code === "M000") {
          const propertyData = response.data.data;
          setHotelData(propertyData);
          setError(null);
        } else {
          setError("Failed to load property details.");
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("An error occurred while loading property details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  // Fetch reviews data when component mounts - now fetch for all tabs, not just reviews tab
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;

      try {
        setReviewsLoading(true);
        const response = await axios.get(`/properties/${id}/reviews`);

        if (response.data.code === "M000") {
          const reviews = response.data.data;
          setReviewsData(reviews);
        } else {
          console.error("Failed to load reviews:", response.data.message);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  // Function to handle tab changes
  const handleTabChange = (tabId) => {
    navigate(`/properties/${id}/${propertiesName}/${tabId}${searchParams}`);
  };

  // Function to render the appropriate content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewContent hotelData={hotelData} reviewsData={reviewsData} />
        );
      case "info":
        return <InfoPricingContent hotelData={hotelData} />;
      case "amenities":
        return <AmenitiesContent hotelData={hotelData} />;
      case "rules":
        return <RulesContent hotelData={hotelData} />;
      case "notes":
        return <NotesContent hotelData={hotelData} />;
      case "reviews":
        return (
          <ReviewsContent
            hotelData={hotelData}
            reviewsData={reviewsData}
            isLoading={reviewsLoading}
          />
        );
      default:
        return (
          <OverviewContent hotelData={hotelData} reviewsData={reviewsData} />
        );
    }
  };

  return (
    <>
      <Banner showTitle={false} />
      <div className="mx-auto mt-[-20px] max-w-[1110px] overflow-hidden rounded-lg bg-white">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="flex animate-pulse flex-col items-center space-y-4">
              <div className="h-8 w-1/2 rounded bg-gray-200"></div>
              <div className="h-4 w-1/4 rounded bg-gray-200"></div>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="border-b border-gray-300">
              <div className="flex items-center justify-between overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                    {tab.count && (
                      <span className="ml-1 text-sm font-normal">
                        ({tab.count})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}

            {/* This Outlet is needed for React Router to work with nested routes */}
            <Outlet />
          </>
        )}
      </div>
    </>
  );
};
export default RoomDetail;
