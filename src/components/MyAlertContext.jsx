import React, { createContext, useState, useContext, useRef } from "react";
import { createPortal } from "react-dom";
import "../components/style/MyAlert.css";

const MyAlertContext = createContext();
export const useMyAlert = () => useContext(MyAlertContext);

export const MyAlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null); // { msg, type, onConfirm }
    const confirmCallback = useRef(null); // callback cho nút "Có"

    const showAlert = (msg, type = "success") => {
        return new Promise((resolve) => {
          setAlert({ msg, type });
          if (type === "warning") {
            confirmCallback.current = resolve; // Sẽ resolve(true/false) ở handleConfirm hoặc hideAlert
          } else {
            setTimeout(() => {
              setAlert(null);
              resolve(true); // Success alert tự động resolve
            }, 3000);
          }
        });
      };
    const handleConfirm = () => {
        if (confirmCallback.current) {
          confirmCallback.current(true); // resolve true khi người dùng nhấn "Có"
        }
        hideAlert();
      };
      
      const hideAlert = () => {
        if (confirmCallback.current) {
          confirmCallback.current(false); // resolve false khi người dùng nhấn "Không"
        }
        confirmCallback.current = null;
        setAlert(null);
    };
      

    const getStyleByType = (type) => {
        switch (type) {
            case "error":
                return "bg-red-50 text-red-800 border-red-400";
            case "warning":
                return "bg-yellow-50 text-yellow-800 border-yellow-400";
            case "success":
            default:
                return "bg-emerald-50 text-emerald-800 border-emerald-400";
        }
    };

    const alertBox = alert && (
        <div className={`alert-box alert-${alert.type}`}>
            <div className="alert-content">
                <div>
                    <div className="alert-title">Thông báo</div>
                    <div className="alert-message">{alert.msg}</div>
                    {alert.type === "warning" && (
                        <div className="alert-buttons mt-2 flex gap-2">
                            <button className="px-3 py-1 bg-green-500  rounded" onClick={handleConfirm}>Có</button>
                            <button className="px-3 py-1 bg-gray-400  rounded" onClick={hideAlert}>Không</button>
                        </div>
                    )}
                </div>
            </div>
            {(!confirmCallback.current || alert.type !== "warning") && (
                <button onClick={hideAlert}>✕</button>
            )}
        </div>
    );

    return (
        <MyAlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            {typeof window !== "undefined" &&
                createPortal(
                    <div
                        style={{
                            position: "fixed",
                            top: "20px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 99999,
                            pointerEvents: "auto",
                        }}
                    >
                        {alertBox}
                    </div>,
                    document.getElementById("alert-root")
                )}
        </MyAlertContext.Provider>
    );
};
