import { useEffect, useRef, useState } from "react";
import {
  IoBedOutline,
  IoClose,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import DateRange from "./DateRange";
import { format, parse, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import NumberOfPersonBox from "./NumerOfPersonBox";
import { useNavigate, useLocation } from "react-router";
import PropTypes from "prop-types";
import axiosInstance from "../../utils/axiosCustomize";

// Local storage key for search parameters
const SEARCH_PARAMS_KEY = "booking_search_params";

const initLocation = [
  {
    icon: <IoLocationOutline />,
    destination: "Bình Định",
    location: "Việt Nam",
  },
  {
    icon: <IoLocationOutline />,
    destination: "Đà Lạt",
    location: "Việt Nam",
  },
  {
    icon: <IoLocationOutline />,
    destination: "TP.Hồ Chí Minh",
    location: "Việt Nam",
  },
  {
    icon: <IoLocationOutline />,
    destination: "Hà Nội",
    location: "Việt Nam",
  },
  {
    icon: <IoLocationOutline />,
    destination: "Đà Nẵng",
    location: "Việt Nam",
  },
];

const dayShortNames = {
  "Thứ Hai": "T2",
  "Thứ Ba": "T3",
  "Thứ Tư": "T4",
  "Thứ Năm": "T5",
  "Thứ Sáu": "T6",
  "Thứ Bảy": "T7",
  "Chủ Nhật": "CN",
};

// Helper functions for localStorage
const getSearchParamsFromStorage = () => {
  try {
    const params = localStorage.getItem(SEARCH_PARAMS_KEY);
    return params ? JSON.parse(params) : null;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};

const saveSearchParamsToStorage = (params) => {
  try {
    // Create a copy to avoid modifying the original object
    const paramsToSave = { ...params };

    // Format dates as yyyy-MM-dd strings to avoid timezone issues
    if (paramsToSave.startDate instanceof Date) {
      paramsToSave.startDate = format(paramsToSave.startDate, "yyyy-MM-dd");
    }

    if (paramsToSave.endDate instanceof Date) {
      paramsToSave.endDate = format(paramsToSave.endDate, "yyyy-MM-dd");
    }

    localStorage.setItem(SEARCH_PARAMS_KEY, JSON.stringify(paramsToSave));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const FormSearchBox = ({ showTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [locations, setLocations] = useState(initLocation);

  // Parse URL search parameters
  const getInitialValues = () => {
    const searchParams = new URLSearchParams(location.search);
    const storedParams = getSearchParamsFromStorage();

    const initialNumbers = {
      adults: {
        name: "Người lớn",
        valueNow: searchParams.get("adults")
          ? parseInt(searchParams.get("adults"))
          : storedParams?.adults || 1,
        valueMin: 1,
        valueMax: 30,
      },
      children: {
        name: "Trẻ em",
        valueNow: searchParams.get("children")
          ? parseInt(searchParams.get("children"))
          : storedParams?.children || 0,
        valueMin: 0,
        valueMax: 10,
      },
      rooms: {
        name: "Phòng",
        valueNow: searchParams.get("rooms")
          ? parseInt(searchParams.get("rooms"))
          : storedParams?.rooms || 1,
        valueMin: 1,
        valueMax: 30,
      },
    };

    let startDate = new Date();
    let endDate = addDays(startDate, 1);

    if (searchParams.get("checkin")) {
      startDate = parse(searchParams.get("checkin"), "yyyy-MM-dd", new Date());
    } else if (storedParams?.startDate) {
      if (storedParams.startDate < Date.now()) {
        startDate = new Date();
      } else {
        startDate = new Date(storedParams.startDate);
      }
    }

    if (searchParams.get("checkout")) {
      endDate = parse(searchParams.get("checkout"), "yyyy-MM-dd", new Date());
    } else if (storedParams?.endDate) {
      if (storedParams.endDate < Date.now()) {
        endDate = addDays(startDate, 1);
      } else {
        endDate = new Date(storedParams.endDate);
      }
    } else {
      endDate = addDays(startDate, 1);
    }

    const destination =
      searchParams.get("destination") || storedParams?.destination || "";

    return {
      initialNumbers,
      initialDate: { startDate, endDate, key: "selection" },
      initialDestination: destination,
    };
  };

  const { initialNumbers, initialDate, initialDestination } =
    getInitialValues();

  const [numbers, setNumbers] = useState(initialNumbers);
  const [date, setDate] = useState(initialDate);
  const [inputChange, setInputChange] = useState(initialDestination);
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef(null);
  const [openDate, setOpenDate] = useState(false);
  const [openPersonBox, setOpenPersonBox] = useState(false);

  useEffect(() => {
    const params = {
      destination: inputChange,
      startDate: date.startDate,
      endDate: date.endDate,
      adults: numbers.adults.valueNow,
      children: numbers.children.valueNow,
      rooms: numbers.rooms.valueNow,
    };
    saveSearchParamsToStorage(params);
  }, [inputChange, date, numbers]);

  useEffect(() => {
    const fetchLocations = async () => {
      if (inputChange.length === 0) {
        setLocations(initLocation);
        return;
      }
      try {
        const response = await axiosInstance.get(`/locations`, {
          params: {
            location: inputChange,
          },
        });

        const parsed =
          typeof response.data.data === "string"
            ? JSON.parse(response.data.data)
            : response.data.data;

        const data = parsed.predictions.map((location) => ({
          icon: <IoLocationOutline />,
          destination: location.structured_formatting.main_text,
          location: location.structured_formatting.secondary_text,
        }));
        setLocations(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách địa điểm:", error);
      }
    };
    fetchLocations();
  }, [inputChange]);

  const handleChange = (ranges) => {
    setDate(ranges.selection);
  };

  const handleClickDate = () => {
    setOpenDate((prev) => !prev);
  };

  const handleClickPersonBox = () => {
    setOpenPersonBox((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOnChange = (e) => {
    const value = e.currentTarget.value;
    setInputChange(value);
  };

  const handleDeleteInput = () => {
    setInputChange("");
  };

  const formatDate = (date) => {
    const dayStart = format(date, "EEEE", { locale: vi });

    return `${dayShortNames[dayStart]}, ${format(date, "d 'tháng' M", {
      locale: vi,
    })}`;
  };

  const increase = (type) => {
    setNumbers((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        valueNow: Math.min(prev[type].valueNow + 1, prev[type].valueMax),
      },
    }));
  };

  const decrease = (type) => {
    setNumbers((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        valueNow: Math.max(prev[type].valueNow - 1, prev[type].valueMin),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const destination = inputChange;
    const startDate = format(date.startDate, "yyyy-MM-dd");
    const endDate = format(date.endDate, "yyyy-MM-dd");
    const adults = numbers.adults.valueNow;
    const children = numbers.children.valueNow;
    const rooms = numbers.rooms.valueNow;

    saveSearchParamsToStorage({
      destination,
      startDate: date.startDate,
      endDate: date.endDate,
      adults,
      children,
      rooms,
    });

    try {
      const response = await axiosInstance.get(`/properties/search`, {
        params: {
          location: destination,
          start_date: startDate,
          end_date: endDate,
          adults,
          children,
          rooms,
        },
      });

      navigate(
        `/searchresults?destination=${encodeURIComponent(
          destination,
        )}&checkin=${startDate}&checkout=${endDate}&adults=${adults}&children=${children}&rooms=${rooms}`,
        {
          state: {
            propertiesList: response.data.data.data,
            total: response.data.data.meta.total,
            destination: destination,
          },
        },
      );
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);

      // Check if we have valid locations to retry with
      if (locations && locations.length > 0) {
        console.log("Retrying with location:", locations[0].destination);

        // Update input field with first location
        const newDestination = locations[0].destination;
        setInputChange(newDestination);

        // Retry the search with the new destination
        try {
          const startDate = format(date.startDate, "yyyy-MM-dd");
          const endDate = format(date.endDate, "yyyy-MM-dd");
          const adults = numbers.adults.valueNow;
          const children = numbers.children.valueNow;
          const rooms = numbers.rooms.valueNow;

          const response = await axiosInstance.get(`/properties/search`, {
            params: {
              location: newDestination,
              start_date: startDate,
              end_date: endDate,
              adults,
              children,
              rooms,
            },
          });

          navigate(
            `/searchresults?destination=${encodeURIComponent(
              newDestination,
            )}&checkin=${startDate}&checkout=${endDate}&adults=${adults}&children=${children}&rooms=${rooms}`,
            {
              state: {
                propertiesList: response.data.data.data,
                total: response.data.data.meta.total,
                destination: newDestination,
              },
            },
          );
        } catch (retryError) {
          console.error("Retry search also failed:", retryError);
          // Show appropriate error message to user
          alert(
            "Không thể tìm kiếm địa điểm. Vui lòng thử lại với địa điểm khác.",
          );
        }
      } else {
        alert("Không thể tìm kiếm địa điểm. Vui lòng thử lại sau.");
      }
    }
  };

  const handleChooseItemBox = (e) => {
    const value = e.currentTarget;
    const location = value.querySelector("h4").textContent;
    const locationDetail = value.querySelector("p").textContent;
    setInputChange(location + ", " + locationDetail);

    setIsVisible(false);
  };

  return (
    <div
      data-aos="fade-zoom-in"
      data-aos-duration="500"
      data-aos-delay="100"
      className={`absolute left-[50%] w-searchbox max-w-[1100px] -translate-x-[50%] -translate-y-[54px] ${
        showTitle && "max-[900px]:-bottom-[118px]"
      }`}
    >
      <div>
        <form action="" method="GET" onSubmit={handleSubmit}>
          <div className="mt-6 mb-4 flex max-w-full flex-col gap-1 rounded-[8px] bg-border p-1 shadow-searchbox lg:flex-row">
            <div
              ref={wrapperRef}
              className="relative flex-auto shrink grow rounded-[4px] bg-white text-black hover:shadow-[0_0_0_1px_#f56700]"
            >
              <div className="p-2">
                <div className="flex w-full items-center">
                  <div className="pl-2">
                    <span className="flex items-center">
                      <IoBedOutline className="text-[24px]" />
                    </span>
                  </div>
                  <input
                    type="text"
                    autoComplete="off"
                    name="destination"
                    onChange={handleOnChange}
                    onFocus={() => setIsVisible(true)}
                    value={inputChange}
                    placeholder="Bạn muốn đến đâu?"
                    required
                    className="h-[36px] w-full grow px-2 py-1 text-[14px] leading-[20px] font-medium outline-none placeholder:text-[#1a1a1a] focus:placeholder:text-[#959595]"
                  />
                  <div
                    className={`cursor-pointer ${
                      inputChange ? "block" : "hidden"
                    }`}
                  >
                    <IoClose onClick={handleDeleteInput} />
                  </div>
                </div>
              </div>
              {isVisible && (
                <div className="location-list-box z-[999]">
                  <div className="w-full text-[#1a1a1a]">
                    <div className="p-3 text-[14px] font-bold">
                      Điểm đến được ưa thích gần đây
                    </div>
                    <ul className="">
                      {locations.map((location, index) => (
                        <li
                          key={index}
                          onClick={handleChooseItemBox}
                          className="overflow-hidden border-b-[1px] border-solid border-[#e7e7e7]"
                        >
                          <div className="cursor-pointer p-2 text-left hover:bg-[#f2f2f2]">
                            <div className="flex items-center">
                              <span className="mr-2 text-[24px]">
                                {location.icon}
                              </span>
                              <div>
                                <h4 className="text-[14px] font-bold">
                                  {location.destination}
                                </h4>
                                <p className="text-[13px]">
                                  {location.location}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="relative cursor-pointer items-center rounded-[4px] bg-white text-black hover:shadow-[0_0_0_1px_#f56700] lg:w-[27%]">
              <div onClick={handleClickDate} className="p-2">
                <div className="flex items-center text-[14px] font-medium text-[#1a1a1a]">
                  <div className="py-1 pl-2">
                    <span className="flex items-center">
                      <FaRegCalendarAlt className="text-[24px]" />
                    </span>
                  </div>
                  <button
                    type="button"
                    className="w-auto cursor-pointer appearance-none overflow-hidden border-none p-2 text-left leading-[20px]"
                  >
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                      {formatDate(date.startDate)}
                    </span>
                  </button>
                  <span className="leading-[20px]"> — </span>
                  <button
                    type="button"
                    className="w-auto cursor-pointer overflow-hidden border-none p-2 text-left leading-[20px]"
                  >
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                      {formatDate(date.endDate)}
                    </span>
                  </button>
                </div>
              </div>
              {openDate && (
                <>
                  <DateRange
                    date={date}
                    handleChange={handleChange}
                    className="absolute top-listbox shadow-searchbox"
                  />
                </>
              )}
            </div>
            <div className="relative rounded-[4px] bg-white text-black hover:shadow-[0_0_0_1px_#f56700] lg:w-[27%]">
              <div onClick={handleClickPersonBox} className="p-2">
                <button
                  className="relative my-[2px] flex w-full cursor-pointer items-center py-1 pr-6 pl-2 text-[14px] font-medium text-[#1a1a1a]"
                  type="button"
                >
                  <div className="flex items-center">
                    <span className="flex items-center pr-2">
                      <IoPersonOutline className="text-[24px]" />
                    </span>
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                      {numbers.adults.valueNow} người lớn ·{" "}
                      {numbers.children.valueNow} trẻ em ·{" "}
                      {numbers.rooms.valueNow} phòng
                    </span>
                  </div>
                  <div className="absolute right-[1px]">
                    <span>
                      <RiArrowDropDownLine className="text-[24px]" />
                    </span>
                  </div>
                </button>
              </div>
              {openPersonBox && (
                <NumberOfPersonBox
                  numbers={numbers}
                  increase={increase}
                  decrease={decrease}
                />
              )}
            </div>
            <div className="flex min-h-[50px] flex-auto overflow-hidden rounded-[4px] text-center text-[20px]">
              <button
                type="submit"
                className="w-full cursor-pointer bg-[#006ce4] px-6 py-1 leading-7 font-medium text-white duration-200 hover:bg-secondary"
              >
                <span>Tìm</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
FormSearchBox.propTypes = {
  showTitle: PropTypes.bool,
};

export default FormSearchBox;
