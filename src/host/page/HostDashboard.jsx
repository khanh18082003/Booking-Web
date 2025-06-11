import { useState, useEffect } from "react";
import { useStore } from "../../utils/AuthProvider";
import { FaChartLine, FaHome, FaCalendarAlt } from "react-icons/fa";
import { PAGE_TITLES, setPageTitle } from "../../utils/pageTitle";

// Import components
import RevenueDashboard from "../components/RevenueDashboard";
import PropertiesManagement from "../components/PropertiesManagement";
import BookingsManagement from "../components/BookingsManagement";

const HostDashboard = () => {
  const { store } = useStore();
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  // State cho sidebar navigation
  const [activeTab, setActiveTab] = useState("properties");

  useEffect(() => {
    setPageTitle(PAGE_TITLES.DASHBOARD_HOST);
    setLoading(false);
  }, []);

  // Handle edit property - pass to PropertiesManagement component
  const handleEditProperty = (propertyId) => {
    // This will be handled by the PropertiesManagement component
    console.log("Edit property:", propertyId);
  };

  // Sidebar Menu Items
  const sidebarItems = [
    {
      id: "revenue",
      label: "Doanh Thu",
      icon: FaChartLine,
    },
    {
      id: "properties",
      label: "Quản Lý Chỗ Nghỉ",
      icon: FaHome,
    },
    {
      id: "bookings",
      label: "Quản Lý Đặt Phòng",
      icon: FaCalendarAlt,
    },
  ];

  if (loading && store.apiLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-700">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-8 rounded-lg bg-red-50 p-6 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-red-600">Lỗi</h2>
        <p className="text-red-700">{error}</p>
        <button
          className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Host Dashboard</h2>
        </div>

        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center px-6 py-3 text-left transition-colors duration-200 ${
                  activeTab === item.id
                    ? "border-r-4 border-blue-600 bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {activeTab === "revenue" && <RevenueDashboard />}
          {activeTab === "properties" && (
            <PropertiesManagement onEditProperty={handleEditProperty} />
          )}
          {activeTab === "bookings" && <BookingsManagement />}
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
