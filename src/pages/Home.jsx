const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 text-green-700">
        Chào mừng đến với BookStore!
      </h1>
      <p className="mb-6">
        Nơi mua sách uy tín, giá tốt với đa dạng thể loại sách phục vụ mọi lứa
        tuổi.
      </p>

      {/* Sách đang bán */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          Sách đang bán
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="border rounded p-4 shadow hover:shadow-lg transition">
            <img
              src="/books/vanhoc1.jpg"
              alt="Văn học 1"
              className="mb-3 w-full h-48 object-cover rounded"
            />
            <h3 className="font-semibold mb-1">Dế Mèn Phiêu Lưu Ký</h3>
            <p className="text-sm text-gray-700 mb-2">Tác giả: Tô Hoài</p>
            <p className="font-bold text-green-700">85.000₫</p>
          </div>
          <div className="border rounded p-4 shadow hover:shadow-lg transition">
            <img
              src="/books/kynang1.jpg"
              alt="Kỹ năng 1"
              className="mb-3 w-full h-48 object-cover rounded"
            />
            <h3 className="font-semibold mb-1">Kỹ năng giao tiếp hiệu quả</h3>
            <p className="text-sm text-gray-700 mb-2">Tác giả: Nguyễn Văn A</p>
            <p className="font-bold text-green-700">120.000₫</p>
          </div>
          <div className="border rounded p-4 shadow hover:shadow-lg transition">
            <img
              src="/books/khoahoc1.jpg"
              alt="Khoa học 1"
              className="mb-3 w-full h-48 object-cover rounded"
            />
            <h3 className="font-semibold mb-1">Khám phá vũ trụ</h3>
            <p className="text-sm text-gray-700 mb-2">Tác giả: Jane Doe</p>
            <p className="font-bold text-green-700">150.000₫</p>
          </div>
          <div className="border rounded p-4 shadow hover:shadow-lg transition">
            <img
              src="/books/kinhte1.jpg"
              alt="Kinh tế 1"
              className="mb-3 w-full h-48 object-cover rounded"
            />
            <h3 className="font-semibold mb-1">Tài chính cá nhân cơ bản</h3>
            <p className="text-sm text-gray-700 mb-2">Tác giả: John Smith</p>
            <p className="font-bold text-green-700">95.000₫</p>
          </div>
        </div>
      </section>

      {/* Sách bán chạy */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          Sách bán chạy
        </h2>
        <ul className="list-decimal list-inside space-y-2 text-gray-800">
          <li>
            <strong>Đắc nhân tâm</strong> – Dale Carnegie
          </li>
          <li>
            <strong>Nhà giả kim</strong> – Paulo Coelho
          </li>
          <li>
            <strong>7 thói quen của người thành đạt</strong> – Stephen Covey
          </li>
          <li>
            <strong>Bí mật tư duy triệu phú</strong> – T. Harv Eker
          </li>
          <li>
            <strong>Điều kỳ diệu của tư duy tích cực</strong> – Norman Vincent
            Peale
          </li>
        </ul>
      </section>

      {/* Dịch vụ */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">Dịch vụ</h2>
        <ul className="list-disc list-inside text-gray-800 space-y-2">
          <li>Mua sách chính hãng, giao hàng nhanh chóng</li>
          <li>Thuê sách theo tháng với giá ưu đãi</li>
          <li>Hỗ trợ đổi trả sách lỗi hoặc không đúng mô tả</li>
          <li>Tư vấn lựa chọn sách phù hợp theo nhu cầu</li>
          <li>Thanh toán linh hoạt: COD, chuyển khoản, thẻ tín dụng</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;
