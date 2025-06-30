import React from "react";
import "../components/style/AboutUs.css"; // import CSS

// Ảnh chính
const mainImage = "https://i.pinimg.com/736x/d7/3e/55/d73e551e54caf6ef7639f382bea8be5d.jpg";

const AboutUs = () => {
  return (
    <div className="about-container">
      {/* Phần tiêu đề chính */}
      <div className="about-hero">
        <h1>
          Chào mừng đến với <span className="highlight">Hexa Clover</span>
        </h1>
        <p>“Nơi tri thức nở rộ, nơi đam mê thăng hoa.”</p>
      </div>

      {/* Ảnh lớn và đoạn mô tả tổng quát */}
      <div className="main-image-section fade-in">
        <img
          src={mainImage}
          alt="Hexa Clover Main"
          className="main-about-image"
        />
        <p className="main-image-description">
          Hexa Clover là điểm đến dành cho những tâm hồn yêu sách và khao khát tri thức.
          Chúng tôi không chỉ đơn thuần cung cấp sách, mà còn mang đến một không gian trải nghiệm
          nơi mỗi trang sách là một cánh cửa mở ra thế giới mới – thế giới của tư duy, cảm xúc,
          và những giá trị sống bền vững.
          <br /><br />
          Tại đây, bạn có thể dễ dàng tìm thấy những đầu sách phù hợp với mọi lứa tuổi và nhu cầu:
          từ sách văn học, kỹ năng sống, kinh doanh, đến tài liệu học tập và sách thiếu nhi.
          Hệ thống của chúng tôi cho phép bạn lựa chọn giữa việc mua hoặc thuê sách
          với chi phí hợp lý và phương thức thanh toán tiện lợi.
          <br /><br />
          Với mong muốn lan tỏa thói quen đọc sách đến cộng đồng, Hexa Clover không ngừng cải tiến dịch vụ,
          cập nhật kho sách phong phú và xây dựng chính sách ưu đãi hấp dẫn. Đội ngũ của chúng tôi luôn
          sẵn sàng đồng hành cùng bạn trên hành trình khám phá tri thức, giúp việc đọc sách trở thành
          một phần không thể thiếu trong cuộc sống hàng ngày.
          <br /><br />
          Chúng tôi tin rằng: Mỗi cuốn sách là một người bạn đồng hành. Mỗi bạn đọc là một mảnh ghép
          tạo nên cộng đồng tri thức bền vững. Và Hexa Clover chính là cây cầu kết nối những tâm hồn
          đồng điệu qua từng trang sách.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
