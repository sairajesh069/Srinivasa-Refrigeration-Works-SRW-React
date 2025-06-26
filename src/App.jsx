import React from "react";
import Nav from "./components/Nav.jsx";
import Home from "./components/Home.jsx";
import AboutUs from "./components/AboutUs.jsx";
import Services from "./components/Services.jsx";
import ContactUs from "./components/ContactUs.jsx";
import Login from "./components/Login.jsx";
import { Route, Routes } from "react-router";
import ScrollHandler from "./utils/ScrollHandler.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from "./components/Register.jsx";

const App = () => {
    return (
        <React.Fragment>
            <ToastContainer position="top-right" autoClose={3000} />
            <ScrollHandler />
            <Nav/>
            <Routes>
                <Route path="/" element={
                    <>
                        <Home/>,
                        <AboutUs/>,
                        <Services/>
                    </>
                } />
                <Route path="/login" element={ <Login/> } />
                <Route path="/customer-register" element={ <Register/> } />
            </Routes>
            <ContactUs/>
        </React.Fragment>
    );
}

export default App;