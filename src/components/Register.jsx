import {Box, Button, Typography, Paper, InputAdornment, IconButton, MenuItem} from "@mui/material";
import * as Yup from "yup";
import {Form, Formik} from "formik";
import { PersonOutline, LockOutlined, Visibility, VisibilityOff, Phone, Email, LocationOn, Wc, CalendarToday } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import StyledLink from "./form-styling/StyledLink.jsx";
import StyledTextField from "./form-styling/StyledTextField.jsx";
import { useCustomerMutation, useOwnerMutation } from "../reducers/registerApi.js";
import StyledMenuProps from "./form-styling/StyledSelectMenu.jsx";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Check if this is owner registration
    const isOwnerRegistration = location.pathname === '/owner-register';

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [customer, { isLoading: isCustomerLoading }] = useCustomerMutation();
    const [owner, { isLoading: isOwnerLoading }] = useOwnerMutation();

    // Dynamic validation schema based on registration type
    const getValidationSchema = () => {
        const baseSchema = {
            firstName: Yup.string()
                .min(2, 'First name must be at least 2 characters')
                .required('First name is required'),
            lastName: Yup.string()
                .min(2, 'Last name must be at least 2 characters')
                .required('Last name is required'),
            gender: Yup.string()
                .oneOf(['male', 'female', 'other', 'prefer-not-to-say'], 'Please select a valid gender')
                .required('Gender is required'),
            phoneNumber: Yup.string()
                .matches(/^\d{10}$/, 'Phone number must be 10 digits')
                .required('Phone number is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            address: Yup.string()
                .min(10, 'Address must be at least 10 characters')
                .required('Address is required'),
            username: Yup.string()
                .min(3, 'Username must be at least 3 characters')
                .required('Username is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Please confirm your password')
        };

        // Add dateOfBirth validation only for owner registration
        if (isOwnerRegistration) {
            baseSchema.dateOfBirth = Yup.date()
                .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), 'Must be at least 18 years old')
                .required('Date of birth is required');
        }

        return Yup.object().shape(baseSchema);
    };

    const uniqueFields = {
        "email address": "email",
        "phone number": "phoneNumber",
        "username": "username"
    }

    const handleRegister = async (values, { setFieldError }) => {
        const userCredentialDTO = {
            username: values.username.toLowerCase(),
            password: values.password,
            phoneNumber: values.phoneNumber,
            email: values.email.toLowerCase()
        }

        try {
            if(location.pathname === '/customer-register') {
                const customerCredentialDTO = {
                    customerDTO: {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        gender: values.gender,
                        phoneNumber: values.phoneNumber,
                        email: values.email.toLowerCase(),
                        address: values.address
                    },
                    userCredentialDTO: userCredentialDTO
                };
                await customer(customerCredentialDTO).unwrap();
            }

            if(location.pathname === '/owner-register') {
                const ownerCredentialDTO = {
                    ownerDTO: {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        dateOfBirth: values.dateOfBirth,
                        gender: values.gender,
                        phoneNumber: values.phoneNumber,
                        email: values.email.toLowerCase(),
                        address: values.address
                    },
                    userCredentialDTO: userCredentialDTO
                };
                await owner(ownerCredentialDTO).unwrap();
            }

            toast.success("Registration successful. Please login");
            navigate('/login');
        } catch (error) {
            if(error.status === 409) {
                const errorMessage = error.data.message;
                if(!errorMessage.startsWith("Duplicate value")) {
                    const duplicateField = errorMessage.slice(10).trim();
                    if(uniqueFields[duplicateField]) {
                        const fieldName = uniqueFields[duplicateField];
                        setFieldError(fieldName, `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists`);
                    }
                }
                toast.error(errorMessage);
            }
            else{
                toast.error("Registration failed. Please try again.");
            }
        }
    }

    // Dynamic initial values based on registration type
    const getInitialValues = () => {
        const baseValues = {
            firstName: '',
            lastName: '',
            gender: '',
            phoneNumber: '',
            email: '',
            address: '',
            username: '',
            password: '',
            confirmPassword: ''
        };

        // Add dateOfBirth only for owner registration
        if (isOwnerRegistration) {
            baseValues.dateOfBirth = '';
        }

        return baseValues;
    };

    return(
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
                        Create Your Account
                    </Typography>
                    <Typography sx={{
                        color: '#7f8c8d',
                        fontSize: '16px',
                        fontWeight: 400,
                    }}>
                        Get started with your new {isOwnerRegistration ? 'owner' : 'customer'} account
                    </Typography>
                </Box>
                <Formik
                    initialValues={getInitialValues()}
                    validationSchema={getValidationSchema()}
                    onSubmit={handleRegister}
                    validateOnChange={true}
                    validateOnBlur={true}
                    validateOnMount={true}
                >
                    {({ values, handleChange, errors, touched, setFieldError }) => (
                        <Form>
                            <Typography sx={{
                                color: '#2c3e50',
                                fontWeight: 600,
                                fontSize: '16px',
                                marginBottom: '20px',
                                marginTop: '24px',
                                borderLeft: '3px solid #4fc3f7',
                                paddingLeft: '12px'
                            }}>
                                Personal Information
                            </Typography>
                            <StyledTextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={values.firstName}
                                onChange={handleChange}
                                error={Boolean((touched.firstName || values.firstName) && errors.firstName)}
                                helperText={(touched.firstName || values.firstName) && errors.firstName}
                                variant="outlined"
                                placeholder="Enter your first name"
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
                                label="Last Name"
                                name="lastName"
                                value={values.lastName}
                                onChange={handleChange}
                                error={Boolean((touched.lastName || values.lastName) && errors.lastName)}
                                helperText={(touched.lastName || values.lastName) && errors.lastName}
                                variant="outlined"
                                placeholder="Enter your last name"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutline sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* Date of Birth field - only for owner registration */}
                            {isOwnerRegistration && (
                                <StyledTextField
                                    fullWidth
                                    label="Date of Birth"
                                    name="dateOfBirth"
                                    type="date"
                                    value={values.dateOfBirth}
                                    onChange={handleChange}
                                    error={Boolean((touched.dateOfBirth || values.dateOfBirth) && errors.dateOfBirth)}
                                    helperText={(touched.dateOfBirth || values.dateOfBirth) && errors.dateOfBirth}
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarToday sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}

                            <StyledTextField
                                fullWidth
                                select
                                label="Gender"
                                name="gender"
                                value={values.gender}
                                onChange={handleChange}
                                error={Boolean((touched.gender || values.gender) && errors.gender)}
                                helperText={(touched.gender || values.gender) && errors.gender}
                                variant="outlined"
                                SelectProps={{
                                    displayEmpty: true,
                                    MenuProps: StyledMenuProps
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Wc sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                <MenuItem value="">--select--</MenuItem>
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                                <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                            </StyledTextField>
                            <StyledTextField
                                fullWidth
                                label="Phone Number"
                                name="phoneNumber"
                                value={values.phoneNumber}
                                onChange={handleChange}
                                error={Boolean((touched.phoneNumber || values.phoneNumber) && errors.phoneNumber)}
                                helperText={(touched.phoneNumber || values.phoneNumber) && errors.phoneNumber}
                                variant="outlined"
                                placeholder="Enter your phone number"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <StyledTextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                error={Boolean((touched.email || values.email) && errors.email)}
                                helperText={(touched.email || values.email) && errors.email}
                                variant="outlined"
                                placeholder="Enter your email"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <StyledTextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={values.address}
                                onChange={handleChange}
                                error={Boolean((touched.address || values.address) && errors.address)}
                                helperText={(touched.address || values.address) && errors.address}
                                variant="outlined"
                                multiline
                                rows={3}
                                placeholder="Enter your full address (street, city, state, zip code)"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', marginTop: '12px' }}>
                                            <LocationOn sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Typography sx={{
                                color: '#2c3e50',
                                fontWeight: 600,
                                fontSize: '16px',
                                marginBottom: '20px',
                                marginTop: '32px',
                                borderLeft: '3px solid #4fc3f7',
                                paddingLeft: '12px'
                            }}>
                                Account Credentials
                            </Typography>

                            <StyledTextField
                                fullWidth
                                label="Username"
                                name="username"
                                value={values.username}
                                onChange={handleChange}
                                error={Boolean((touched.username || values.username) && errors.username)}
                                helperText={(touched.username || values.username) && errors.username}
                                variant="outlined"
                                placeholder="Enter your username"
                                autoComplete="off"
                                inputProps={{
                                    autoComplete: 'off',
                                    'data-lpignore': 'true',
                                    'data-form-type': 'other'
                                }}
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
                                error={Boolean((touched.password || values.password) && errors.password)}
                                helperText={(touched.password || values.password) && errors.password}
                                variant="outlined"
                                placeholder="Enter your new password"
                                autoComplete="off"
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
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={isCustomerLoading || isOwnerLoading}
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
                                }}>
                                {isCustomerLoading || isOwnerLoading ? 'Creating Account...' : 'Create Account'}
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
                                Already have an account? Sign In
                            </StyledLink>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
}

export default Register;