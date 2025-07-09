import React, { useEffect, useState } from "react";
import { Modal, Tab, Tabs, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/style/Voucher.css";
import { getAuthHeaders } from "../components/Cookie/authUtils";

const baseURL = "https://localhost:7003";

const ExchangePointsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("exchange");
  const [discountCodes, setDiscountCodes] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchDiscountCodes = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/DiscountCode`);
        setDiscountCodes(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy mã giảm giá:", error);
        setMessage("Không thể tải mã giảm giá.");
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/Voucher/history`, getAuthHeaders());
        setHistoryList(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử voucher:", error);
      }
    };

    setMessage("");
    setSuccess(null);
    setLoading(true);
    fetchDiscountCodes();
    fetchHistory();
  }, [isOpen]);

  const handleExchange = async (id) => {
    try {
      const res = await axios.post(
        `${baseURL}/api/Voucher/exchange-discount/${id}`,
        {},
        getAuthHeaders()
      );
      setMessage(res.data.message || "Đổi mã thành công!");
      setSuccess(true);

      // Reload lịch sử sau khi đổi
      const historyRes = await axios.get(`${baseURL}/api/Voucher/history`, getAuthHeaders());
      setHistoryList(historyRes.data);
    } catch (error) {
      const errMsg = error?.response?.data?.message || "Đổi mã thất bại.";
      console.error("Lỗi khi đổi mã:", error);
      setMessage(errMsg);
      setSuccess(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Đổi điểm lấy mã giảm giá</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          {/* TAB: Đổi mã giảm giá */}
          <Tab eventKey="exchange" title="Đổi Mã Giảm Giá">
            <div className="p-3">
              {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
              ) : discountCodes.length === 0 ? (
                <p className="text-center text-muted">Không có mã giảm giá nào.</p>
              ) : (
                <div className="row">
{discountCodes.map((code) => (
                    <div key={code.DiscountCodeId} className="col-md-6 mb-3">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">{code.DiscountCodeName}</h5>
                          <p>{code.Description}</p>
                          <p>Điểm yêu cầu: {code.RequiredPoints}</p>
                          <p>HSD: {new Date(code.EndDate).toLocaleDateString("vi-VN")}</p>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleExchange(code.DiscountCodeId)}
                          >
                            Đổi ngay
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {message && (
                <div className={`alert mt-3 text-center ${success ? "alert-success" : "alert-danger"}`}>
                  {message}
                </div>
              )}
            </div>
          </Tab>

          {/* TAB: Lịch sử đã đổi */}
          <Tab eventKey="history" title="Lịch Sử Đã Đổi">
            <div className="p-3">
              {historyList.length === 0 ? (
                <p className="text-center text-muted">Chưa có lịch sử đổi mã.</p>
              ) : (
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Mã</th>
                      <th>Tên mã</th>
                      <th>Điểm đã dùng</th>
                      <th>Ngày đổi</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyList.map((item) => (
                      <tr key={item.Code}>
                        <td>{item.Code}</td>
                        <td>{item.DiscountCodeName}</td>
                        <td>{item.RequiredPoints}</td>
                        <td>{new Date(item.CreatedAt).toLocaleDateString("vi-VN")}</td>
                        <td>
                          {item.IsUsed ? (
                            <span className="text-success">Đã sử dụng</span>
                          ) : (
                            <span className="text-warning">Chưa sử dụng</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExchangePointsModal;