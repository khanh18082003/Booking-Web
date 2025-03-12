import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
const data = [
  {
    id: "1",
    image:
      "https://r-xx.bstatic.com/xdata/images/hotel/263x210/595550862.jpeg?k=3514aa4abb76a6d19df104cb307b78b841ac0676967f24f4b860d289d55d3964&o=",
    title: "Khách sạn",
  },
  {
    id: "2",
    image:
      "https://q-xx.bstatic.com/xdata/images/hotel/263x210/595548591.jpeg?k=01741bc3aef1a5233dd33794dda397083092c0215b153915f27ea489468e57a2&o=",
    title: "Căn hộ",
  },
  {
    id: "3",
    image:
      "https://q-xx.bstatic.com/xdata/images/hotel/263x210/595551044.jpeg?k=262826efe8e21a0868105c01bf7113ed94de28492ee370f4225f00d1de0c6c44&o=",
    title: "Các resort",
  },
  {
    id: "4",
    image:
      "https://r-xx.bstatic.com/xdata/images/hotel/263x210/620168315.jpeg?k=300d8d8059c8c5426ea81f65a30a7f93af09d377d4d8570bda1bd1f0c8f0767f&o=",
    title: "Các biệt thự",
  },
  {
    id: "5",
    image: "/path/to/homestay-image.jpg",
    title: "Homestay",
  },
  {
    id: "6",
    image: "/path/to/guesthouse-image.jpg",
    title: "Nhà khách",
  },
  {
    id: "7",
    image: "/path/to/hostel-image.jpg",
    title: "Nhà trọ",
  },
  {
    id: "8",
    image: "/path/to/cottage-image.jpg",
    title: "Nhà nghỉ dưỡng",
  },
];

const AccommodationCategory = () => {
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
    if (windowWidth < 640) return 1; // Mobile
    if (windowWidth < 768) return 2; // Small tablet
    if (windowWidth < 1024) return 3; // Large tablet
    return 4; // Desktop
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 md:text-[26px]">
          Tìm theo loại chỗ nghỉ
        </h2>
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
              transform: `translateX(-${scrollPosition * (100 / getVisibleItemCount())}%)`,
            }}
          >
            {data.map((item, index) => (
              <div
                key={item.id}
                className="mr-4 w-full flex-none cursor-pointer transition-all duration-200 sm:w-1/2 md:w-1/3 lg:w-item"
              >
                <Link to={`/${index}`} className="block bg-white">
                  <div className="max-h-52 overflow-hidden rounded-lg">
                    <img
                      src={
                        item.image ||
                        `/api/placeholder/400/320?text=${item.title}`
                      }
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="pt-2 text-left">
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
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

export default AccommodationCategory;
