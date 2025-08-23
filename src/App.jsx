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
import AuthGuard from "./utils/AuthGuard.jsx";
import PageNotFound from "./components/PageNotFound.jsx";
import Unauthorized from "./components/Unauthorized.jsx";
import AccountRecovery from "./components/AccountRecovery.jsx";
import Dashboard from "./components/Dashboard.jsx";

const App = () => {
    return (
        <React.Fragment>
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
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
            />
            <ScrollHandler />
            <Nav/>
            <Routes>
                <Route path="/" element={
                    <>
                        <Home/>
                        <AboutUs/>
                        <Services/>
                    </>
                } />

                <Route path="/login" element={
                    <AuthGuard requireAuth={false}>
                        <Login />
                    </AuthGuard>
                } />

                <Route path="/forgot-username" element={
                    <AuthGuard requireAuth={false}>
                        <AccountRecovery />
                    </AuthGuard>
                } />
                <Route path="/validate-user" element={
                    <AuthGuard requireAuth={false}>
                        <AccountRecovery />
                    </AuthGuard>
                } />
                <Route path="/forgot-password" element={
                    <AuthGuard requireAuth={false}>
                        <AccountRecovery />
                    </AuthGuard>
                } />

                <Route path="/customer-register" element={
                    <AuthGuard requireAuth={false}>
                        <Register />
                    </AuthGuard>
                } />

                <Route path="/owner-register" element={
                    <AuthGuard
                        requireAuth={true}
                        allowedRoles={['OWNER']}
                        unauthorizedFallback="/unauthorized"
                    >
                        <Register />
                    </AuthGuard>
                } />

                <Route path="/employee-register" element={
                    <AuthGuard
                        requireAuth={true}
                        allowedRoles={['OWNER']}
                        unauthorizedFallback="/unauthorized"
                    >
                        <Register />
                    </AuthGuard>
                } />

                <Route path="/dashboard" element={
                    <AuthGuard
                        requireAuth={true}
                        allowedRoles={['OWNER', 'EMPLOYEE', 'CUSTOMER']}
                        unauthorizedFallback="/unauthorized"
                    >
                        <Dashboard />
                    </AuthGuard>
                } />

                <Route path="/unauthorized" element={ <Unauthorized /> } />

                <Route path="*" element={ <PageNotFound /> } />
            </Routes>
            <ContactUs/>
        </React.Fragment>
    );
}

export default App;