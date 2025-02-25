import React, { useEffect, useRef, useState } from "react";
import {
  IoBedOutline,
  IoClose,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import DateRange from "./DateRange";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const locations = [
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
const FormSearchBox = () => {
  const [date, setDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [inputChange, setInputChange] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef(null);
  const [openDate, setOpenDate] = useState(false);

  const handleChange = (ranges) => {
    setDate(ranges.selection);
  };

  const handleClickDate = () => {
    setOpenDate((prev) => !prev);
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

    return `${dayShortNames[dayStart]}, ${format(date, "d 'tháng' M", { locale: vi })}`;
  };

  return (
    <div className="absolute left-[50%] w-searchbox max-w-[1100px] -translate-x-[50%] -translate-y-[54px] max-[900px]:-bottom-[118px]">
      <div>
        <form action="">
          <div className="mt-6 mb-4 flex max-w-full flex-col gap-1 rounded-[8px] bg-border p-1 shadow-searchbox md:flex-row">
            {/* search destination */}
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
                    name="destination"
                    onChange={handleOnChange}
                    onFocus={() => setIsVisible(true)}
                    value={inputChange}
                    placeholder="Bạn muốn đến đâu?"
                    className="h-[36px] w-full grow px-2 py-1 text-[14px] leading-[20px] font-medium outline-none placeholder:text-[#1a1a1a] focus:placeholder:text-[#959595]"
                  />
                  <div
                    className={`cursor-pointer ${inputChange ? "block" : "hidden"}`}
                  >
                    <IoClose onClick={handleDeleteInput} />
                  </div>
                </div>
              </div>
              {/* list box destination lately */}
              {isVisible && (
                <div className="location-list-box">
                  <div className="w-full text-[#1a1a1a]">
                    <div className="p-3 text-[14px] font-bold">
                      Điểm đến được ưa thích gần đây
                    </div>
                    <ul className="">
                      {locations.map((location, index) => (
                        <li
                          key={index}
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
            {/* choose check-in check-out */}
            <div
              onClick={handleClickDate}
              className="relative cursor-pointer items-center rounded-[4px] bg-white text-black hover:shadow-[0_0_0_1px_#f56700] lg:w-[27%]"
            >
              <div className="p-2">
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
                <DateRange
                  date={date}
                  handleChange={handleChange}
                  className="absolute top-listbox shadow-searchbox"
                />
              )}
            </div>
            {/* choose number of person */}
            <div className="rounded-[4px] bg-white text-black hover:shadow-[0_0_0_1px_#f56700] lg:w-[27%]">
              <div className="p-2">
                <button
                  className="relative my-[2px] flex w-full cursor-pointer items-center py-1 pr-6 pl-2 text-[14px] font-medium text-[#1a1a1a]"
                  type="button"
                >
                  <div className="flex items-center">
                    <span className="flex items-center pr-2">
                      <IoPersonOutline className="text-[24px]" />
                    </span>
                    <span>1 người lớn · 1 trẻ em · 2 phòng</span>
                  </div>
                  <div className="absolute right-[1px]">
                    <span>
                      <RiArrowDropDownLine className="text-[24px]" />
                    </span>
                  </div>
                </button>
              </div>
            </div>
            {/* button submit */}
            <div className="flex min-h-[50px] flex-auto overflow-hidden rounded-[4px] text-center text-[20px]">
              <button
                type="submit"
                className="w-full cursor-pointer bg-[#006ce4] px-6 py-1 leading-7 font-medium duration-200 hover:bg-secondary"
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

export default FormSearchBox;
