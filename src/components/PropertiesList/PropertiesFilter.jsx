import { useState } from "react";

const PropertiesFilter = () => {
  // State for filter checkboxes
  const [filters, setFilters] = useState({
    resort: false,
    allInclusive: false,
    pool: false,
    hotel: false,
  });

  // State for price range
  const [priceRange, setPriceRange] = useState([50000, 2000000]);

  // Handle filter checkbox change
  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle price range change
  const handlePriceChange = (e) => {
    const { value } = e.target;
    setPriceRange((prev) => {
      // If this is the min slider
      if (e.target.id === "min-price") {
        return [parseInt(value), prev[1]];
      }
      // If this is the max slider
      return [prev[0], parseInt(value)];
    });
  };

  // Format price as VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <div
      className="flex flex-col overflow-y-auto rounded-[8px]"
      style={{
        scrollbarWidth: "thin",
        height: "calc(100vh - 150px - 32px - 4px)",
      }}
    >
      {/* Fixed header section */}
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-[8px] border border-[#e7e7e7] bg-white p-2">
        <h3 className="text-[16px] font-bold">Chọn lọc theo:</h3>
      </div>

      {/* Scrollable content section */}
      <div className="flex-1">
        {/* Old filters section */}
        <div className="border border-t-0 border-[#e7e7e7] pt-3 pr-4 pb-2 pl-[13px]">
          <h4 className="text-sm font-semibold">Dùng các bộ lọc cũ</h4>
          <label className="mt-2 flex items-center">
            <input
              type="checkbox"
              name="resort"
              checked={filters.resort}
              onChange={handleFilterChange}
              className="mr-2 h-[24px] w-[24px]"
            />
            <div className="flex w-full items-center justify-between">
              <span className="text-sm">Resort</span>
              <span className="ml-2 text-sm text-gray-500">16</span>
            </div>
          </label>
          <label className="mt-2 flex items-center">
            <input
              type="checkbox"
              name="allInclusive"
              checked={filters.allInclusive}
              onChange={handleFilterChange}
              className="mr-2 h-[24px] w-[24px]"
            />
            <div className="flex w-full items-center justify-between">
              <span className="text-sm">Hồ bơi</span>
              <span className="ml-2 text-sm text-gray-500">15</span>
            </div>
          </label>
          <label className="mt-2 flex items-center">
            <input
              type="checkbox"
              name="hotel"
              checked={filters.hotel}
              onChange={handleFilterChange}
              className="mr-2 h-[24px] w-[24px]"
            />
            <div className="flex w-full items-center justify-between">
              <span className="text-sm">Khách sạn</span>
              <span className="ml-2 text-sm text-gray-500">603</span>
            </div>
          </label>
        </div>

        {/* Budget section */}
        <div className="border border-t-0 border-[#e7e7e7] pt-3 pr-4 pb-4 pl-[13px]">
          <h4 className="mb-2 text-sm font-semibold">
            Ngân sách của bạn (mỗi đêm)
          </h4>

          {/* Price display */}
          <div className="mb-2 text-sm">
            VND {formatPrice(priceRange[0])} - VND {formatPrice(priceRange[1])}+
          </div>

          {/* Price range slider */}
          <div className="relative mt-6 mb-2">
            {/* Price bar background */}
            <div className="h-1 w-full rounded-full bg-gray-200"></div>

            {/* Active price range */}
            <div
              className="absolute h-1 rounded-full bg-blue-500"
              style={{
                left: `${((priceRange[0] - 50000) / (2000000 - 50000)) * 100}%`,
                right: `${100 - ((priceRange[1] - 50000) / (2000000 - 50000)) * 100}%`,
              }}
            ></div>

            {/* Min price handle */}
            <div
              className="absolute -mt-1.5 h-4 w-4 cursor-pointer rounded-full bg-blue-500"
              style={{
                left: `calc(${((priceRange[0] - 50000) / (2000000 - 50000)) * 100}% - 8px)`,
              }}
            ></div>

            {/* Max price handle */}
            <div
              className="absolute -mt-1.5 h-4 w-4 cursor-pointer rounded-full bg-blue-500"
              style={{
                left: `calc(${((priceRange[1] - 50000) / (2000000 - 50000)) * 100}% - 8px)`,
              }}
            ></div>

            {/* Hidden input sliders (for actual functionality) */}
            <input
              type="range"
              id="min-price"
              min="50000"
              max="2000000"
              step="10000"
              value={priceRange[0]}
              onChange={handlePriceChange}
              className="absolute h-1 w-full cursor-pointer opacity-0"
            />
            <input
              type="range"
              id="max-price"
              min="50000"
              max="2000000"
              step="10000"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="absolute h-1 w-full cursor-pointer opacity-0"
            />
          </div>
        </div>

        {/* Favorite locations section */}
        <div className="border border-t-0 border-[#e7e7e7] pt-3 pr-4 pb-2 pl-[13px]">
          <h4 className="mb-2 text-sm font-semibold">
            Các bộ lọc được ưa chuộng cho Đà Lạt
          </h4>
          <label className="mt-2 flex items-center">
            <input
              type="checkbox"
              name="favoriteHotel"
              className="mr-2 h-[24px] w-[24px]"
            />
            <div className="flex w-full items-center justify-between">
              <span className="text-sm">Khách sạn</span>
              <span className="ml-2 text-sm text-gray-500">603</span>
            </div>
          </label>
          <label className="mt-2 flex items-center">
            <input
              type="checkbox"
              name="fiveStar"
              className="mr-2 h-[24px] w-[24px]"
            />
            <div className="flex w-full items-center justify-between">
              <span className="text-sm">5 sao</span>
              <span className="ml-2 text-sm text-gray-500">6</span>
            </div>
          </label>
        </div>

        {/* Additional filter sections to demonstrate scrolling */}
        <div className="border border-t-0 border-[#e7e7e7] pt-3 pr-4 pb-2 pl-[13px]">
          <h4 className="mb-2 text-sm font-semibold">Tiện nghi</h4>
          <label className="mt-2 flex items-center">
            <input
              type="checkbox"
              name="wifi"
              className="mr-2 h-[24px] w-[24px]"
            />
            <div className="flex w-full items-center justify-between">
              <span className="text-sm">Wi-Fi miễn phí</span>
              <span className="ml-2 text-sm text-gray-500">580</span>
            </div>
          </label>
          <label className="mt-2 flex items-center">
            <input
              type="checkbox"
              name="breakfast"
              className="mr-2 h-[24px] w-[24px]"
            />
            <div className="flex w-full items-center justify-between">
              <span className="text-sm">Bữa sáng</span>
              <span className="ml-2 text-sm text-gray-500">412</span>
            </div>
          </label>
          <label className="mt-2 flex items-center">
            <input
              type="checkbox"
              name="parking"
              className="mr-2 h-[24px] w-[24px]"
            />
            <div className="flex w-full items-center justify-between">
              <span className="text-sm">Đỗ xe miễn phí</span>
              <span className="ml-2 text-sm text-gray-500">389</span>
            </div>
          </label>
        </div>

        <div className="border border-t-0 border-[#e7e7e7] pt-3 pr-4 pb-2 pl-[13px]">
          <h4 className="mb-2 text-sm font-semibold">Xếp hạng sao</h4>
          <label className="mt-2 flex items-center">
            <input
              type="checkbox"
              name="star5"
              className="mr-2 h-[24px] w-[24px]"
            />
            <div className="flex w-full items-center justify-between">
              <span className="text-sm">5 sao</span>
              <span className="ml-2 text-sm text-gray-500">6</span>
            </div>
          </label>
          <label className="mt-2 flex items-center">
            <input
              type="checkbox"
              name="star4"
              className="mr-2 h-[24px] w-[24px]"
            />
            <div className="flex w-full items-center justify-between">
              <span className="text-sm">4 sao</span>
              <span className="ml-2 text-sm text-gray-500">42</span>
            </div>
          </label>
          <label className="mt-2 flex items-center">
            <input
              type="checkbox"
              name="star3"
              className="mr-2 h-[24px] w-[24px]"
            />
            <div className="flex w-full items-center justify-between">
              <span className="text-sm">3 sao</span>
              <span className="ml-2 text-sm text-gray-500">156</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PropertiesFilter;
