import { MdPayment } from "react-icons/md";
import { CiUser, CiLock, CiMail, CiHeart } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { PiSuitcase } from "react-icons/pi";
import { FaRegComment } from "react-icons/fa";
import { TbHomePlus } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";
import { useStore } from "../utils/AuthProvider";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { setPageTitle, PAGE_TITLES } from "../utils/pageTitle";

const Profile = () => {
  useEffect(() => {
    setPageTitle(PAGE_TITLES.PROFILE);
  }, []);

  const { store, setStore } = useStore();
  const [isProfileFinishedVisible, setIsProfileFinishedVisible] =
    useState(true);

  // Mock user data - in a real app, this would come from an API
  const user = store.userProfile || {
    avatar: null,
    name: "Bạn",
  };

  // Settings sections for the cards
  const settingsSections = [
    {
      title: "Thông tin thanh toán",
      items: [
        { icon: <MdPayment />, label: "Phương thức thanh toán", href: "#" },
      ],
    },
    {
      title: "Quản lý tài khoản",
      items: [
        {
          icon: <CiUser />,
          label: "Thông tin cá nhân",
          href: "/myaccount/personal",
        },
        { icon: <CiLock />, label: "Cài đặt bảo mật", href: "#" },
        { icon: <GoPeople />, label: "Người đi cùng", href: "#" },
      ],
    },
    {
      title: "Cài đặt",
      items: [
        {
          icon: <HiOutlineAdjustmentsHorizontal />,
          label: "Cài đặt chung",
          href: "#",
        },
        { icon: <CiMail />, label: "Cài đặt email", href: "#" },
      ],
    },
    {
      title: "Hoạt động du lịch",
      items: [
        { icon: <PiSuitcase />, label: "Chuyến đi và đơn đặt", href: "#" },
        { icon: <CiHeart />, label: "Danh sách đã lưu", href: "#" },
        { icon: <FaRegComment />, label: "Đánh giá của tôi", href: "#" },
      ],
    },
    {
      title: "Trợ giúp",
      items: [
        {
          icon: <FaRegComment />,
          label: "Liên hệ dịch vụ khách hàng",
          href: "#",
        },
        {
          icon: <FaRegComment />,
          label: "Trung tâm thông tin và bảo mật",
          href: "#",
        },
        { icon: <FaRegComment />, label: "Giải quyết khiếu nại", href: "#" },
      ],
    },
    {
      title: "Pháp lý và quyền riêng tư",
      items: [
        {
          icon: <FaRegComment />,
          label: "Quản lý quyền riêng tư và dữ liệu",
          href: "#",
        },
        { icon: <FaRegComment />, label: "Hướng dẫn nội dung", href: "#" },
      ],
    },
    {
      title: "Dành cho chủ chỗ nghỉ",
      items: [{ icon: <TbHomePlus />, label: "Đăng chỗ nghỉ", href: "#" }],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Profile Header Section */}
      <div className="bg-primary text-white">
        <div className="mx-auto max-w-[1110px] px-4 py-6">
          <div className="flex items-center">
            <div className="mr-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-[#f5a623] bg-white">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.name}'s avatar`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-[#003580]">
                    {user.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            <div>
              <h1 className="mb-1 text-4xl font-medium">Chào {user.name}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-[1110px] px-4 py-6">
        {/* Benefits Section */}

        {isProfileFinishedVisible && (
          <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
            <div className="">
              <h2 className="mb-4 text-lg font-medium">
                Hoàn tất hồ sơ của bạn
              </h2>
              <p className="mb-4 text-sm text-neutral-800">
                Hoàn thành hồ sơ và sử dụng thông tin này cho đơn đặt tới
              </p>

              <div className="flex items-center">
                <button
                  type="button"
                  className="cursor-pointer rounded-[4px] bg-third px-3 py-1 text-sm leading-7 text-white duration-200 hover:bg-secondary"
                >
                  Hoàn tất ngay
                </button>
                <button
                  type="button"
                  className="ml-1 cursor-pointer rounded-[4px] bg-white px-3 py-1 text-sm leading-7 text-third duration-200 hover:bg-third/10"
                  onClick={() => setIsProfileFinishedVisible((prev) => !prev)}
                >
                  Không phải bây giờ
                </button>
              </div>
            </div>

            <div className="rounded-[6px] bg-third/10 p-7">
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
                <VscAccount className="h-full w-full font-medium text-third" />
              </span>
            </div>
          </div>
        )}

        {/* Account Settings Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {settingsSections.map((section, index) => (
            <div key={index} className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-medium">{section.title}</h2>

              <ul className="space-y-4">
                {section.items.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item.href}
                      className="group flex items-center justify-between text-neutral-800 hover:text-[#0071c2]"
                    >
                      <div className="flex items-center">
                        <span className="mr-2 text-xl text-neutral-400 group-hover:text-[#0071c2]">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-neutral-400 group-hover:text-[#0071c2]"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Profile;
