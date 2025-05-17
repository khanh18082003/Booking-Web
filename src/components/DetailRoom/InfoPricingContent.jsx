import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosCustomize";
import { useParams } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";

const SEARCH_PARAMS_KEY = "booking_search_params";

const InfoPricingContent = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState({});
  const { id } = useParams();

  const getSearchParamsFromStorage = () => {
    try {
      const params = localStorage.getItem(SEARCH_PARAMS_KEY);
      return params ? JSON.parse(params) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  };

  const params = getSearchParamsFromStorage();
  const propertyId = id;
  const start_date = new Date(params?.startDate).toISOString().split("T")[0];
  const end_date = new Date(params?.endDate).toISOString().split("T")[0];
  const rooms = params?.rooms;
  const adults = params?.adults;
  const children = params?.children;

  useEffect(() => {
    const fetchAccommodations = async () => {
      if (!propertyId) return;
      try {
        setLoading(true);
        const response = await axios.get(
          `/properties/${propertyId}/accommodations?start_date=${start_date}&end_date=${end_date}&rooms=${rooms}&adults=${adults}&children=${children}`,
        );
        if (response.data.code === "M000") {
          const accommodationsData = response.data.data;
          setAccommodations(accommodationsData);
          setError(null);
        } else {
          setError("Failed to load property details.");
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
        setError("An error occurred while loading property details.");
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodations();
  }, [propertyId]);

  // Tính tổng số phòng đã chọn
  const totalRoomsSelected = Object.values(selectedRooms).reduce(
    (sum, value) => sum + (typeof value === "number" ? value : 0),
    0,
  );

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">Thông tin & giá</h2>
      <div className="overflow-hidden rounded-md border">
        {loading ? (
          <div className="p-4 text-center">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border-r border-[#57a6f4] bg-[#4c76b2] p-3 text-left text-white">
                    Loại chỗ nghỉ
                  </th>
                  <th className="border-r border-[#57a6f4] bg-[#4c76b2] p-3 text-left text-white">
                    Số lượng khách
                  </th>
                  <th className="border-r border-[#57a6f4] bg-[#4c76b2] p-3 text-white">
                    Giá
                  </th>
                  <th className="border-r border-[#57a6f4] bg-[#4c76b2] p-3 text-white">
                    Số phòng còn
                  </th>
                  <th className="bg-[#4c76b2] p-3 text-white">
                    Số phòng muốn đặt
                  </th>
                </tr>
              </thead>
              <tbody>
                {accommodations.map((acc) => (
                  <tr key={acc.accommodation_id} className="border-b">
                    <td className="border-r border-[#57a6f4] p-4">
                      <div>
                        <p className="mb-1 font-medium text-blue-600">
                          {acc.name}
                        </p>
                        {acc.rooms.map((room, idx) => (
                          <p key={idx} className="text-sm">
                            {room.room_name}:{" "}
                            {room.beds
                              .map(
                                (bed) =>
                                  `${bed.quantity} ${bed.bed_type_name || bed.bed_type}`,
                              )
                              .join(", ")}
                          </p>
                        ))}
                        {acc.size && (
                          <span className="mt-1 flex items-center text-xs text-gray-500">
                            <IoHomeOutline className="mr-1" />
                            Diện tích: {acc.size} m²
                          </span>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {acc.amenities.map((am, i) => (
                            <span
                              key={i}
                              className="inline-block rounded border border-blue-200 bg-blue-100 px-2 py-1 text-xs text-blue-700"
                            >
                              {am.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="border-r border-[#57a6f4] p-4">
                      <span className="mr-1">
                        {acc.capacity > 4
                          ? `${acc.capacity} x 👤`
                          : Array(acc.capacity).fill("👤").join("")}
                      </span>
                    </td>
                    <td className="border-r border-[#57a6f4] p-4 text-right">
                      <span className="font-semibold text-blue-600">
                        {typeof acc.total_price === "number"
                          ? acc.total_price.toLocaleString() + "₫"
                          : "--"}
                      </span>
                    </td>
                    <td className="border-r border-[#57a6f4] p-4 text-right">
                      <span>{acc.available_rooms}</span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        className="rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
                        value={selectedRooms?.[acc.accommodation_id] ?? 0}
                        onChange={(e) =>
                          setSelectedRooms((prev) => ({
                            ...prev,
                            [acc.accommodation_id]: Number(e.target.value),
                          }))
                        }
                        style={{ minWidth: 56 }}
                      >
                        {Array.from(
                          { length: acc.available_rooms + 1 },
                          (_, i) => i,
                        ).map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tổng giá và nút đặt phòng: chỉ hiện khi đã chọn ít nhất 1 phòng */}
            {totalRoomsSelected > 0 && (
              <div className="mt-4 flex items-center justify-between px-4">
                <span className="text-lg font-semibold text-blue-700">
                  Tổng giá:{" "}
                  {accommodations
                    .reduce((total, acc) => {
                      const quantity =
                        selectedRooms?.[acc.accommodation_id] || 0;
                      const price = acc.total_price || 0;
                      return total + quantity * price;
                    }, 0)
                    .toLocaleString()}
                  ₫
                </span>
                <button
                  className="rounded-md bg-green-600 px-4 py-2 font-semibold text-white shadow hover:bg-green-700"
                  onClick={() => {
                    const summary = accommodations
                      .filter(
                        (acc) => selectedRooms?.[acc.accommodation_id] > 0,
                      )
                      .map((acc) => {
                        const quantity =
                          selectedRooms?.[acc.accommodation_id] || 0;
                        return `• ${quantity} phòng ${acc.name}`;
                      })
                      .join("\n");
                    alert(`Đặt các phòng:\n${summary}`);
                  }}
                >
                  Tôi đã đặt
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InfoPricingContent;
