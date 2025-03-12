import { Link } from "react-router";

const PropertiesList = () => {
  const properties = [
    {
      id: 1,
      name: "ibis Styles Vung Tau",
      location: "Back Beach, Vung Tau",
      rating: 8.1,
      reviews: 1990,
      price: "VND 1,660,000",
      image:
        "https://cf.bstatic.com/xdata/images/hotel/square240/519498616.webp?k=f57b2f30dbdb4a37f096c9e4846cd3a7dfea635e6bc9f63892db7409a2f8b163&o=",
    },
    // Add more properties as needed
  ];

  const getRatingText = (rating) => {
    switch (true) {
      case rating >= 9.0:
        return "Xuất sắc";
      case rating >= 8.0:
        return "Rất tốt";
      case rating >= 7.0:
        return "Tốt";
      default:
        return "Trung bình";
    }
  };

  return (
    <>
      {/* Right Column: Properties List */}
      <div className="w-full lg:flex-auto lg:shrink-1 lg:grow">
        <h2 className="mb-3 text-2xl font-bold">
          Việt Nam: tìm thấy 17.713 chỗ nghỉ
        </h2>
        <p className="mb-3 text-sm text-gray-500">
          Sắp xếp theo: Lựa chọn hàng đầu của chúng tôi
        </p>

        {/* Properties List */}
        {properties.map((property) => (
          <div
            key={property.id}
            className="my-4 rounded-lg border border-[#a3d7fc] bg-[#f0f6ff] p-4 shadow-[0_0_8px_#a3d7fc]"
          >
            <div className="flex">
              <div className="w-[240px]">
                <Link to={`/properties/${property.id}`} target="_blank">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="block rounded-lg object-cover"
                  />
                </Link>
              </div>
              <div className="ml-4 flex-1 shrink grow">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex flex-auto shrink grow flex-col gap-1">
                      <div className="pt-2">
                        <Link to={`/properties/${property.id}`} target="_blank">
                          <h3 className="text-xl font-semibold text-third hover:text-black">
                            {property.name}
                          </h3>
                        </Link>
                      </div>
                      <div className="text-[12px]">
                        <Link to={`/properties/${property.id}`} target="_blank">
                          <span className="cursor-pointer text-third">
                            <span className="mr-2.5 underline">
                              {property.location}
                            </span>
                            <span className="underline">Xem trên bản đồ</span>
                          </span>
                        </Link>
                        <span className="ml-2.5">Cách trung tâm 0,6km</span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center">
                      <Link to={`/properties/${property.id}`} target="_blank">
                        <div className="flex items-center gap-2">
                          <div className="text-end text-sm">
                            <div className="text-lg leading-[20px] font-bold">
                              {getRatingText(property.rating)}
                            </div>
                            <div className="leading-[18px] text-gray-600">
                              {property.reviews} đánh giá
                            </div>
                          </div>
                          <div className="flex h-8 w-8 items-center justify-center rounded-tl-[6px] rounded-tr-[6px] rounded-br-[6px] bg-primary">
                            <span className="text-[16px] font-bold text-white">
                              {property.rating}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="mt-2 text-sm text-gray-500">
                        Phòng Tiêu Chuẩn 2 Giường Đơn <br />1 đêm, 2 người lớn
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="mt-2 text-lg font-bold">{property.price}</p>
                      <p className="text-sm text-gray-500">
                        +VND 222.440 thuế và phí
                      </p>
                      <button className="mt-2 rounded bg-blue-500 px-4 py-2 text-white">
                        Xem chỗ trống
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PropertiesList;
