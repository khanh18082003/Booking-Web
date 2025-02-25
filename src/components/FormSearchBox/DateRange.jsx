import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import PropTypes from "prop-types";
import { vi } from "date-fns/locale";

const DateRange = ({ date, handleChange, className }) => {
  return (
    <div>
      <DateRangePicker
        ranges={[date]}
        onChange={handleChange}
        minDate={new Date()}
        locale={vi}
        className={className}
      />
    </div>
  );
};
DateRange.propTypes = {
  date: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};

export default DateRange;
