import PropTypes from "prop-types";
import { Link } from "react-router";

const TravelDestinationCard = ({ city, imageUrl }) => {
  return (
    <Link
      to={`/${city}`}
      className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:transform hover:shadow-xl"
    >
      <img
        src={imageUrl}
        alt={`${city} - Vietnam`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
      />
      <div className="bg-opacity-80 absolute top-4 left-4 flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 font-semibold text-white shadow-md">
        <div className="relative h-3 w-5 bg-red-600">
          <span className="absolute inset-0 flex items-center justify-center text-xs text-yellow-300">
            ★
          </span>
        </div>
        {city}
      </div>
    </Link>
  );
};

const VietnamTravelDestinations = () => {
  const destinations = [
    {
      city: "Đà Lạt",
      imageUrl:
        "https://cf.bstatic.com/xdata/images/city/600x600/688831.jpg?k=7b999c7babe3487598fc4dd89365db2c4778827eac8cb2a47d48505c97959a78&o=",
    },
    {
      city: "TP. Hồ Chí Minh",
      imageUrl:
        "https://cf.bstatic.com/xdata/images/city/600x600/688893.jpg?k=d32ef7ff94e5d02b90908214fb2476185b62339549a1bd7544612bdac51fda31&o=",
    },
    {
      city: "Nha Trang",
      imageUrl:
        "https://cf.bstatic.com/xdata/images/city/600x600/688907.jpg?k=8a219233969467d9f7ff828918cce2a53b4db6f1da1039d27222441ffb97c409&o=",
    },
    {
      city: "Hội An",
      imageUrl:
        "https://cf.bstatic.com/xdata/images/city/600x600/688866.jpg?k=fc9d2cb9fe2f6d1160e10542cd2b83f5a8008401d33e8750ee3c2691cf4d4f7e&o=",
    },
    {
      city: "Đà Nẵng",
      imageUrl:
        "https://cf.bstatic.com/xdata/images/city/600x600/688844.jpg?k=02892d4252c5e4272ca29db5faf12104004f81d13ff9db724371de0c526e1e15&o=",
    },
  ];

  return (
    <div className="mx-auto p-5">
      <div className="mb-6 flex flex-col justify-center gap-1">
        <h2 className="text-2xl font-bold text-gray-800 md:text-[26px]">
          Điểm đến đang thịnh hành
        </h2>
        <p className="text-[16px] text-[#595959]">
          Du khách tìm kiếm về Việt Nam cũng đặt chỗ ở những nơi này
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <TravelDestinationCard
          city={destinations[0].city}
          imageUrl={destinations[0].imageUrl}
        />
        <TravelDestinationCard
          city={destinations[1].city}
          imageUrl={destinations[1].imageUrl}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <TravelDestinationCard
          city={destinations[2].city}
          imageUrl={destinations[2].imageUrl}
        />
        <TravelDestinationCard
          city={destinations[3].city}
          imageUrl={destinations[3].imageUrl}
        />
        <TravelDestinationCard
          city={destinations[4].city}
          imageUrl={destinations[4].imageUrl}
        />
      </div>
    </div>
  );
};

TravelDestinationCard.propTypes = {
  city: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default VietnamTravelDestinations;
