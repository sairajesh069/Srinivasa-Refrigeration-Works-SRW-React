import * as Yup from "yup";
import {Box, Button, IconButton, InputAdornment, Paper, Typography} from "@mui/material";
import {Form, Formik} from "formik";
import StyledTextField from "../../utils/form-styling/StyledTextField.jsx";
import {LockOutlined, PersonOutline, Phone, Visibility, VisibilityOff} from "@mui/icons-material";
import StyledLink from "../../utils/form-styling/StyledLink.jsx";
import {useState} from "react";
import {useUsernameRecoveryMutation, useUserValidationMutation, usePasswordResetMutation} from "../../reducers/accountRecoveryApi.js";
import {toast} from "react-toastify";
import {useNavigate, useLocation} from "react-router-dom";
import OTPField from "../../utils/form-styling/OTPField.jsx";
import ProfileUtils from "../../utils/ProfileUtils.jsx";

const AccountRecovery = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [validationResponse, setValidationResponse] = useState("");
    const [passwordResetResponse, setPasswordResetResponse] = useState("");
    const [isValidationError, setIsValidationError] = useState(null);
    const [isPasswordResetError, setIsPasswordResetError] = useState(null);
    const [isUserValidated, setIsUserValidated] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const isUsernameRecovery = location.pathname === "/forgot-username";
    const isUserValidation = location.pathname === "/validate-user";
    const isPasswordReset = location.pathname === "/forgot-password";

    const [usernameRecovery, { isLoading: isUsernameRecoveryLoading }] = useUsernameRecoveryMutation();
    const [userValidation, { isLoading: isUserValidationLoading }] = useUserValidationMutation();
    const [passwordReset, { isLoading: isPasswordResetLoading }] = usePasswordResetMutation();

    const [otpResponse, setOtpResponse] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const getPageConfig = () => {
        if (isUsernameRecovery) {
            return {
                title: "Find your username",
                submitText: isUsernameRecoveryLoading ? 'Retrieving username...' : 'Find Username',
                successMessage: "Username retrieved successfully."
            };
        }
        if (isUserValidation) {
            return {
                title: "Validate your details",
                submitText: isUserValidationLoading ? 'Validating user...' : 'Validate User',
                successMessage: "User validated successfully."
            };
        }
        return {
            title: "Reset your password",
            submitText: isPasswordResetLoading ? 'Resetting password...' : 'Reset Password',
            successMessage: "Password reset successfully."
        };
    };

    const getValidationSchema = () => {
        const baseSchema = {
            phoneNumber: Yup.string()
                .matches(/^\d{10}$/, 'Phone number must be 10 digits')
                .required('Phone number is required'),
            otp: Yup.string()
                .matches(/^\d{6}$/, 'OTP must be 6 digits')
                .required('OTP is required')
        };

        if (isUserValidation || isPasswordReset) {
            baseSchema.loginId = Yup.string()
                .min(6, "Username or Email must have minimum 6 characters")
                .required("Username or Email is required");
        }

        if (isPasswordReset) {
            baseSchema.password = Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
                .required('Password is required');
            baseSchema.confirmPassword = Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Please confirm your password');
        }

        return Yup.object().shape(baseSchema);
    };

    const getInitialValues = () => {
        const baseValues = {
            phoneNumber: '',
            otp: ''
        };

        if (isUserValidation || isPasswordReset) {
            baseValues.loginId = '';
        }

        if (isPasswordReset) {
            baseValues.password = '';
            baseValues.confirmPassword = '';
        }

        return baseValues;
    };

    const handleFieldChange = (event, handleChange, { setFieldValue }) => {
        handleChange(event);
        setOtpResponse("");
        if (isPasswordReset) {
            setFieldValue('password', '');
            setFieldValue('confirmPassword', '');
            setPasswordResetResponse("");
            setIsUserValidated(false);
            navigate('/validate-user');
        }
        setValidationResponse("");
    };

    const handleOtpResponse = (response, { setFieldError, setFieldTouched }) => {
        if(response && !validationResponse) {
            if (response.success) {
                setOtpResponse(response.data?.message);
                setIsValidationError(false);
            }
            else {
                const errorMessage = response.errorMessage;
                setOtpResponse(errorMessage);
                ProfileUtils.handleOtpFieldError(errorMessage, setFieldError, "accountRecovery");
                setFieldTouched('otp', true, false);
                setIsValidationError(true);
            }
        }
    };

    const handleAccountRecovery = async (values, { setFieldError }) => {
        const accountRecoveryDTO = {
            phoneNumber: values.phoneNumber,
            otp: values.otp,
            loginId: values.loginId?.toLowerCase(),
            password: values.password
        };

        const pageConfig = getPageConfig();

        try {
            let response;

            setOtpResponse("");
            if (isUsernameRecovery) {
                response = await usernameRecovery(accountRecoveryDTO).unwrap();
                setValidationResponse(response?.message);
                setIsValidationError(false);
            }
            else if (isUserValidation) {
                response = await userValidation(accountRecoveryDTO).unwrap();
                setIsUserValidated(true);
                setValidationResponse(response?.message);
                setIsValidationError(false);
                navigate('/forgot-password');
            }
            else if (isPasswordReset) {
                await passwordReset(accountRecoveryDTO).unwrap();
                setPasswordResetResponse("Your password has been updated successfully. Please proceed to log in.");
                setIsPasswordResetError(false);
            }

            toast.success(pageConfig?.successMessage);
        }
        catch (error) {
            setOtpResponse("");

            const errorStatus = error.data?.status;
            if ((errorStatus === 404 || errorStatus === 400) && (isUsernameRecovery || isUserValidation)) {
                const errorMessage = error.data?.message;
                errorMessage.includes("OTP")
                    ? setOtpResponse(`${errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)}`)
                    : setValidationResponse(errorMessage);
                setIsUserValidated(false);
                setIsValidationError(true);
                if(errorStatus === 400 && errorMessage.includes("OTP")) {
                    ProfileUtils.handleOtpFieldError(errorMessage, setFieldError, "accountRecovery");
                    return;
                }
            }

            if(isPasswordReset) {
                if(error.data?.status === 400) {
                    setPasswordResetResponse(error.data?.message);
                }
                else {
                    setPasswordResetResponse("Something went wrong. Please try again later.");
                }
                setIsPasswordResetError(true);
            }

            toast.error(error.data?.status === 404 ? error.data?.message : "Something went wrong...");
        }
    };

    const renderResponse = (response, isError, isUsernameResponse = false) => {
        if (!response) return null;

        const errorStyles = {
            mt: 2,
            mb: 2,
            color: '#d32f2f',
            fontWeight: 500,
            textAlign: "center",
            backgroundColor: 'rgba(211, 47, 47, 0.05)',
            border: '1px solid rgba(211, 47, 47, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px'
        };

        if (isError) {
            return (
                <Typography sx={errorStyles}>
                    {response}
                </Typography>
            );
        }

        if (isUsernameResponse) {
            const usernameMatch = response.match(/(.+)\s+([a-zA-Z0-9\-@#.$%&]+)\.$/);

            if (usernameMatch) {
                const [, messageText, username] = usernameMatch;
                return (
                    <Box sx={{
                        mt: 2,
                        mb: 2,
                        backgroundColor: 'rgba(76, 175, 80, 0.05)',
                        border: '1px solid rgba(76, 175, 80, 0.2)',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: "center"
                    }}>
                        <Typography sx={{
                            color: '#4caf50',
                            fontWeight: 500,
                            fontSize: '14px',
                            mb: 1
                        }}>
                            {messageText.trim()}
                        </Typography>
                        <Box sx={{
                            backgroundColor: 'rgba(79, 195, 247, 0.1)',
                            border: '2px solid rgba(79, 195, 247, 0.3)',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            display: 'inline-block',
                            mt: 1
                        }}>
                            <Typography sx={{
                                color: '#29b6f6',
                                fontWeight: 700,
                                fontSize: '16px',
                                letterSpacing: '0.5px',
                                textTransform: 'none'
                            }}>
                                {username}
                            </Typography>
                        </Box>
                    </Box>
                );
            }
        }

        return (
            <Box sx={{
                mt: 2,
                mb: 2,
                backgroundColor: 'rgba(76, 175, 80, 0.05)',
                border: '1px solid rgba(76, 175, 80, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: "center"
            }}>
                <Typography sx={{
                    color: '#4caf50',
                    fontWeight: 500,
                    fontSize: '14px',
                    mb: 1
                }}>
                    {response}
                </Typography>
            </Box>
        );
    };

    const pageConfig = getPageConfig();
    const isLoading = isUsernameRecoveryLoading || isUserValidationLoading || isPasswordResetLoading;

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
                        Account Recovery
                    </Typography>
                    <Typography sx={{
                        color: '#7f8c8d',
                        fontSize: '16px',
                        fontWeight: 400,
                    }}>
                        {pageConfig.title}
                    </Typography>
                </Box>

                {/* Form Section */}
                <Formik
                    initialValues={getInitialValues()}
                    validationSchema={getValidationSchema()}
                    onSubmit={handleAccountRecovery}
                    validateOnChange={true}
                    validateOnBlur={true}
                    validateOnMount={false}
                >
                    {({ values, handleChange, errors, touched, setFieldValue, setFieldError, setFieldTouched }) => (
                        <Form>
                            {(isPasswordReset || isUserValidation) && (
                                <StyledTextField
                                    fullWidth
                                    label="Username or Email"
                                    name="loginId"
                                    value={values.loginId}
                                    onChange={event => handleFieldChange(event, handleChange, { setFieldValue })}
                                    error={Boolean(touched.loginId && errors.loginId)}
                                    helperText={touched.loginId && errors.loginId}
                                    variant="outlined"
                                    placeholder="Enter your username or email"
                                    disabled={isLoading}
                                    InputProps ={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutline sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}

                            <StyledTextField
                                fullWidth
                                label="Phone Number"
                                name="phoneNumber"
                                value={values.phoneNumber}
                                onChange={event => handleFieldChange(event, handleChange, { setFieldValue } )}
                                error={Boolean((touched.phoneNumber || values.phoneNumber) && errors.phoneNumber)}
                                helperText={(touched.phoneNumber || values.phoneNumber) && errors.phoneNumber}
                                variant="outlined"
                                placeholder="Enter your phone number"
                                disabled={isLoading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <OTPField
                                label="OTP"
                                name="otp"
                                value={values.otp}
                                onChange={handleChange}
                                error={Boolean((touched.otp || values.otp) && errors.otp)}
                                helperText={(touched.otp || values.otp) && errors.otp}
                                phoneNumber={values.phoneNumber}
                                verificationType="phone"
                                customMarginBottom={validationResponse && '8px'}
                                onOtpResponse={response => handleOtpResponse(response, { setFieldError, setFieldTouched })}
                            />

                            {/* Response Messages */}
                            {(isUsernameRecovery || isUserValidation) && otpResponse &&
                                renderResponse(otpResponse, isValidationError)
                            }

                            {isUsernameRecovery && validationResponse &&
                                renderResponse(validationResponse, isValidationError, true)
                            }

                            {(isUserValidation || isUserValidated) && validationResponse &&
                                renderResponse(validationResponse, isValidationError)
                            }

                            {/* Password Fields */}
                            {(isPasswordReset && isUserValidated) && (
                                <>
                                    <StyledTextField
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={handleChange}
                                        value={values.password}
                                        error={Boolean((touched.password || values.password) && errors.password)}
                                        helperText={(touched.password || values.password) && errors.password}
                                        variant="outlined"
                                        placeholder="Enter your new password"
                                        autoComplete="off"
                                        disabled={isLoading}
                                        sx={{ marginTop: validationResponse && 1.5 }}
                                        inputProps={{
                                            autoComplete: 'off',
                                            'data-lpignore': 'true',
                                            'data-form-type': 'other'
                                        }}
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
                                                        sx={{ color: '#7f8c8d' }}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <StyledTextField
                                        fullWidth
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={handleChange}
                                        value={values.confirmPassword}
                                        error={Boolean((touched.confirmPassword || values.confirmPassword) && errors.confirmPassword)}
                                        helperText={(touched.confirmPassword || values.confirmPassword) && errors.confirmPassword}
                                        variant="outlined"
                                        placeholder="Confirm your password"
                                        disabled={isLoading}
                                        sx={{ marginBottom: passwordResetResponse ? "8px" : "24px" }}
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
                                                        sx={{ color: '#7f8c8d' }}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    {passwordResetResponse &&
                                        renderResponse(passwordResetResponse, isPasswordResetError)
                                    }
                                </>
                            )}

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={isLoading}
                                sx={{
                                    marginTop: '8px',
                                    padding: '16px 24px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    textTransform: 'none',
                                    boxShadow: '0 8px 24px rgba(79, 195, 247, 0.4)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #29b6f6 0%, #1976d2 100%)',
                                        boxShadow: '0 12px 32px rgba(79, 195, 247, 0.5)',
                                        transform: 'translateY(-2px)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0px)',
                                    },
                                }}
                            >
                                {pageConfig.submitText}
                            </Button>

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
                                    '&:hover': {
                                        backgroundColor: 'rgba(79, 195, 247, 0.1)',
                                        borderColor: 'rgba(79, 195, 247, 0.3)',
                                        color: '#29b6f6',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 12px rgba(79, 195, 247, 0.15)'
                                    }
                                }}
                                to='/login'
                            >
                                Back to Sign In
                            </StyledLink>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
};

export default AccountRecovery;