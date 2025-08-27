import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme, useMediaQuery } from "@mui/material";

const CustomToast = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastStyle={{
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                width: isMobile ? "240px" : "360px",
                fontSize: isMobile ? "0.8rem" : "1rem"
            }}
        />
    );
};

export default CustomToast;