import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CiUser, CiLock } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { MdPayment } from "react-icons/md";
import { RiShieldUserLine } from "react-icons/ri";
import { useStore } from "../utils/AuthProvider";
import defaultAvatar from "../assets/default-avatar.avif";
import { IoCameraOutline } from "react-icons/io5";
import ProfileAvatarModal from "../components/common/ProfileAvatarModal";
import axios from "../utils/axiosCustomize";
import { IoChevronDown } from "react-icons/io5";
import countries from "../utils/countries";
import { setPageTitle, PAGE_TITLES } from "../utils/pageTitle";

const Personal = () => {
  const { store, setStore } = useStore();
  const [activeSection, setActiveSection] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState(null);
  const [formValues, setFormValues] = useState({
    avatar: null,
    first_name: null,
    last_name: null,
    email: null,
    country_code: null,
    phone: null,
    dob: null,
    gender: null,
    nationality: null,
  });
  const [searchCountry, setSearchCountry] = useState("");

  const handleSearchCountry = (e) => {
    setSearchCountry(e.target.value);
    console.log("Searching for country:", searchCountry);
  };
  // Set page title
  useEffect(() => {
    setPageTitle(PAGE_TITLES.PERSONAL);
  }, []);

  // Country dropdown state
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to Vietnam
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef(null);

  // Handle click outside to close country dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setIsCountryDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update form values when user profile changes
  useEffect(() => {
    if (store.userProfile) {
      setFormValues({
        name: store.userProfile?.name || "",
        email: store.userProfile?.email || "",
        country_code: store.userProfile?.country_code || "",
        phone: store.userProfile?.phone || "",
        dob: store.userProfile?.dob || "",
        gender: store.userProfile?.gender || "",
        nationality: store.userProfile?.nationality || "",
        first_name: store.userProfile?.first_name || "",
        last_name: store.userProfile?.last_name || "",
      });

      // Try to extract country code from phone number if it exists
      if (store.userProfile?.phone) {
        // Check if the phone number has a country code prefix
        const phoneWithoutPlus = store.userProfile.phone.startsWith("+")
          ? store.userProfile.phone.substring(1)
          : store.userProfile.phone;

        // Find the country by dial code
        const country = countries.find((c) => {
          const dialCodeWithoutPlus = c.dialCode.substring(1);
          return phoneWithoutPlus.startsWith(dialCodeWithoutPlus);
        });

        if (country) {
          setSelectedCountry(country);
          // Remove the country code from the phone number to display in the input
          const dialCodeLength = country.dialCode.length - 1; // -1 for the "+" character
          setFormValues((prev) => ({
            ...prev,
            phone: phoneWithoutPlus.substring(dialCodeLength),
          }));
        }
      }
    }
  }, [store.userProfile]);

  // Toggle country dropdown
  const toggleCountryDropdown = () => {
    setIsCountryDropdownOpen((prev) => !prev);
  };

  // Select a country from the dropdown
  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Start editing a section
  const handleEditSection = (index) => {
    setEditingSectionIndex(index);
  };

  // Cancel editing and reset form values
  const handleCancelEdit = () => {
    // Reset form values to original values
    if (store.userProfile) {
      setFormValues({
        name: store.userProfile?.name || "",
        email: store.userProfile?.email || "",
        country_code: store.userProfile?.country_code || "",
        phone: store.userProfile?.phone || "",
        dob: store.userProfile?.dob || "",
        gender: store.userProfile?.gender || "",
        nationality: store.userProfile?.nationality || "",
        first_name: store.userProfile?.first_name || "",
        last_name: store.userProfile?.last_name || "",
      });
    }
    setEditingSectionIndex(null);
  };

  // Save changes for the current editing section
  const handleSaveChanges = async () => {
    try {
      if (!store.userProfile) {
        return;
      }
      // Different API call based on which section is being edited
      let endpoint = "/profile";
      let data = {};

      switch (editingSectionIndex) {
        case 0: // Name
          data = {
            first_name: formValues.first_name,
            last_name: formValues.last_name,
          };
          break;

        // Email is usually not editable directly - would require verification
        case 2: // Phone number
          data = {
            country_code: selectedCountry.dialCode,
            phone_number: formValues.phone,
          };
          break;
        case 3: // Date of birth
          data = { dob: formValues.dob };
          break;
        case 4: // Nationality
          data = { nationality: formValues.nationality };
          break;
        case 5: // Gender
          data = { gender: formValues.gender };
          break;
        default:
          break;
      }

      const response = await axios.patch(endpoint, data);

      if (response.data.code === "M000") {
        // Update local state with the new profile data
        setStore((prevStore) => {
          // Handle special case for name updates
          if (editingSectionIndex === 0) {
            // Create the full name from first_name and last_name
            const fullName =
              `${formValues.first_name || ""} ${formValues.last_name || ""}`.trim();

            return {
              ...prevStore,
              userProfile: {
                ...prevStore.userProfile,
                ...data,
                name: fullName, // Add the combined name field
              },
            };
          }

          return {
            ...prevStore,
            userProfile: {
              ...prevStore.userProfile,
              ...data,
            },
          };
        });

        // Exit edit mode
        setEditingSectionIndex(null);
      } else {
        console.error("Failed to update profile:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const settingsSections = [
    {
      items: {
        icon: <CiUser />,
        label: "Thông tin cá nhân",
        href: "/myaccount/personal",
      },
    },
    {
      items: {
        icon: <CiLock />,
        label: "Cài đặt bảo mật",
        href: "#",
      },
    },
    {
      items: {
        icon: <GoPeople />,
        label: "Người đi cùng",
        href: "#",
      },
    },
    {
      items: {
        icon: <HiOutlineAdjustmentsHorizontal />,
        label: "Cài đặt chung",
        href: "#",
      },
    },
    {
      items: {
        icon: <MdPayment />,
        label: "Phương thức thanh toán",
        href: "#",
      },
    },
    {
      items: {
        icon: <RiShieldUserLine />,
        label: "Quản lý quyền riêng tư và dữ liệu",
        href: "#",
      },
    },
  ];

  const personalInfoSections = [
    {
      label: "Tên",
      value: store.userProfile?.name || "Your name",
      note: "",
    },
    {
      label: "Địa chỉ email",
      value:
        (
          <span>
            {store.userProfile?.email}{" "}
            <span
              className={`${store.userProfile?.is_active ? "bg-green-500" : "bg-red-500"} rounded-full px-2 py-1 text-xs text-white`}
            >
              {store.userProfile?.is_active ? "Xác thực" : "Chưa xác thực"}
            </span>
          </span>
        ) || "Email",
      note: "Đây là địa chỉ email bạn dùng để đăng nhập. Chúng tôi cũng sẽ gửi các xác nhận đặt chỗ tới địa chỉ này.",
    },
    {
      label: "Số điện thoại",
      value: store.userProfile?.phone || "Phone number",
      note: "Chỗ nghỉ hoặc địa điểm tham quan bạn đặt sẽ liên lạc với bạn qua số này nếu cần.",
    },
    {
      label: "Ngày sinh",
      value: store.userProfile?.dob || "Date of birth",
      note: "",
    },
    {
      label: "Quốc tịch",
      value: store.userProfile?.nationality || "Your nationality",
      note: "",
    },
    {
      label: "Giới tính",
      value: store.userProfile?.gender || "Your gender",
      note: "",
    },
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveAvatar = async (file, previewUrl) => {
    if (!store.userProfile) {
      console.error("User profile not found");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.patch("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.code === "M000") {
        const avatarUrl = response.data.data?.avatar || previewUrl;

        setStore((prevStore) => ({
          ...prevStore,
          userProfile: {
            ...prevStore.userProfile,
            avatar: avatarUrl,
          },
        }));
      } else {
        console.error("Failed to update avatar:", response.data.message);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!store.userProfile) {
      console.error("User profile not found");
      return;
    }
    try {
      const response = await axios.delete("/profile/avatar");

      if (response.data.code === "M000") {
        setStore((prevStore) => ({
          ...prevStore,
          userProfile: {
            ...prevStore.userProfile,
            avatar: null,
          },
        }));
      } else {
        console.error("Failed to delete avatar:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting avatar:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-[#003b95] text-white">
        <div className="mx-auto max-w-[1110px] px-4 py-4">
          <div className="flex items-center text-sm">
            <Link to="/myaccount" className="text-white hover:underline">
              Tài khoản
            </Link>
            <span className="mx-2">›</span>
            <span className="font-medium">Thông tin cá nhân</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1110px] px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Sidebar */}
          <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:w-1/4">
            <ul className="space-y-2">
              {settingsSections.map((section, index) => (
                <li
                  key={index}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg p-2.5 font-normal transition-colors hover:bg-gray-100 ${
                    activeSection === index ? "text-[#006ce4]" : "text-gray-700"
                  }`}
                  onClick={() => setActiveSection(index)}
                >
                  <span className="text-xl">{section.items.icon}</span>
                  <span>{section.items.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Details */}
          <div className="w-full rounded-lg bg-white p-6 shadow md:w-3/4">
            <div className="mb-6 flex flex-col justify-between md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Thông tin cá nhân
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Cập nhật thông tin của bạn và tìm hiểu các thông tin này được
                  sử dụng ra sao.
                </p>
              </div>
              {/* Avatar with click handler to open modal */}
              <div
                className="group relative mt-4 h-20 w-20 cursor-pointer overflow-hidden rounded-full md:mt-0"
                onClick={handleOpenModal}
              >
                <img
                  src={store.userProfile?.avatar || defaultAvatar}
                  alt="Avatar"
                  className="h-full w-full rounded-full border-2 border-gray-300 object-cover transition-all duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <IoCameraOutline className="text-2xl text-white" />
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {personalInfoSections.map((section, index) => {
                const isEditing = editingSectionIndex === index;
                const isDisabled =
                  editingSectionIndex !== null && editingSectionIndex !== index;
                const isEmailSection = index === 1; // Email section is at index 2

                return (
                  <div
                    key={index}
                    className={`flex flex-col justify-between py-4 md:flex-row md:items-center ${isDisabled ? "pointer-events-none opacity-50" : ""} ${!isEditing && !isDisabled && !isEmailSection ? "cursor-pointer hover:bg-gray-50" : ""}`}
                    onClick={
                      !isEditing && !isDisabled && !isEmailSection
                        ? () => handleEditSection(index)
                        : undefined
                    }
                  >
                    <div className="flex grow items-center">
                      <p className="mb-2 min-w-[146px] text-[16px] font-[400] text-black">
                        {section.label}
                      </p>
                      <div className="ml-4 flex grow flex-col">
                        {isEditing ? (
                          <>
                            {/* Different input types based on the section */}
                            {index === 0 && (
                              <div className="flex space-x-2">
                                <div>
                                  <label htmlFor="first_name">Tên</label>
                                  <input
                                    id="first_name"
                                    type="text"
                                    name="first_name"
                                    value={formValues.first_name}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-third"
                                    placeholder="Nhập tên của bạn"
                                    autoFocus
                                  />
                                </div>
                                <div>
                                  <label htmlFor="last_name">Họ</label>
                                  <input
                                    id="last_name"
                                    type="text"
                                    name="last_name"
                                    value={formValues.last_name}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-third"
                                    placeholder="Nhập họ của bạn"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Email section is not editable */}
                            {index === 2 && (
                              <>
                                <div className="mb-4 flex items-center justify-between">
                                  <div className="font-medium text-gray-700">
                                    Số điện thoại
                                  </div>
                                </div>
                                <div className="mt-1 flex items-center">
                                  <div
                                    className="relative"
                                    ref={countryDropdownRef}
                                  >
                                    <button
                                      type="button"
                                      className="flex items-center space-x-2 rounded-l-md border border-gray-300 bg-white px-3 py-2 text-sm"
                                      onClick={toggleCountryDropdown}
                                    >
                                      <img
                                        src={selectedCountry.flag}
                                        alt={`${selectedCountry.name} Flag`}
                                        className="h-5 w-5 rounded-full"
                                      />
                                      <IoChevronDown className="text-gray-500" />
                                    </button>
                                    {isCountryDropdownOpen && (
                                      <div className="absolute z-10 mt-1 max-h-60 w-64 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-md">
                                        <div className="sticky top-0 bg-white p-2">
                                          <input
                                            type="text"
                                            placeholder="Tìm quốc gia..."
                                            className="w-full rounded border border-gray-300 px-3 py-1 text-sm"
                                            onChange={handleSearchCountry}
                                          />
                                        </div>
                                        <ul className="max-h-48 overflow-y-auto">
                                          {countries
                                            .filter((country) => {
                                              const searchTerm =
                                                searchCountry.toLowerCase();
                                              return (
                                                country.name
                                                  .toLowerCase()
                                                  .includes(searchTerm) ||
                                                country.dialCode
                                                  .toLowerCase()
                                                  .includes(searchTerm)
                                              );
                                            })
                                            .map((country) => {
                                              const dialCodes =
                                                country.dialCode.split(", ");
                                              return dialCodes.map(
                                                (dialCode, index) => (
                                                  <li
                                                    key={index}
                                                    className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-gray-100"
                                                    onClick={() =>
                                                      handleSelectCountry(
                                                        country,
                                                      )
                                                    }
                                                  >
                                                    <div className="flex items-center space-x-2">
                                                      <img
                                                        src={country.flag}
                                                        alt={`${country.name} Flag`}
                                                        className="h-5 w-5 rounded-full"
                                                      />
                                                      <span>
                                                        {country.name}
                                                      </span>
                                                    </div>
                                                    <span className="text-gray-500">
                                                      {dialCode.trim()}
                                                    </span>
                                                  </li>
                                                ),
                                              );
                                            })}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                  <div className="relative flex-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                      <span className="text-gray-500 sm:text-sm">
                                        {selectedCountry.dialCode}
                                      </span>
                                    </div>
                                    <input
                                      type="tel"
                                      name="phone"
                                      value={formValues.phone}
                                      onChange={handleInputChange}
                                      className="w-full rounded-r-md border border-gray-300 py-2 pr-3 pl-14 text-sm outline-third"
                                      placeholder="Nhập số điện thoại"
                                      autoFocus
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                            {index === 3 && (
                              <input
                                type="date"
                                name="dob"
                                value={formValues.dob}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-third"
                                autoFocus
                              />
                            )}
                            {index === 4 && (
                              <input
                                type="text"
                                name="nationality"
                                value={formValues.nationality}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-third"
                                placeholder="Nhập quốc tịch của bạn"
                                autoFocus
                              />
                            )}
                            {index === 5 && (
                              <div className="relative w-full">
                                <select
                                  name="gender"
                                  value={formValues.gender || ""}
                                  onChange={handleInputChange}
                                  className="mt-1 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-third"
                                  autoFocus
                                >
                                  <option value="" disabled>
                                    Chọn giới tính
                                  </option>
                                  <option value="MALE">Nam</option>
                                  <option value="FEMALE">Nữ</option>
                                  <option value="OTHER">Khác</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 top-0 right-0 mt-1 flex items-center pr-2">
                                  <IoChevronDown className="text-gray-500" />
                                </div>
                              </div>
                            )}
                            <div className="mt-2 flex space-x-2">
                              <button
                                onClick={handleSaveChanges}
                                disabled={store.apiLoading}
                                className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
                              >
                                {store.apiLoading ? "Đang lưu..." : "Lưu"}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="rounded-md bg-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-400"
                              >
                                Hủy
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="mt-1 text-sm text-gray-900">
                              {section.value}
                            </p>
                            {section.note && (
                              <p className="mt-1 text-sm text-gray-500">
                                {section.note}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {!isEditing && (
                      <button
                        onClick={() => handleEditSection(index)}
                        disabled={isDisabled || isEmailSection}
                        className={`mt-2 w-[110px] min-w-[110px] cursor-pointer rounded-md px-3 py-2 text-sm text-third duration-200 ${isDisabled || isEmailSection ? "cursor-not-allowed opacity-50" : "hover:bg-third/15"} md:mt-0`}
                      >
                        {isEmailSection ? "Không thể sửa" : "Chỉnh sửa"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      <ProfileAvatarModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentAvatar={store.userProfile?.avatar || defaultAvatar}
        onSave={handleSaveAvatar}
        onDelete={handleDeleteAvatar}
      />
    </div>
  );
};

export default Personal;
