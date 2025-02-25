import FormSearchBox from "../FormSearchBox/FormSearchBox";

const Banner = () => {
  return (
    <div className="relative w-full bg-primary text-white">
      {/* banner */}
      <div className="pb-[160px] md:pb-0">
        <div className="relative mx-auto flex min-h-[240px] max-w-[1110px] px-[5px] pt-16 pb-[78px]">
          <div className="my-auto max-w-[890px]">
            <h1 className="text-5xl leading-16 font-extrabold">
              Tìm chỗ nghỉ tiếp theo
            </h1>
            <p className="mt-1 text-2xl">
              Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa...
            </p>
          </div>
        </div>
      </div>

      <FormSearchBox />
    </div>
  );
};

export default Banner;
