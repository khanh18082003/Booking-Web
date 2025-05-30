import { useNavigate } from "react-router-dom";

const propertyTypes = [
  {
    key: "apartment",
    icon: (
      <svg width="48" height="48" fill="#0061c2" viewBox="0 0 24 24">
        <rect x="5" y="7" width="14" height="12" rx="2" />
        <rect x="9" y="11" width="2" height="2" fill="#0061c2" />
        <rect x="13" y="11" width="2" height="2" fill="#0061c2" />
        <rect x="9" y="15" width="2" height="2" fill="#0061c2" />
        <rect x="13" y="15" width="2" height="2" fill="#0061c2" />
      </svg>
    ),
    title: "Căn hộ",
    desc: "Chỗ nghỉ tự nấu nướng, đầy đủ nội thất mà khách thuê nguyên căn.",
  },
  {
    key: "villa",
    icon: (
      <svg width="48" height="48" fill="#0061c2" viewBox="0 0 24 24">
        <path d="M3 11L12 4l9 7v8a2 2 0 0 1-2 2h-2v-5H7v5H5a2 2 0 0 1-2-2v-8z" />
      </svg>
    ),
    title: "Villa",
    desc: "Các chỗ nghỉ như nhà căn hộ, nhà nghỉ dưỡng, biệt thự, v.v.",
  },
  {
    key: "hotel",
    icon: (
      <svg width="48" height="48" fill="#0061c2" viewBox="0 0 24 24">
        <rect x="4" y="7" width="16" height="13" rx="2" />
        <rect x="7" y="10" width="2" height="2" fill="#0061c2" />
        <rect x="11" y="10" width="2" height="2" fill="#0061c2" />
        <rect x="15" y="10" width="2" height="2" fill="#0061c2" />
        <rect x="7" y="14" width="2" height="2" fill="#0061c2" />
        <rect x="11" y="14" width="2" height="2" fill="#0061c2" />
        <rect x="15" y="14" width="2" height="2" fill="#0061c2" />
      </svg>
    ),
    title: "Khách sạn",
    desc: "Các chỗ nghỉ như khách sạn, nhà nghỉ B&B, hostel, khách sạn căn hộ, v.v.",
  },
];

const PropertiesType = () => {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    // Chuyển hướng sang trang tiếp theo, truyền type nếu cần
    navigate(`/host/add-property?type=${type}`);
  };

  return (
    <div className="mx-auto mt-10 max-w-6xl px-4">
      <h1 className="mb-2 text-3xl font-bold">
        Đăng chỗ nghỉ của Quý vị trên Booking.com và bắt đầu đón tiếp khách thật
        nhanh chóng!
      </h1>
      <p className="mb-8 text-lg text-gray-700">
        Để bắt đầu, chọn loại chỗ nghỉ Quý vị muốn đăng trên Booking.com
      </p>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {propertyTypes.map((item, idx) => (
          <div
            key={item.key}
            className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 shadow transition hover:shadow-lg"
          >
            {idx === 0 && (
              <span className="mb-2 inline-block rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                Bắt đầu nhanh
              </span>
            )}
            <div className="mb-4">{item.icon}</div>
            <h2 className="mb-2 text-xl font-semibold text-blue-700">
              {item.title}
            </h2>
            <p className="mb-6 text-center text-gray-600">{item.desc}</p>
            <button
              className="mt-auto w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
              onClick={() => handleSelect(item.key)}
            >
              Đăng chỗ nghỉ
            </button>
          </div>
        ))}
      </div>{" "}
    </div>
  );
};

export default PropertiesType;
