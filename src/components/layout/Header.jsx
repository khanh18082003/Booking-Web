import { Link } from "react-router";
import logo from "../../assets/logo.svg";
import { VscAccount } from "react-icons/vsc";
import { FaBars } from "react-icons/fa";
import vnLanguage from "../../assets/vn-language.png";

const Header = () => {
  return (
    <div className="bg-primary">
      <div className="pt-2">
        <div className="mx-auto w-full max-w-[1140px] px-4">
          <nav className="flex items-center justify-center lg:px-4 lg:pt-1 lg:pb-2">
            {/* logo section */}
            <div className="flex grow items-center py-2 pr-4">
              <div className="flex w-[96px] items-center lg:w-[144px]">
                <Link
                  to="/"
                  aria-label="Booking.com"
                  className="box-border inline-flex w-full text-start align-top"
                >
                  <img src={logo} alt="" />
                </Link>
              </div>
            </div>
            {/* navigate detail section */}
            <div className="flex items-center gap-2 text-white lg:hidden">
              {/* navigate login section */}
              <span className="group relative flex min-h-[48px] min-w-[48px] items-center justify-center rounded-[4px] hover:bg-white/10">
                <Link
                  to="/login"
                  className="relative flex h-full w-full items-center justify-center px-3 py-2"
                >
                  <span className="min-h-[24px] min-w-[24px]">
                    <VscAccount className="h-full w-full font-medium" />
                  </span>
                  <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-700"></div>
                </Link>
                <div className="absolute top-16 z-[200] min-w-[90px] rounded-[6px] bg-black p-1 text-center opacity-0 transition-all delay-200 duration-200 group-hover:top-12 group-hover:opacity-100">
                  <span className="text-[14px]">Đăng nhập</span>
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
            {/* navigate device of width >= 1024 */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-2 text-white">
                <span className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-[4px] duration-200 hover:bg-white/10">
                  <button className="inline-flex cursor-pointer items-center justify-center px-3 py-2 align-middle">
                    <span>VND</span>
                  </button>
                </span>
                <span className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-[4px] duration-200 hover:bg-white/10">
                  <button className="inline-flex cursor-pointer items-center justify-center px-3 py-2 align-middle">
                    <span className="max-w-[24px] overflow-hidden rounded-full">
                      <img src={vnLanguage} alt="" className="w-full" />
                    </span>
                  </button>
                </span>
                <span className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-[4px] duration-200 hover:bg-white/10">
                  <Link className="flex h-full w-full items-center justify-center px-3 py-2">
                    <span className="text-[16px]">
                      Đăng chỗ nghỉ của Quý vị
                    </span>
                  </Link>
                </span>
                <span className="min-h-[36px] rounded-[4px] bg-white hover:bg-[#f0f6fd]">
                  <Link className="flex h-full w-full items-center justify-center px-3 py-1 leading-7">
                    <span className="text-[14px] font-light text-third">
                      Đăng ký
                    </span>
                  </Link>
                </span>
                <span className="min-h-[36px] rounded-[4px] bg-white leading-7 hover:bg-[#f0f6fd]">
                  <Link className="flex h-full w-full items-center justify-center px-3 py-1">
                    <span className="text-[14px] font-light text-third">
                      Đăng nhập
                    </span>
                  </Link>
                </span>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
