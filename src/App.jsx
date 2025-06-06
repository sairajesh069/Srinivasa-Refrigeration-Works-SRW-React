import React from "react";
import Nav from "./components/Nav.jsx";
import Home from "./components/Home.jsx";
import AboutUs from "./components/AboutUs.jsx";
import Services from "./components/Services.jsx";
import ContactUs from "./components/ContactUs.jsx";
import { Route, Routes } from "react-router";

const App = () => {
    return (
        <React.Fragment>
            <Nav/>
            <Routes>
                <Route path="/" element={ <Home/> } />
            </Routes>
            <AboutUs/>
            <Services/>
            <ContactUs/>
        </React.Fragment>
    );
}

export default App;