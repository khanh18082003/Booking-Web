import { useStore } from "../../utils/AuthProvider";
import { useEffect, useState } from "react";
import { BiHotel } from "react-icons/bi";
import { FaPlane } from "react-icons/fa";
import { MdHotel, MdDirectionsCar } from "react-icons/md";
import { BsFillBuildingsFill } from "react-icons/bs";

const ApiLoading = () => {
  const { store } = useStore();
  const [fadeIn, setFadeIn] = useState(false);
  const [activeIcon, setActiveIcon] = useState(0);

  // Icons for the loading animation
  const travelIcons = [
    <BiHotel key="hotel" />,
    <FaPlane key="plane" />,
    <MdHotel key="resort" />,
    <MdDirectionsCar key="car" />,
    <BsFillBuildingsFill key="building" />,
  ];

  // Show fade-in animation when loading appears
  useEffect(() => {
    if (store.apiLoading) {
      // Short delay before showing animation for better UX
      const timer = setTimeout(() => {
        setFadeIn(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setFadeIn(false);
    }
  }, [store.apiLoading]);

  // Rotate through travel icons
  useEffect(() => {
    if (!store.apiLoading) return;

    const interval = setInterval(() => {
      setActiveIcon((prev) => (prev + 1) % travelIcons.length);
    }, 600);

    return () => clearInterval(interval);
  }, [store.apiLoading]);

  if (!store.apiLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Premium backdrop with blur effect */}
      <div className="absolute inset-0 bg-[#003B95]/30 backdrop-blur-sm"></div>

      {/* Modern card with elegant shadow */}
      <div className="relative w-[280px] transform overflow-hidden rounded-2xl bg-white/95 p-6 shadow-[0_8px_32px_rgba(0,59,149,0.2)] transition-all duration-300 dark:bg-gray-800/95">
        {/* Booking.com brand colored border top */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#003B95] via-[#0071C2] to-[#5CB3FF]"></div>

        {/* Main content */}
        <div className="flex flex-col items-center space-y-5">
          {/* Logo and spinning indicators */}
          <div className="relative flex h-16 w-16 items-center justify-center">
            {/* Main icon */}
            <div className="absolute z-10 text-[#0071C2] transition-all duration-300">
              <div className="flex h-10 w-10 items-center justify-center text-3xl">
                {travelIcons[activeIcon]}
              </div>
            </div>

            {/* Circle spinner */}
            <svg
              className="animate-spin-slow absolute h-16 w-16"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#E6F2FF"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#0071C2"
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset="100"
                className="origin-center -rotate-90"
              />
            </svg>
          </div>

          {/* Loading text */}
          <div className="text-center">
            <p className="font-medium text-[#0071C2]">
              <span className="inline-block">Processing</span>
              <span className="ml-1 inline-flex w-8 justify-start">
                <span className="dot-animation">.</span>
                <span className="dot-animation animation-delay-200">.</span>
                <span className="dot-animation animation-delay-400">.</span>
              </span>
            </p>
          </div>

          {/* Progress bar */}
          <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="animate-progress-indeterminate h-full rounded-full bg-gradient-to-r from-[#0071C2] via-[#5CB3FF] to-[#0071C2]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiLoading;
