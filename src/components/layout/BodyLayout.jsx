import AccomodationCategory from "../BodyHome/AccomodationCategory";
import PopularDestination from "../BodyHome/PopularDestination";

const BodyLayout = () => {
  return (
    <div className="mx-auto my-0 max-w-[1110px] min-w-[620px] p-0 pt-[10px]">
      <AccomodationCategory />
      <PopularDestination />
    </div>
  );
};

export default BodyLayout;
