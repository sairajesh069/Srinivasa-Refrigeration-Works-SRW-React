import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from 'react-toastify';
import AuthUtils from "./AuthUtils.jsx";
import {useLogoutMutation} from '../reducers/authApi.js';

const useAuth = () => {
    const [authState, setAuthState] = useState(AuthUtils.getAuthState());
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const [logoutMutation] = useLogoutMutation();

    useEffect(() => {
        return AuthUtils.subscribe((newState) => {
            setAuthState(newState);
        });
    }, []);

    const logout = useCallback(async (showToast = true, redirectTo = '/login') => {
        if (isLoggingOut) return;

        try {
            setIsLoggingOut(true);

            await logoutMutation().unwrap();

            if (showToast) {
                toast.success('Logged out successfully');
            }
        } catch (error) {
            if (showToast) {
                toast.info('Logged out locally');
            }
        } finally {
            AuthUtils.clearAuthData();
            setIsLoggingOut(false);
            navigate(redirectTo);
        }
    }, [isLoggingOut, logoutMutation, navigate]);

    return {
        ...authState,
        isLoggingOut,
        logout
    };
};

export default useAuth;