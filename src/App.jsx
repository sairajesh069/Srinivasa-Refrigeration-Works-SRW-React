import React from "react";
import Nav from "./components/Nav.jsx";
import Home from "./components/home/Home.jsx";
import AboutUs from "./components/home/AboutUs.jsx";
import Services from "./components/home/Services.jsx";
import ContactUs from "./components/ContactUs.jsx";
import Login from "./components/auth/Login.jsx";
import { Route, Routes } from "react-router";
import ScrollHandler from "./utils/ScrollHandler.jsx";
import Register from "./components/auth/Register.jsx";
import AuthGuard from "./utils/AuthGuard.jsx";
import PageNotFound from "./components/exceptions/PageNotFound.jsx";
import Unauthorized from "./components/exceptions/Unauthorized.jsx";
import AccountRecovery from "./components/auth/AccountRecovery.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import UserProfile from "./components/dashboard/UserProfile.jsx";
import UpdateUserProfile from "./components/dashboard/UpdateUserProfile.jsx";
import AccountSettings from "./components/dashboard/AccountSettings.jsx";
import CustomToast from "./utils/CustomToast.jsx";
import ComplaintRegister from "./components/dashboard/ComplaintRegister.jsx";
import DisplayComplaints from "./components/dashboard/DisplayComplaints.jsx";
import UpdateComplaint from "./components/dashboard/UpdateComplaint.jsx";
import DisplayUsers from "./components/dashboard/DisplayUsers.jsx";
import ComplaintFeedback from "./components/dashboard/ComplaintFeedback.jsx";
import DisplayNotifications from "./components/dashboard/DisplayNotifications.jsx";
import { PrivacyPolicyProvider } from './utils/PrivacyPolicyContext';

const App = () => {
    return (
        <React.Fragment>
            <CustomToast />
            <ScrollHandler />
            <Nav/>
            <PrivacyPolicyProvider>
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

                    <Route path="/profile" element={
                        <AuthGuard
                            requireAuth={true}
                            allowedRoles={['OWNER', 'EMPLOYEE', 'CUSTOMER']}
                            unauthorizedFallback="/unauthorized"
                        >
                            <UserProfile />
                        </AuthGuard>
                    } />

                    <Route path="/update-profile" element={
                        <AuthGuard
                            requireAuth={true}
                            allowedRoles={['OWNER', 'EMPLOYEE', 'CUSTOMER']}
                            unauthorizedFallback="/unauthorized"
                        >
                            <UpdateUserProfile />
                        </AuthGuard>
                    } />

                    <Route path="/account-settings" element={
                        <AuthGuard
                            requireAuth={true}
                            allowedRoles={['OWNER', 'EMPLOYEE', 'CUSTOMER']}
                            unauthorizedFallback="/unauthorized"
                        >
                            <AccountSettings />
                        </AuthGuard>
                    } />

                    <Route path="/complaint-register" element={
                        <AuthGuard
                            requireAuth={true}
                            allowedRoles={['OWNER', 'EMPLOYEE', 'CUSTOMER']}
                            unauthorizedFallback="/unauthorized"
                        >
                            <ComplaintRegister />
                        </AuthGuard>
                    } />

                    <Route path="/my-complaints" element={
                        <AuthGuard
                            requireAuth={true}
                            allowedRoles={['OWNER', 'EMPLOYEE', 'CUSTOMER']}
                            unauthorizedFallback="/unauthorized"
                        >
                            <DisplayComplaints />
                        </AuthGuard>
                    } />

                    <Route path="/all-complaints" element={
                        <AuthGuard
                            requireAuth={true}
                            allowedRoles={['OWNER']}
                            unauthorizedFallback="/unauthorized"
                        >
                            <DisplayComplaints />
                        </AuthGuard>
                    } />

                    <Route path="/assigned-complaints" element={
                        <AuthGuard
                            requireAuth={true}
                            allowedRoles={['EMPLOYEE']}
                            unauthorizedFallback="/unauthorized"
                        >
                            <DisplayComplaints />
                        </AuthGuard>
                    } />

                    <Route path="/update-complaint" element={
                        <AuthGuard
                            requireAuth={true}
                            allowedRoles={['CUSTOMER', 'EMPLOYEE', 'OWNER']}
                            unauthorizedFallback="/unauthorized"
                        >
                            <UpdateComplaint />
                        </AuthGuard>
                    } />

                    <Route path="/owner-list" element={
                        <AuthGuard
                            requireAuth={true}
                            allowedRoles={['OWNER']}
                            unauthorizedFallback="/unauthorized"
                        >
                            <DisplayUsers />
                        </AuthGuard>
                    }/>
                    <Route path="/employee-list" element={
                        <AuthGuard
                            requireAuth={true}
                            allowedRoles={['OWNER']}
                            unauthorizedFallback="/unauthorized"
                        >
                            <DisplayUsers />
                        </AuthGuard>
                    }/>
                    <Route path="/customer-list" element={
                        <AuthGuard
                            requireAuth={true}
                            allowedRoles={['OWNER']}
                            unauthorizedFallback="/unauthorized"
                        >
                            <DisplayUsers />
                        </AuthGuard>
                    }/>

                    <Route path="/user-feedback" element={
                        <AuthGuard
                            requireAuth={true}
                            allowedRoles={['CUSTOMER', 'EMPLOYEE', 'OWNER']}
                            unauthorizedFallback="/unauthorized"
                        >
                            <ComplaintFeedback />
                        </AuthGuard>
                    } />

                    <Route path="/user-notifications" element={
                        <AuthGuard
                            requireAuth={true}
                            allowedRoles={['CUSTOMER', 'EMPLOYEE', 'OWNER']}
                            unauthorizedFallback="/unauthorized"
                        >
                            <DisplayNotifications />
                        </AuthGuard>
                    } />

                    <Route path="/unauthorized" element={ <Unauthorized /> } />

                    <Route path="*" element={ <PageNotFound /> } />

                    <Route path="/privacy-policy" element={<Home />} />
                </Routes>
                <ContactUs/>
            </PrivacyPolicyProvider>
        </React.Fragment>
    );
}

export default App;