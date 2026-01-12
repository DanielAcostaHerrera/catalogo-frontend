// src/components/Toast.jsx
// src/components/Toast.jsx
import { useState, forwardRef, useImperativeHandle } from "react";

const Toast = forwardRef((props, ref) => {
    const [message, setMessage] = useState(null);

    useImperativeHandle(ref, () => ({
        showToast(msg) {
            setMessage(msg);
            setTimeout(() => setMessage(null), 2000);
        }
    }));

    return (
        <>
            {message && (
                <div style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    background: "#333",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "5px"
                }}>
                    {message}
                </div>
            )}
        </>
    );
});

export default Toast;