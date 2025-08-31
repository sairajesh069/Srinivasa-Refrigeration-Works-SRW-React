import React from "react";
import * as Yup from 'yup';
import {Box, CircularProgress, Typography} from "@mui/material";
import {toast} from "react-toastify";
import {useCustomerProfileQuery, useEmployeeProfileQuery, useOwnerProfileQuery} from "../reducers/userProfileApi.js";

const ProfileUtils = {
    getValidationSchema: (userType, isUpdate = false) => {
        const baseSchema = {
            firstName: Yup.string()
                .transform((value) => (value ? value.trim() : value))
                .min(3, 'First name must be at least 3 characters')
                .required('First name is required'),
            lastName: Yup.string()
                .transform((value) => (value ? value.trim() : value))
                .min(3, 'Last name must be at least 3 characters')
                .required('Last name is required'),
            gender: Yup.string()
                .oneOf(['Male', 'Female', 'Transgender', 'Other', 'prefer-not-to-say'], 'Please select a valid gender')
                .required('Gender is required'),
            phoneNumber: Yup.string()
                .matches(/^\d{10}$/, 'Phone number must be 10 digits')
                .required('Phone number is required'),
            email: Yup.string()
                .transform((value) => (value ? value.trim() : value))
                .email('Invalid email address')
                .required('Email is required'),
            address: Yup.string()
                .transform((value) => (value ? value.trim() : value))
                .min(10, 'Address must be at least 10 characters')
                .required('Address is required')
        };

        if (!isUpdate) {
            baseSchema.username = Yup.string()
                .transform((value) => (value ? value.trim() : value))
                .min(6, 'Username must be at least 6 characters long')
                .matches(
                    /^[a-zA-Z0-9\-@#!?*$.%&]+$/,
                    'Username may only contain letters, numbers, and the following characters: - @ # ! . * ? $ % &')
                .required('Username is required');

            baseSchema.password = Yup.string()
                .transform((value) => (value ? value.trim() : value))
                .min(8, 'Password must be at least 8 characters')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%.*?&])[A-Za-z\d@$!%*.?&]/,
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                )
                .required('Password is required');

            baseSchema.confirmPassword = Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Please confirm your password');
        }

        if (userType === 'OWNER' || userType === 'EMPLOYEE') {
            baseSchema.dateOfBirth = Yup.date()
                .test('is-past', 'Date must be in the past', function (value) {
                    if (!value) return false;
                    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
                    return value <= yesterday;
                })
                .test('min-age', 'Must be at least 18 years old', function (value) {
                    if (!value) return false;
                    const eighteenYearsAgo = new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000);
                    return value <= eighteenYearsAgo;
                })
                .test('max-age', 'Age cannot exceed 100 years', function (value) {
                    if (!value) return false;
                    const oneHundredYearsAgo = new Date(Date.now() - 100 * 365 * 24 * 60 * 60 * 1000);
                    return value >= oneHundredYearsAgo;
                })
                .required('Date of birth is required');

            baseSchema.nationalIdNumber = Yup.string()
                .transform((value) => (value ? value.trim() : value))
                .matches(/^([A-Z]{5}[0-9]{4}[A-Z]{1}|\d{12})$/, 'National ID must be valid Aadhar (12 digits) or PAN format')
                .required('National ID is required');
        }

        if (userType === 'EMPLOYEE') {
            baseSchema.designation = Yup.string()
                .transform((value) => (value ? value.trim() : value))
                .min(3, 'Designation must be at least 3 characters')
                .required('Designation is required');

            baseSchema.salary = Yup.string()
                .matches(/^[0-9]+$/, 'Salary must be a number')
                .required('Salary is required');
        }

        return Yup.object().shape(baseSchema);
    },

    getInitialValues: (userType, profileData = null, isUpdate = false) => {
        const baseValues = {
            firstName: profileData?.userDTO?.firstName || '',
            lastName: profileData?.userDTO?.lastName || '',
            gender: profileData?.userDTO?.gender || '',
            phoneNumber: profileData?.userDTO?.phoneNumber || '',
            email: profileData?.userDTO?.email || '',
            address: profileData?.userDTO?.address || ''
        };

        // Add registration-specific fields
        if (!isUpdate) {
            baseValues.username = '';
            baseValues.password = '';
            baseValues.confirmPassword = '';
        }

        // Add Owner/Employee fields
        if (userType === 'OWNER' || userType === 'EMPLOYEE') {
            baseValues.dateOfBirth = profileData?.userDTO?.dateOfBirth || '';
            baseValues.nationalIdNumber = profileData?.userDTO?.nationalIdNumber || '';
        }

        // Add Employee-specific fields
        if (userType === 'EMPLOYEE') {
            baseValues.designation = profileData?.userDTO?.designation || '';
            baseValues.salary = profileData?.userDTO?.salary || '';
        }

        return baseValues;
    },

    // Format utilities
    formatDate: dateString => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatDateTime: dateString => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatSalary: amount => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    },

    // Color utilities
    getUserTypeColor: userType => {
        switch (userType?.toUpperCase()) {
            case 'CUSTOMER':
                return {color: '#4fc3f7', bgColor: '#e3f2fd'};
            case 'OWNER':
                return {color: '#f44336', bgColor: '#ffebee'};
            case 'EMPLOYEE':
                return {color: '#ff9800', bgColor: '#fff3e0'};
            default:
                return {color: '#9e9e9e', bgColor: '#f5f5f5'};
        }
    },

    getStatusColor: status => {
        return status?.toLowerCase() === 'active'
            ? {color: '#4caf50', bgColor: '#e8f5e8'}
            : {color: '#f44336', bgColor: '#ffebee'};
    },

    // Unique field mappings for error handling
    uniqueFields: {
        "email address": "email",
        "phone number": "phoneNumber",
        "username": "username",
        "national id number": "nationalIdNumber"
    },

    profileLoader: loadingText => {
        return (
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
                    { loadingText }
                </Typography>
            </Box>
        );
    },

    handleDuplicateFieldError: (error, setFieldError) => {
        const errorMessage = error.data.message;
        if(!errorMessage.startsWith("Duplicate value")) {
            const duplicateField = errorMessage.slice(10).trim();
            if(ProfileUtils.uniqueFields[duplicateField]) {
                const fieldName = ProfileUtils.uniqueFields[duplicateField];
                setFieldError(fieldName, `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists`);
            }
        }
        toast.error(errorMessage);
    },

    getTimeUntilExpiry: (expiresIn, timestamp) => {
        if (!expiresIn || !timestamp) return 'N/A';
        const loginTime = new Date(timestamp).getTime();
        const expiryTime = loginTime + expiresIn;
        const currentTime = Date.now();
        const timeLeft = expiryTime - currentTime;

        if (timeLeft <= 0) return 'Expired';

        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    },

    getActiveUserProfileQuery: (userId, userType, shouldFetch) => {
        const customerQuery = useCustomerProfileQuery(userId, {
            refetchOnMountOrArgChange: true,
            skip: userType !== 'CUSTOMER' || !shouldFetch
        });

        const ownerQuery = useOwnerProfileQuery(userId, {
            refetchOnMountOrArgChange: true,
            skip: userType !== 'OWNER' || !shouldFetch
        });

        const employeeQuery = useEmployeeProfileQuery(userId, {
            refetchOnMountOrArgChange: true,
            skip: userType !== 'EMPLOYEE' || !shouldFetch
        });

        return userType === 'CUSTOMER' ? customerQuery
            : userType === 'OWNER' ? ownerQuery
                : employeeQuery;
    }
};

export default ProfileUtils;