import { Link } from "react-router";
import logo from "../../assets/logo.svg";
import PropTypes from "prop-types";

const Header = (props) => {
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
            {props.children}
          </nav>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  children: PropTypes.node,
};
Header.defaultProps = {
  children: null,
};

export default Header;
