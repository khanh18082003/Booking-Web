import vnLanguage from "../../assets/vn-language.png";
const Language = () => {
  return (
    <span className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-[4px] duration-200 hover:bg-white/10">
      <button className="inline-flex cursor-pointer items-center justify-center px-3 py-2 align-middle">
        <span className="max-w-[24px] overflow-hidden rounded-full">
          <img src={vnLanguage} alt="" className="w-full" />
        </span>
      </button>
    </span>
  );
};

export default Language;
