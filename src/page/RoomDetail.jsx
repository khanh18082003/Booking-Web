import React, { useState } from "react";
import OverviewContent from "../components/DetailRoom/OverviewContent";
import InfoPricingContent from "../components/DetailRoom/InfoPricingContent";
import AmenitiesContent from "../components/DetailRoom/AmenitiesContent";
import RulesContent from "../components/DetailRoom/RulesContent";
import NotesContent from "../components/DetailRoom/NotesContent";
import ReviewsContent from "../components/DetailRoom/ReviewsContent";
import Banner from "../components/layout/Banner";
const RoomDetail = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Tổng quan" },
    { id: "info", label: "Thông tin & giá" },
    { id: "amenities", label: "Tiện nghi" },
    { id: "rules", label: "Quy tắc chung" },
    { id: "notes", label: "Ghi chú" },
    { id: "reviews", label: "Đánh giá của khách", count: 570 },
  ];
  const hotelData = {
    title: "Shogun Hotel",
    address: "449 Đường Trần Hưng Đạo 8, Quận 1, TP. Hồ Chí Minh, Việt Nam",
  };
  // Function to render the appropriate content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewContent hotelData={hotelData} />;
      case "info":
        return <InfoPricingContent />;
      case "amenities":
        return <AmenitiesContent />;
      case "rules":
        return <RulesContent />;
      case "notes":
        return <NotesContent />;
      case "reviews":
        return <ReviewsContent />;
      default:
        return <OverviewContent hotelData={hotelData} />;
    }
  };

  return (
    <>
      <div className="mx-auto max-w-6xl overflow-hidden rounded-lg bg-white shadow-md">
        {/* Navigation Tabs */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
      </div>
      {/* <InfoPricingContent /> */}
    </>
  );
};
export default RoomDetail;
