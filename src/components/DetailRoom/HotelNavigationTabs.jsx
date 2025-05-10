import React, { useState } from "react";

const HotelNavigationTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Tổng quan" },
    { id: "info", label: "Thông tin & giá" },
    { id: "amenities", label: "Tiện nghi" },
    { id: "rules", label: "Quy tắc chung" },
    { id: "notes", label: "Ghi chú" },
    { id: "reviews", label: "Đánh giá của khách", count: 570 },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // In a real application, you might scroll to the relevant section
    // or set a URL hash like #overview, #amenities, etc.
  };

  return (
    <div className="w-full border-b">
      <nav className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {tab.label}
            {tab.count && (
              <span className="ml-1 text-sm font-normal">({tab.count})</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default HotelNavigationTabs;
