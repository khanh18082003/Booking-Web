import { useEffect, useState, useRef } from "react";
import axios from "../../utils/axiosCustomize";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoClose, IoHomeOutline, IoPersonSharp } from "react-icons/io5";
import { resizeSvg } from "../../utils/convertIconToSVG";
import BookingTooltip from "./BookingTooltip";
import PropTypes from "prop-types";

const InfoPricingContent = ({ hotelData }) => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef(null);
  const { id, propertiesName } = useParams();
  const navigation = useNavigate();

  const location = useLocation();
  const searchParams = location.search;

  const propertyId = id;
  const params = new URLSearchParams(searchParams);
  const start_date = params.get("checkin");
  const end_date = params.get("checkout");
  const rooms = params.get("rooms");
  const adults = params.get("adults");
  const children = params.get("children");

  useEffect(() => {
    const fetchAccommodations = async () => {
      if (!propertyId) return;
      try {
        setLoading(true);

        const response = await axios.get(
          `/properties/${propertyId}/accommodations`,
          {
            params: {
              start_date,
              end_date,
              rooms,
              adults,
              children,
            },
          },
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
      <div className="overflow-hidden rounded-md">
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
                  <tr
                    key={acc.accommodation_id}
                    className="border-b border-third"
                  >
                    <td className="w-[30%] border-r border-[#57a6f4] p-4">
                      <div>
                        <p className="mb-1 font-medium text-blue-600">
                          {acc.name}
                        </p>
                        {acc.rooms.map((room, idx) => (
                          <p key={idx} className="text-sm">
                            <span className="font-bold">{room.room_name}</span>:{" "}
                            {room.beds
                              .map(
                                (bed) =>
                                  `${bed.quantity} ${bed.bed_type_name || bed.bed_type}`,
                              )
                              .join(", ")}
                          </p>
                        ))}
                        {acc.size && (
                          <span className="mt-1 flex items-center text-xs text-gray-600">
                            <IoHomeOutline className="mr-1" />
                            Diện tích: {acc.size} m²
                          </span>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {acc.amenities.map((am, i) => (
                            <span
                              key={i}
                              className="flex items-center gap-1 rounded border border-blue-200 bg-blue-100 px-1 py-1 text-xs text-blue-700"
                            >
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: resizeSvg(am.icon, 16, 16),
                                }}
                              />
                              <span>{am.name}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="border-r border-[#57a6f4] p-4">
                      <span className="mr-1 flex items-center">
                        {acc.capacity > 4 ? (
                          <>
                            <IoPersonSharp size={18} />
                            <IoClose size={12} />
                            <span className="font-[400]">{acc.capacity}</span>
                          </>
                        ) : (
                          Array(acc.capacity)
                            .fill()
                            .map((_, i) => (
                              <IoPersonSharp
                                key={i}
                                className="inline-block"
                                size={20}
                              />
                            ))
                        )}
                      </span>
                    </td>
                    <td className="w-[20%] border-r border-[#57a6f4] p-4 text-left">
                      <span className="font-semibold text-blue-600">
                        {typeof acc.total_price === "number"
                          ? "VND " + acc.total_price.toLocaleString()
                          : "--"}
                      </span>
                    </td>
                    <td className="border-r border-[#57a6f4] p-4 text-left">
                      <span>{acc.available_rooms}</span>
                    </td>
                    <td className="w-[5%] p-4 text-right">
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
                  Tổng giá: VND {""}
                  {accommodations
                    .reduce((total, acc) => {
                      const quantity =
                        selectedRooms?.[acc.accommodation_id] || 0;
                      const price = acc.total_price || 0;
                      return total + quantity * price;
                    }, 0)
                    .toLocaleString()}
                </span>
                <div className="relative">
                  <button
                    ref={buttonRef}
                    className="cursor-pointer rounded-md bg-third px-4 py-2 font-semibold text-white shadow duration-200 hover:bg-secondary"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => {
                      setShowTooltip(false);
                      navigation(
                        {
                          pathname: `/properties/${propertyId}/${propertiesName}/booking-confirmation`,
                          search: `${searchParams}`,
                        },
                        {
                          state: {
                            hotelData: hotelData,
                            accommodations: accommodations
                              .filter(
                                (acc) =>
                                  selectedRooms?.[acc.accommodation_id] > 0,
                              )
                              .map((acc) => ({
                                ...acc,
                                quantity: selectedRooms?.[acc.accommodation_id],
                              })),
                            totalPrice: accommodations
                              .reduce((total, acc) => {
                                const quantity =
                                  selectedRooms?.[acc.accommodation_id] || 0;
                                const price = acc.total_price || 0;
                                return total + quantity * price;
                              }, 0)
                              .toLocaleString(),
                          },
                        },
                      );
                    }}
                  >
                    Tôi sẽ đặt
                  </button>

                  <BookingTooltip
                    propertyName={hotelData.name}
                    accommodationInfo={accommodations.filter(
                      (acc) => selectedRooms?.[acc.accommodation_id] > 0,
                    )}
                    checkIn={start_date}
                    checkOut={end_date}
                    isVisible={showTooltip}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
InfoPricingContent.propTypes = {
  hotelData: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default InfoPricingContent;
