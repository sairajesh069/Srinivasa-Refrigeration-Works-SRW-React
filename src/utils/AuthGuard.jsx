import { useEffect, useState } from 'react';
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

const AuthGuard = ({ children, requireAuth = true, fallback = '/login' }) => {
    const [authState, setAuthState] = useState({ isLoading: true, isAuthenticated: false });
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Small delay to prevent flash
                await new Promise(resolve => setTimeout(resolve, 50));

                const isAuthenticated = AuthUtils.isAuthenticated();
                setAuthState({ isLoading: false, isAuthenticated });
            } catch (error) {
                console.error('Auth check error:', error);
                setAuthState({ isLoading: false, isAuthenticated: false });
            }
        };

        checkAuth();
    }, []);

    if (authState.isLoading) {
        return <AuthLoader />;
    }

    if (requireAuth && !authState.isAuthenticated) {
        return <Navigate to={fallback} state={{ from: location }} replace />;
    }

    if (!requireAuth && authState.isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AuthGuard;