import { FaCheck } from "react-icons/fa";
import PropTypes from "prop-types";

const HeaderProgress = ({ step }) => {
  return (
    <div className="mb-6 bg-white py-4">
      <div className="mx-auto max-w-[1110px] px-4">
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#006ce4] text-sm text-white">
              <FaCheck />
            </div>
            <span className="ml-2 font-bold">Bạn chọn</span>
          </div>
          <div className="mx-2 h-[0.5px] w-16 flex-1 bg-black"></div>
          <div className="flex items-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#006ce4] text-sm text-white">
              {step === 2 || step === 3 ? <FaCheck /> : <span>2</span>}
            </div>
            <span className="ml-2 font-bold">Chi tiết về bạn</span>
          </div>
          <div className="mx-2 h-[0.5px] w-16 flex-1 bg-black"></div>
          <div
            className={`flex items-center ${step === 3 ? "text-black" : "text-gray-400"}`}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full ${step === 3 ? "bg-[#006ce4]" : "bg-gray-400"} text-sm text-white`}
            >
              3
            </div>
            <span className="ml-2 font-bold">Hoàn tất đặt phòng</span>
          </div>
        </div>
      </div>
    </div>
  );
};
HeaderProgress.propTypes = {
  step: PropTypes.number.isRequired,
};

export default HeaderProgress;
