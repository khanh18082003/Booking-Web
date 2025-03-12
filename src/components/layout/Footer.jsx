import languageImage from "../../assets/vn-language.png";
import logoFooter from "../../assets/logo-footer.svg";
import agoda from "../../assets/agoda.svg";
import priceline from "../../assets/priceline.svg";
/**
 * Footer component renders the footer section of the application.
 *
 * @component
 * @example
 * return (
 *   <Footer />
 * )
 */

const Footer = () => {
  return (
    <footer className="bg-gray-100 px-4 py-8 text-sm text-gray-800">
      <div className="mx-auto max-w-[1110px]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Support Column */}
          <div>
            <h3 className="mb-4 font-bold">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Các câu hỏi thường gặp về virus corona (COVID-19)
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Quản lí các chuyến đi của bạn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Liên hệ Dịch vụ Khách hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Trung tâm thông tin bảo mật
                </a>
              </li>
            </ul>
          </div>

          {/* Discover Column */}
          <div>
            <h3 className="mb-4 font-bold">Khám phá thêm</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Chương trình khách hàng thân thiết Genius
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Ưu đãi theo mùa và dịp lễ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Bài viết về du lịch
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Booking.com dành cho Doanh Nghiệp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Traveller Review Awards
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Cho thuê xe hơi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Tìm chuyến bay
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Đặt nhà hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Booking.com dành cho Đại Lý Du Lịch
                </a>
              </li>
            </ul>
          </div>

          {/* Terms Column */}
          <div>
            <h3 className="mb-4 font-bold">Điều khoản và cài đặt</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Bảo mật & Cookie
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Điều khoản và điều kiện
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Tranh chấp đối tác
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Chính sách chống Nô lệ Hiện đại
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Chính sách về Quyền con người
                </a>
              </li>
            </ul>
          </div>

          {/* Partners Column */}
          <div>
            <h3 className="mb-4 font-bold">Dành cho đối tác</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Đăng nhập vào trang Extranet
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Trợ giúp đối tác
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Đăng chỗ nghỉ của Quý vị
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Trở thành đối tác phân phối
                </a>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h3 className="mb-4 font-bold">Về chúng tôi</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Về Booking.com
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Chúng tôi hoạt động như thế nào
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Du lịch bền vững
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Truyền thông
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Cơ hội việc làm
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Quan hệ cổ đông
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Liên hệ công ty
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Currency and Flag */}
        <div className="mt-8 flex flex-wrap border-b border-gray-300 pb-6">
          <div className="mr-6 flex items-center">
            <img
              src={languageImage}
              alt="Vietnam flag"
              className="mr-2 h-6 w-6 rounded-full"
            />
            <span>VND</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-xs text-gray-600 md:text-left lg:text-center">
          <p>
            Booking.com là một phần của Booking Holdings Inc., tập đoàn đứng đầu
            thế giới về du lịch trực tuyến và các dịch vụ liên quan.
          </p>
          <p>Bản quyền © 1996 - 2025 Booking.com™. Bảo lưu mọi quyền.</p>
        </div>

        {/* Partner Logos */}
        <div className="mt-6 flex flex-wrap items-center justify-center space-x-6">
          <img src={logoFooter} alt="Booking.com" className="h-4" />
          <img src={priceline} alt="Priceline" className="h-4" />
          <img src={agoda} alt="Agoda" className="h-4" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
