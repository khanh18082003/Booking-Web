import PropTypes from "prop-types";
import { RiSubtractLine } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
const NumerOfPersonBox = ({ numbers, increase, decrease }) => {
  console.log(numbers);
  return (
    <div className="absolute right-auto z-[999] min-w-[350px] rounded-[8px] bg-white shadow-[0px_2px_16px_0px_rgba(26,26,26,.24)]">
      <div className="p-8">
        <div>
          {Object.keys(numbers).map((key) => {
            console.log("Key:", key);
            console.log("numbers[key]:", numbers[key]);
            return (
              <div key={key} className="flex items-center justify-between pb-1">
                <input
                  type="range"
                  id="group-adults"
                  aria-valuenow={numbers[key].valueNow}
                  aria-valuemin={numbers[key].valueMin}
                  aria-valuemax={numbers[key].valueMax}
                  className="absolute h-0 w-0 overflow-hidden opacity-0"
                />
                <div>
                  <label htmlFor="group-adults">{numbers[key].name}</label>
                </div>
                <div className="flex items-center justify-around overflow-hidden rounded-[4px] border-[1px] border-solid border-[#868686]">
                  <button
                    onClick={() => decrease(key)}
                    type="button"
                    className={`flex h-[40px] w-[40px] items-center rounded-[4px] px-2 py-1 ${numbers[key].valueNow === numbers[key].valueMin ? "cursor-not-allowed text-gray-300" : "cursor-pointer text-blue-400 hover:bg-blue-50"}`}
                  >
                    <span className="flex items-center text-[20px]">
                      <RiSubtractLine />
                    </span>
                  </button>
                  <span className="mx-1 min-w-[36px] text-center">
                    {numbers[key].valueNow}
                  </span>
                  <button
                    onClick={() => increase(key)}
                    type="button"
                    className={`flex h-[40px] w-[40px] items-center rounded-[4px] px-2 py-1 ${numbers[key].valueNow === numbers[key].valueMax ? "cursor-not-allowed text-gray-300" : "cursor-pointer text-blue-400 hover:bg-blue-50"}`}
                  >
                    <span className="flex items-center text-[20px]">
                      <IoMdAdd />
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
NumerOfPersonBox.propTypes = {
  increase: PropTypes.func.isRequired,
  decrease: PropTypes.func.isRequired,
  numbers: PropTypes.shape({
    adults: PropTypes.shape({
      valueNow: PropTypes.number.isRequired,
      valueMin: PropTypes.number.isRequired,
      valueMax: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    children: PropTypes.shape({
      valueNow: PropTypes.number.isRequired,
      valueMin: PropTypes.number.isRequired,
      valueMax: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    rooms: PropTypes.shape({
      valueNow: PropTypes.number.isRequired,
      valueMin: PropTypes.number.isRequired,
      valueMax: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default NumerOfPersonBox;
