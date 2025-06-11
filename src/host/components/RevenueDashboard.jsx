import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import hostAxios from "../../configuration/hostAxiosCustomize";
import { useStore } from "../../utils/AuthProvider";
import { FaChartLine, FaMoneyBillWave, FaHome } from "react-icons/fa";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueDashboard = () => {
  const { store } = useStore();

  // States cho revenue data
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalBookings: 0,
    monthlyBookings: 0,
  });
  const [revenueLoading, setRevenueLoading] = useState(false);

  // States cho biểu đồ doanh thu theo tháng
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearlyRevenueData, setYearlyRevenueData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

  // Tên các tháng trong năm
  const monthNames = useMemo(
    () => [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    [],
  );

  // Fetch revenue data
  useEffect(() => {
    const fetchRevenueData = async () => {
      if (!store.hostProfile) {
        return;
      }
      try {
        setRevenueLoading(true);

        // Get current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
        const currentYear = currentDate.getFullYear();

        // Fetch total revenue
        const totalRevenueResponse = await hostAxios.get("/dashboard");

        // Fetch monthly revenue
        const monthlyRevenueResponse = await hostAxios.get(
          `/dashboard/revenue?month=${currentMonth}&year=${currentYear}`,
        );

        if (
          totalRevenueResponse.data?.code === "M000" &&
          monthlyRevenueResponse.data?.code === "M000"
        ) {
          setRevenueData({
            totalRevenue: totalRevenueResponse.data.data.total_amount || 0,
            monthlyRevenue: monthlyRevenueResponse.data.data.total_amount || 0,
            totalBookings: totalRevenueResponse.data.data.total_bookings || 0,
            monthlyBookings:
              monthlyRevenueResponse.data.data.total_bookings || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        // Keep default values if API fails
        setRevenueData({
          totalRevenue: 0,
          monthlyRevenue: 0,
          totalBookings: 0,
          monthlyBookings: 0,
        });
      } finally {
        setRevenueLoading(false);
      }
    };

    fetchRevenueData();
  }, [store.hostProfile]);

  // Fetch yearly revenue data for chart
  useEffect(() => {
    const fetchYearlyRevenueData = async () => {
      if (!store.hostProfile) {
        return;
      }
      try {
        setChartLoading(true);
        const response = await hostAxios.get(
          `/dashboard/revenue-by-year?year=${selectedYear}`,
        );

        if (response.data?.code === "M000") {
          const formattedData = response.data.data.map((item, index) => ({
            month: monthNames[index],
            monthNumber: index + 1,
            revenue: item.total_amount,
            bookings: item.total_bookings,
          }));
          setYearlyRevenueData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching yearly revenue data:", error);
        setYearlyRevenueData([]);
      } finally {
        setChartLoading(false);
      }
    };

    fetchYearlyRevenueData();
  }, [store.hostProfile, selectedYear, monthNames]);

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-white p-3 shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            Doanh thu: {payload[0].value.toLocaleString("vi-VN")}đ
          </p>
          <p className="text-green-600">
            Đặt phòng: {payload[1]?.value || 0} booking
          </p>
        </div>
      );
    }
    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.number,
      }),
    ),
    label: PropTypes.string,
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Doanh Thu & Thống Kê
        </h1>
        <p className="mt-2 text-gray-600">
          Theo dõi hiệu suất kinh doanh của bạn
        </p>
      </div>

      {/* Loading State */}
      {revenueLoading && (
        <div className="flex items-center justify-center rounded-lg bg-white p-8 shadow-sm">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600">Đang tải dữ liệu doanh thu...</p>
          </div>
        </div>
      )}

      {/* Revenue Cards */}
      {!revenueLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Tổng doanh thu */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#0071c2] hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-br from-[#0071c2] to-[#005a9f] p-3 shadow-lg">
                    <FaMoneyBillWave className="h-5 w-5 text-white" />
                  </div>
                  <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[#0071c2] to-[#005a9f]"></div>
                </div>
                <p className="mb-1 text-sm font-medium text-gray-600">
                  Tổng doanh thu
                </p>
                <p className="mb-1 text-2xl font-bold text-gray-900">
                  {revenueData.totalRevenue.toLocaleString("vi-VN")}
                </p>
                <p className="text-xs font-medium text-[#0071c2]">VNĐ</p>
              </div>
            </div>
          </div>

          {/* Doanh thu tháng này */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#00BA74] hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-br from-[#00BA74] to-[#009a5d] p-3 shadow-lg">
                    <FaMoneyBillWave className="h-5 w-5 text-white" />
                  </div>
                  <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[#00BA74] to-[#009a5d]"></div>
                </div>
                <p className="mb-1 text-sm font-medium text-gray-600">
                  Doanh thu tháng này
                </p>
                <p className="mb-1 text-2xl font-bold text-gray-900">
                  {revenueData.monthlyRevenue.toLocaleString("vi-VN")}
                </p>
                <p className="text-xs font-medium text-[#00BA74]">VNĐ</p>
              </div>
            </div>
          </div>

          {/* Tổng đặt phòng */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#FF8900] hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-br from-[#FF8900] to-[#e6780a] p-3 shadow-lg">
                    <FaHome className="h-5 w-5 text-white" />
                  </div>
                  <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[#FF8900] to-[#e6780a]"></div>
                </div>
                <p className="mb-1 text-sm font-medium text-gray-600">
                  Tổng đặt phòng
                </p>
                <p className="mb-1 text-2xl font-bold text-gray-900">
                  {revenueData.totalBookings}
                </p>
                <p className="text-xs font-medium text-[#FF8900]">Bookings</p>
              </div>
            </div>
          </div>

          {/* Đặt phòng tháng này */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#B83DBA] hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-br from-[#B83DBA] to-[#9c349c] p-3 shadow-lg">
                    <FaHome className="h-5 w-5 text-white" />
                  </div>
                  <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[#B83DBA] to-[#9c349c]"></div>
                </div>
                <p className="mb-1 text-sm font-medium text-gray-600">
                  Đặt phòng tháng này
                </p>
                <p className="mb-1 text-2xl font-bold text-gray-900">
                  {revenueData.monthlyBookings}
                </p>
                <p className="text-xs font-medium text-[#B83DBA]">Bookings</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Chart */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Biểu đồ doanh thu theo tháng
          </h3>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Chọn năm:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {chartLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600">Đang tải dữ liệu biểu đồ...</p>
            </div>
          </div>
        ) : yearlyRevenueData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={yearlyRevenueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={CustomTooltip} />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill="#3B82F6"
                  name="Doanh thu (VNĐ)"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  name="Số đặt phòng"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">
            <div className="text-center">
              <FaChartLine className="mx-auto mb-2 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">
                Không có dữ liệu cho năm {selectedYear}
              </p>
              <p className="text-sm text-gray-400">
                Hãy thử chọn năm khác hoặc kiểm tra lại dữ liệu
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Bookings */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Thông tin doanh thu
        </h3>
        {!revenueLoading ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div>
                <p className="font-medium text-gray-800">Tổng doanh thu</p>
                <p className="text-sm text-gray-500">Tất cả thời gian</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">
                  {revenueData.totalRevenue.toLocaleString("vi-VN")}đ
                </p>
                <p className="text-sm text-gray-500">
                  {revenueData.totalBookings} đặt phòng
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div>
                <p className="font-medium text-gray-800">Doanh thu tháng này</p>
                <p className="text-sm text-gray-500">
                  Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">
                  {revenueData.monthlyRevenue.toLocaleString("vi-VN")}đ
                </p>
                <p className="text-sm text-gray-500">
                  {revenueData.monthlyBookings} đặt phòng
                </p>
              </div>
            </div>

            {revenueData.totalRevenue > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                <div>
                  <p className="font-medium text-gray-800">
                    Doanh thu trung bình/đặt phòng
                  </p>
                  <p className="text-sm text-gray-500">Tất cả thời gian</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">
                    {revenueData.totalBookings > 0
                      ? Math.round(
                          revenueData.totalRevenue / revenueData.totalBookings,
                        ).toLocaleString("vi-VN")
                      : 0}
                    đ
                  </p>
                  <p className="text-sm text-gray-500">mỗi đặt phòng</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-lg bg-gray-100 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-2 h-4 w-32 rounded bg-gray-200"></div>
                    <div className="h-3 w-24 rounded bg-gray-200"></div>
                  </div>
                  <div className="text-right">
                    <div className="mb-2 h-4 w-20 rounded bg-gray-200"></div>
                    <div className="h-3 w-16 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueDashboard;
