import { useStore } from "../../utils/AuthProvider";
import FormSearchBox from "../FormSearchBox/FormSearchBox";
import PropTypes from "prop-types";

const Banner = ({ showTitle = true }) => {
  const { store } = useStore();
  return (
    <div
      className={`relative z-[1000] w-full bg-primary text-white ${showTitle ? "mb-[96px]" : "mb-[96px] max-lg:mb-[200px]"}`}
    >
      {/* banner */}
      {showTitle && (
        <div className="pb-[160px] md:pb-0">
          <div className="relative mx-auto flex min-h-[240px] max-w-[1110px] px-[5px] pt-16 pb-[78px]">
            <div className="my-auto max-w-[890px]">
              <h1
                data-aos="fade-up"
                data-aos-duration="500"
                data-aos-delay="100"
                className="text-5xl leading-16 font-extrabold"
              >
                {store.userProfile?.first_name
                  ? `${store.userProfile?.first_name}, kế tiếp bạn sẽ du lịch đến đâu?`
                  : "Tìm chỗ nghỉ tiếp theo"}
              </h1>
              <p
                data-aos="fade-up"
                data-aos-duration="500"
                data-aos-delay="100"
                className="mt-1 text-2xl"
              >
                Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa...
              </p>
            </div>
          </div>
        </div>
      )}
      {!showTitle && <div className="h-16"></div>}

      <FormSearchBox showTitle={showTitle} />
    </div>
  );
};

Banner.propTypes = {
  showTitle: PropTypes.bool,
};

export default Banner;
