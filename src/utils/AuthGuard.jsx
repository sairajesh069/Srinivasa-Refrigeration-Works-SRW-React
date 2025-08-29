import { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthUtils from './AuthUtils.jsx';
import { Box, CircularProgress, Typography } from '@mui/material';

const AuthLoader = () => (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2
    }}>
        <CircularProgress size={60} sx={{ color: '#4fc3f7' }} />
        <Typography variant="h6" sx={{ color: '#7f8c8d' }}>
            Verifying authentication...
        </Typography>
    </Box>
);

const AuthGuard = ({
                       children,
                       requireAuth = true,
                       allowedRoles = [],
                       fallback = '/login',
                       unauthorizedFallback = '/unauthorized'
                   }) => {
    const [authState, setAuthState] = useState({
        isLoading: true,
        isAuthenticated: false,
        userRole: null
    });
    const location = useLocation();
    const hasChecked = useRef(false);

    useEffect(() => {

        if (hasChecked.current) return;

        const checkAuth = () => {
            try {
                hasChecked.current = true;

                const isAuthenticated = AuthUtils.isAuthenticated();
                const userRole = isAuthenticated ? AuthUtils.getUserData()?.userType : null;

                setAuthState({
                    isLoading: false,
                    isAuthenticated,
                    userRole
                });
            } catch (error) {
                console.error('Auth check failed:', error);
                setAuthState({
                    isLoading: false,
                    isAuthenticated: false,
                    userRole: null
                });
            }
        };

        checkAuth();

        return () => {
            hasChecked.current = false;
        };
    }, [location.pathname]);

    if (authState.isLoading) {
        return <AuthLoader />;
    }

    if (requireAuth && !authState.isAuthenticated) {
        return <Navigate to={fallback} state={{ from: location }} replace />;
    }

    if (requireAuth && authState.isAuthenticated && allowedRoles.length > 0) {
        const hasRequiredRole = allowedRoles.includes(authState.userRole);

        if (!hasRequiredRole) {
            return <Navigate to={unauthorizedFallback} state={{ from: location }} replace />;
        }
    }

    return children;
};

export default AuthGuard;