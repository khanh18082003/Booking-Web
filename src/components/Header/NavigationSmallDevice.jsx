import { VscAccount } from "react-icons/vsc";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router";
import PropTypes from "prop-types";

const NavigationSmallDevice = ({
  isAuthenticated,
  toggleAccountOptional,
  avatar,
  name,
}) => {
  return (
    <div className="flex items-center gap-2 text-white lg:hidden">
      {/* navigate login section */}
      <span className="group relative flex min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center rounded-[4px] hover:bg-white/10">
        {isAuthenticated ? (
          <div
            onClick={toggleAccountOptional}
            className="min-h-[24px] min-w-[24px]"
          >
            <span className="">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="h-8 w-8 rounded-full border border-gray-300"
                />
              ) : (
                <VscAccount className="h-full w-full font-medium" />
              )}
            </span>
            <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-700"></div>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="relative flex h-full w-full items-center justify-center px-3 py-2"
            >
              <span className="min-h-[24px] min-w-[24px]">
                <VscAccount className="h-full w-full font-medium" />
              </span>
              <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-700"></div>
            </Link>
          </>
        )}
        <div
          className="absolute top-16 z-[1001] rounded-[6px] bg-black p-1 px-2 text-center opacity-0 transition-all delay-200 duration-200 group-hover:top-12 group-hover:opacity-100"
          style={{ whiteSpace: "nowrap" }} // Prevent text wrapping
        >
          <span className="text-[14px] text-white">{name || "Đăng nhập"}</span>
        </div>
      </span>
      {/* navigate bar */}
      <div className="inline-block max-w-full shrink-0 rounded-[4px] align-middle duration-200 hover:bg-white/10">
        <button className="inline-flex min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center px-3 py-2 align-middle">
          <span className="h-[20px] w-[20px]">
            <FaBars className="h-full w-full font-medium" />
          </span>
        </button>
      </div>
    </div>
  );
};
NavigationSmallDevice.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  toggleAccountOptional: PropTypes.func.isRequired,
};

export default NavigationSmallDevice;
