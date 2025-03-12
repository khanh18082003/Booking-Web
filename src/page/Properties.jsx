import Banner from "../components/layout/Banner";
import PropertiesList from "../components/PropertiesList/PropertiesList";
import { TbArrowsSort } from "react-icons/tb";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { IoMapOutline } from "react-icons/io5";
import PropertiesFilter from "../components/PropertiesList/PropertiesFilter";
import PropertiesMap from "../components/PropertiesList/PropertiesMap";

const Properties = () => {
  return (
    <>
      <Banner showTitle={false} />
      <div className="mx-auto my-0 flex max-w-[1110px] min-w-[620px] flex-col px-2 pt-[10px] lg:flex-auto lg:shrink-0 lg:grow lg:flex-row">
        {/* Sort, Filter, Map < 768px */}
        <div className="w-full text-third lg:hidden">
          <div className="flex items-center justify-between px-4 py-2">
            <button
              className="flex min-h-[36px] grow cursor-pointer items-center justify-center gap-1 rounded-lg px-2 py-1 outline-third duration-200 hover:bg-[#f0f6fd]"
              type="button"
            >
              <span>
                <span>
                  <TbArrowsSort />
                </span>
              </span>
              <span>Sắp xếp</span>
            </button>
            <button
              className="flex min-h-[36px] grow cursor-pointer items-center justify-center gap-1 rounded-lg px-2 py-1 outline-third duration-200 hover:bg-[#f0f6fd]"
              type="button"
            >
              <span>
                <span>
                  <HiOutlineAdjustmentsHorizontal />
                </span>
              </span>
              <span>Lọc</span>
            </button>
            <button
              className="flex min-h-[36px] grow cursor-pointer items-center justify-center gap-1 rounded-lg px-2 py-1 outline-third duration-200 hover:bg-[#f0f6fd]"
              type="button"
            >
              <span>
                <span>
                  <IoMapOutline />
                </span>
              </span>
              <span>Bản đồ</span>
            </button>
          </div>
        </div>
        {/* Sort, Filter, Map > 768px */}
        <div className="mr-4 hidden flex-col lg:block lg:w-[30%]">
          <PropertiesMap />
          <PropertiesFilter />
        </div>
        <PropertiesList />
      </div>
    </>
  );
};

export default Properties;
