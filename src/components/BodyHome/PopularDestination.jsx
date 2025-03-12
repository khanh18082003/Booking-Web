import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

const data = [
  {
    id: "1",
    image:
      "https://r-xx.bstatic.com/xdata/images/hotel/263x210/595550862.jpeg?k=3514aa4abb76a6d19df104cb307b78b841ac0676967f24f4b860d289d55d3964&o=",
    title: "Đà Lạt",
    quantity: 2145,
  },
  {
    id: "2",
    image:
      "https://q-xx.bstatic.com/xdata/images/hotel/263x210/595548591.jpeg?k=01741bc3aef1a5233dd33794dda397083092c0215b153915f27ea489468e57a2&o=",
    title: "Nha Trang",
    quantity: 2145,
  },
  {
    id: "3",
    image:
      "https://q-xx.bstatic.com/xdata/images/hotel/263x210/595551044.jpeg?k=262826efe8e21a0868105c01bf7113ed94de28492ee370f4225f00d1de0c6c44&o=",
    title: "Phan Thiết",
    quantity: 2145,
  },
  {
    id: "4",
    image:
      "https://r-xx.bstatic.com/xdata/images/hotel/263x210/620168315.jpeg?k=300d8d8059c8c5426ea81f65a30a7f93af09d377d4d8570bda1bd1f0c8f0767f&o=",
    title: "Đà Nẵng",
    quantity: 2145,
  },
  {
    id: "5",
    image:
      "https://q-xx.bstatic.com/xdata/images/city/170x136/688893.jpg?k=d32ef7ff94e5d02b90908214fb2476185b62339549a1bd7544612bdac51fda31&o=",
    title: "TP.Hồ Chí Minh",
    quantity: 2145,
  },
  {
    id: "6",
    image:
      "https://q-xx.bstatic.com/xdata/images/city/170x136/688850.jpg?k=c24b566d6c4a5d11a2bfd23386584c794d088ac883ba61c0bcdbe03f52edd9ab&o=",
    title: "Mũi Né",
    quantity: 2145,
  },
  {
    id: "7",
    image:
      "https://r-xx.bstatic.com/xdata/images/city/170x136/688956.jpg?k=fc88c6ab5434042ebe73d94991e011866b18ee486476e475a9ac596c79dce818&o=",
    title: "Vũng Tàu",
    quantity: 2145,
  },
  {
    id: "8",
    image:
      "https://r-xx.bstatic.com/xdata/images/city/170x136/688879.jpg?k=82ca0089828054a1a9c46b14ea7f1625d73d42505ae58761e8bcc067f9e72475&o=",
    title: "Phú Quốc",
    quantity: 2145,
  },
];

const PopularDestination = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef(null);

  // Xử lý responsive
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Tính toán số lượng items hiển thị dựa trên kích thước màn hình
  const getVisibleItemCount = () => {
    if (windowWidth < 640) return 3; // Mobile
    if (windowWidth < 768) return 4; // Small tablet
    if (windowWidth < 1024) return 5; // Large tablet
    return 6; // Desktop
  };

  const handleNext = () => {
    if (scrollPosition < data.length - getVisibleItemCount()) {
      setScrollPosition(scrollPosition + 1);
    }
  };

  const handlePrev = () => {
    if (scrollPosition > 0) {
      setScrollPosition(scrollPosition - 1);
    }
  };

  return (
    <div className="px-4 py-6 md:px-6 lg:px-2">
      <div className="mb-6 flex flex-col justify-center gap-1">
        <h2 className="text-2xl font-bold text-gray-800 md:text-[26px]">
          Khám phá Việt Nam
        </h2>
        <p className="text-[16px] text-[#595959]">
          Các điểm đến phổ biến này có nhiều điều chờ đón bạn
        </p>
      </div>

      <div className="relative z-[0]">
        {/* Nút điều hướng trái */}
        <button
          onClick={handlePrev}
          disabled={scrollPosition === 0}
          className={`absolute top-1/2 -left-4 z-10 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white shadow-md ${
            scrollPosition === 0
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-gray-100"
          }`}
          aria-label="Previous"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Carousel container */}
        <div className="overflow-hidden" ref={carouselRef}>
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform:
                scrollPosition !== 0
                  ? `translateX(calc(-${scrollPosition * (100 / getVisibleItemCount())}% - 16px))`
                  : "none",
            }}
          >
            {data.map((item, index) => (
              <div
                key={item.id}
                className="mr-4 w-item2 flex-none cursor-pointer transition-all duration-200 sm:w-item2-sm md:w-item2-md lg:w-item2-lg"
              >
                <Link to={`/${index}`} className="block bg-white">
                  <div className="max-h-[200px] overflow-hidden rounded-lg lg:max-h-[136px]">
                    <img
                      src={
                        item.image ||
                        `/api/placeholder/400/320?text=${item.title}`
                      }
                      alt={item.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="pt-2 text-left">
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-[14px] text-[#595959]">
                      {item.quantity} <span>chỗ nghĩ</span>
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Nút điều hướng phải */}
        <button
          onClick={handleNext}
          disabled={scrollPosition >= data.length - getVisibleItemCount()}
          className={`absolute top-1/2 -right-4 z-10 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white shadow-md ${
            scrollPosition >= data.length - getVisibleItemCount()
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-gray-100"
          }`}
          aria-label="Next"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Indicator dots (optional) */}
      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({
          length: Math.ceil(data.length / getVisibleItemCount()),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => setScrollPosition(index * getVisibleItemCount())}
            className={`h-2 w-2 rounded-full ${
              scrollPosition >= index * getVisibleItemCount() &&
              scrollPosition < (index + 1) * getVisibleItemCount()
                ? "bg-blue-500"
                : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularDestination;
