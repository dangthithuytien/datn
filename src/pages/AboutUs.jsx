import React from "react";
import "../components/style/AboutUs.css"; // import CSS

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>Chào mừng đến với <span className="highlight">Hexa Clover</span></h1>
        <p>“Nơi tri thức nở rộ, nơi đam mê thăng hoa.”</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>🌿 Về chúng tôi</h2>
          <p>
            Hexa Clover là một cửa hàng sách độc lập với sứ mệnh tạo dựng một cộng
            đồng yêu sách, nơi mọi người có thể tìm thấy kiến thức, cảm hứng và sự kết nối. 
          </p>
        </section>

        <section className="about-section">
          <h2>📚 Bộ sưu tập của chúng tôi</h2>
          <p>
            Chúng tôi tự hào mang đến đa dạng thể loại: tiểu thuyết, khoa học, lược sử,
            phong cách sống, thiếu nhi và nhiều thể loại khác được tuyển chọn kỹ lưỡng.
          </p>
        </section>

        <section className="about-section">
          <h2>🤝 Dịch vụ nổi bật</h2>
          <ul>
            <li>Mua & thuê sách với nhiều ưu đãi hấp dẫn</li>
            <li>Tư vấn chọn sách phù hợp với độ tuổi, sở thích</li>
            <li>Tổ chức sự kiện đọc sách, chia sẻ và workshop</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>🌟 Tại sao chọn chúng tôi?</h2>
          <p>
            - Không gian thân thiện, yên tĩnh và đầy cảm hứng.<br />
            - Giao hàng nhanh, đóng gói cẩn thận.<br />
            - Hỗ trợ khách hàng tận tâm và chính sách đổi trả linh hoạt.
          </p>
        </section>
      </div>

      <div className="about-footer">
        <h2>Liên hệ</h2>
        <p>Email: support@hexaclover.com | Hotline: 1900 1234</p>
        <p>Địa chỉ: 123 Đường Tri Thức, Quận Kiến Thức, Thành phố Sách Mạnh</p>
      </div>
    </div>
  );
};

export default AboutUs;
