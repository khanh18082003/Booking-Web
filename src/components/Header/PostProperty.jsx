import { Link } from "react-router";

const PostProperty = () => {
  return (
    <span className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-[4px] duration-200 hover:bg-white/10">
      <Link
        className="flex h-full w-full items-center justify-center px-3 py-2"
        to={"/host/login"}
      >
        <span className="text-[16px]">Đăng chỗ nghỉ của Quý vị</span>
      </Link>
    </span>
  );
};

export default PostProperty;
