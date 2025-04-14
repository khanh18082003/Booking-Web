import PropTypes from "prop-types";

const Navigation = (props) => {
  return (
    <div className="hidden lg:block">
      <div className="flex items-center gap-2 text-white">{props.children}</div>
    </div>
  );
};
Navigation.propTypes = {
  children: PropTypes.node,
};
Navigation.defaultProps = {
  children: null,
};

export default Navigation;
