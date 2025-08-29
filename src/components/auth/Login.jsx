import {Box, Button, Typography, Paper, InputAdornment, IconButton} from "@mui/material";
import * as Yup from "yup";
import {Form, Formik} from "formik";
import { PersonOutline, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StyledLink from "../../utils/form-styling/StyledLink.jsx";
import StyledTextField from "../../utils/form-styling/StyledTextField.jsx";
import { useLoginMutation } from '../../reducers/authApi.js';
import AuthUtils from "../../utils/AuthUtils.jsx";

const validationSchema = Yup.object().shape({
    loginId: Yup.string()
        .min(6, "Username or Email must have minimum 6 characters")
        .required("Username or Email is required"),
    password: Yup.string()
        .min(8, "Password must have minimum 8 characters")
        .required("Password is required")
});

const ERROR_MESSAGES = {
    401: {
        "Invalid login id": "Username or Email doesn't exist",
        "Invalid password": "Incorrect password",
        "Inactive user": "Account deactivated. Please contact admin",
        default: "Authentication failed"
    },
    500: {
        "Server error": "Server error. Please try again later."
    },
    default: "Login failed. Please try again."
};

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [login] = useLoginMutation();
    const navigate = useNavigate();
    const location = useLocation();

    const getRedirectPath = useCallback(() => {
        return location.state?.from?.pathname || '/';
    }, [location.state]);

    const handleAuthRedirect = useCallback((path) => {
        navigate(path, { replace: true });
    }, [navigate]);

    useEffect(() => {
        const checkAuthStatus = () => {
            if (AuthUtils.isAuthenticated()) {
                handleAuthRedirect(getRedirectPath());
                return;
            }
            setIsAuthenticating(false);
        };

        checkAuthStatus();
    }, [handleAuthRedirect, getRedirectPath]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginError = useCallback((error, setFieldError) => {
        const status = error?.status;
        const errorMessage = error.data?.message;

        if (status === 401 && errorMessage) {
            const fieldErrors = ERROR_MESSAGES[401];
            if (fieldErrors[errorMessage]) {
                const field = errorMessage === "Invalid password" ? "password" : "loginId";
                setFieldError(field, fieldErrors[errorMessage]);
            }
        }

        toast.error(status ? ERROR_MESSAGES[status][errorMessage] : ERROR_MESSAGES.default);
    }, []);

    const handleLogin = useCallback(async (values, { setFieldError, setSubmitting }) => {
        if (isLoggingIn) return;

        try {
            setIsLoggingIn(true);

            await login(values).unwrap();

            const userData = AuthUtils.getUserData();
            if (userData?.username) {
                toast.success(`Welcome back, ${userData.username}!`);
            }

            handleAuthRedirect(getRedirectPath());

        } catch (error) {
            handleLoginError(error, setFieldError);
        } finally {
            setIsLoggingIn(false);
            setSubmitting(false);
        }
    }, [isLoggingIn, login, handleAuthRedirect, getRedirectPath, handleLoginError]);

    if (isAuthenticating) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
            }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    const isFormDisabled = isLoggingIn;

    return (
        <Box sx={{
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            padding: '20px',
            paddingTop: '100px',
            position: 'relative'
        }}>
            <Paper elevation={0} sx={{
                padding: '48px 40px',
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                width: '100%',
                maxWidth: '420px',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Header Section */}
                <Box sx={{
                    textAlign: 'center',
                    marginBottom: '40px',
                }}>
                    <Box sx={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 10px 30px rgba(79, 195, 247, 0.3)',
                    }}>
                        <Typography sx={{
                            color: 'white',
                            fontWeight: 800,
                            fontSize: '24px',
                            letterSpacing: '1px',
                        }}>
                            SRW
                        </Typography>
                    </Box>
                    <Typography sx={{
                        color: '#2c3e50',
                        fontWeight: 700,
                        fontSize: '28px',
                        marginBottom: '8px',
                    }}>
                        Welcome Back
                    </Typography>
                    <Typography sx={{
                        color: '#7f8c8d',
                        fontSize: '16px',
                        fontWeight: 400,
                    }}>
                        Sign in to your account
                    </Typography>
                </Box>

                {/* Form Section */}
                <Formik
                    initialValues={{loginId: "", password: ""}}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                    validateOnChange={true}
                    validateOnBlur={true}
                    validateOnMount={false}
                >
                    {({ values, handleChange, errors, touched, isSubmitting }) => (
                        <Form>
                            <StyledTextField
                                fullWidth
                                label="Username or Email"
                                name="loginId"
                                value={values.loginId}
                                onChange={handleChange}
                                error={Boolean(touched.loginId && errors.loginId)}
                                helperText={touched.loginId && errors.loginId}
                                variant="outlined"
                                placeholder="Enter your username or email"
                                disabled={isFormDisabled}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutline sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <StyledTextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                onChange={handleChange}
                                value={values.password}
                                error={Boolean(touched.password && errors.password)}
                                helperText={touched.password && errors.password}
                                variant="outlined"
                                placeholder="Enter your password"
                                disabled={isFormDisabled}
                                autoComplete="current-password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                                disabled={isFormDisabled}
                                                sx={{ color: '#7f8c8d' }}
                                                type="button"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* Recovery Links */}
                            <StyledLink
                                style={{
                                    float: 'left',
                                    marginBottom: '20px',
                                    fontSize: '13px',
                                    color: '#7f8c8d',
                                    pointerEvents: isFormDisabled ? 'none' : 'auto',
                                    opacity: isFormDisabled ? 0.6 : 1,
                                    '&:hover': {
                                        color: '#4fc3f7',
                                        backgroundColor: 'rgba(79, 195, 247, 0.05)',
                                    },
                                }}
                                to='/forgot-username'
                            >
                                Username Recovery
                            </StyledLink>

                            <StyledLink
                                style={{
                                    float: 'right',
                                    marginBottom: '20px',
                                    fontSize: '13px',
                                    color: '#7f8c8d',
                                    pointerEvents: isFormDisabled ? 'none' : 'auto',
                                    opacity: isFormDisabled ? 0.6 : 1,
                                    '&:hover': {
                                        color: '#4fc3f7',
                                        backgroundColor: 'rgba(79, 195, 247, 0.05)',
                                    },
                                }}
                                to='/validate-user'
                            >
                                Reset Password
                            </StyledLink>

                            {/* Login Button */}
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={isFormDisabled || isSubmitting}
                                sx={{
                                    marginTop: '8px',
                                    padding: '16px 24px',
                                    borderRadius: '12px',
                                    background: isFormDisabled
                                        ? 'linear-gradient(135deg, #b0bec5 0%, #90a4ae 100%)'
                                        : 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    textTransform: 'none',
                                    boxShadow: isFormDisabled
                                        ? '0 4px 12px rgba(144, 164, 174, 0.3)'
                                        : '0 8px 24px rgba(79, 195, 247, 0.4)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: isFormDisabled
                                            ? 'linear-gradient(135deg, #b0bec5 0%, #90a4ae 100%)'
                                            : 'linear-gradient(135deg, #29b6f6 0%, #1976d2 100%)',
                                        boxShadow: isFormDisabled
                                            ? '0 4px 12px rgba(144, 164, 174, 0.3)'
                                            : '0 12px 32px rgba(79, 195, 247, 0.5)',
                                        transform: isFormDisabled ? 'none' : 'translateY(-2px)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0px)',
                                    },
                                    '&:disabled': {
                                        background: 'linear-gradient(135deg, #b0bec5 0%, #90a4ae 100%)',
                                        color: 'rgba(255, 255, 255, 0.7)',
                                    }
                                }}>
                                {isLoggingIn ? 'Signing In...' : 'Sign In'}
                            </Button>

                            {/* Register Link */}
                            <StyledLink
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    marginTop: '24px',
                                    padding: '12px 16px',
                                    backgroundColor: 'rgba(79, 195, 247, 0.05)',
                                    border: '1px solid rgba(79, 195, 247, 0.2)',
                                    borderRadius: '12px',
                                    color: '#4fc3f7',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    pointerEvents: isFormDisabled ? 'none' : 'auto',
                                    opacity: isFormDisabled ? 0.6 : 1,
                                    '&:hover': {
                                        backgroundColor: 'rgba(79, 195, 247, 0.1)',
                                        borderColor: 'rgba(79, 195, 247, 0.3)',
                                        color: '#29b6f6',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 12px rgba(79, 195, 247, 0.15)'
                                    }
                                }}
                                to='/customer-register'
                            >
                                New User? Register
                            </StyledLink>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
}

export default Login;