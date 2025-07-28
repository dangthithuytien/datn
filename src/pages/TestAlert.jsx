import React from "react";
import { useMyAlert } from "../components/MyAlertContext";

const TestAlert = () => {
  const { showAlert } = useMyAlert();

  return (
    <div className="p-5">
      <h3>Test Alert</h3>
      <button
        className="btn btn-success"
        onClick={() => showAlert("✅ Alert hoạt động OK!")}
      >
        Gọi alert
      </button>
    </div>
  );
};

export default TestAlert;
