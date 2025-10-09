import * as Yup from "yup";
import {Alert, Box, CircularProgress, Typography} from "@mui/material";
import React from "react";

const ComplaintUtils =  {

    PRODUCT_TYPES: ["Air Conditioner", "Refrigerator", "Other"],

    AIR_CONDITIONER_BRANDS: ["Samsung", "LG", "Panasonic", "Daikin", "Haier", "Lloyd", "Hitachi", "BlueStar",
        "Carrier", "O'General", "Voltas", "Others"],
    AIR_CONDITIONER_MODELS: ["Inverter Technology Split AC", "Non-Inverter Split AC", "Window Air Conditioner"],

    REFRIGERATOR_BRANDS: ["Samsung", "LG", "Whirlpool", "Haier", "Godrej", "Bosch", "Hitachi", "Kelvinator",
        "Voltas", "Panasonic", "Others"],
    REFRIGERATOR_MODELS: ["Single-door Non-Inverter", "Single-door Inverter", "Double-door Non-Inverter", "Double-door Inverter"],

    getValidationSchema: (includeExtraFields = false, extraFields = {}) => {
        let baseSchema = {
            customerName: Yup.string()
                .min(4, 'Customer name must be at least 4 characters')
                .required('Customer name is required'),
            contactNumber: Yup.string()
                .matches(/^\d{10}$/, 'Contact number must be 10 digits')
                .required('Contact number is required'),
            email: Yup.string()
                .transform(value => (value ? value.trim() : value))
                .email('Invalid email address'),
            address: Yup.object().shape({
                doorNumber: Yup.string()
                    .min(2, 'Door number must be at least 2 characters')
                    .required('Door number is required'),
                street: Yup.string()
                    .min(3, 'Street must be at least 3 characters')
                    .required('Street is required'),
                landmark: Yup.string(),
                city: Yup.string()
                    .min(3, 'City must be at least 3 characters')
                    .required('City is required'),
                district: Yup.string()
                    .min(3, 'District must be at least 3 characters')
                    .required('District is required'),
                state: Yup.string()
                    .min(3, 'State must be at least 3 characters')
                    .required('State is required'),
                pincode: Yup.string()
                    .matches(/^\d{6}$/, 'Pincode must be 6 digits')
                    .required('Pincode is required'),
                country: Yup.string()
                    .min(3, 'Country must be at least 3 characters')
                    .required('Country is required'),
            }),
            productType: Yup.string()
                .oneOf(ComplaintUtils.PRODUCT_TYPES, 'Please select a valid product type')
                .required('Product type is required'),
            brand: Yup.string()
                .required('Brand is required'),
            productModel: Yup.string()
                .required('Product model is required'),
            description: Yup.string()
                .min(10, 'Description must be at least 10 characters')
                .required('Description is required')
        };

        if(includeExtraFields) {
            baseSchema = {
                ...baseSchema,
                ...extraFields
            };
        }

        return Yup.object().shape(baseSchema);
    },

    complaintLoader: loadingText => {
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
                    {loadingText}
                </Typography>
            </Box>
        );
    },

    complaintError: errorText => {
        return (
            <Box sx={{
                p: 4,
                textAlign: 'center',
                backgroundColor: '#f8f9fa',
                minHeight: '50vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Alert severity="error" sx={{ maxWidth: '500px' }}>
                    {errorText}
                </Alert>
            </Box>
        );
    },

    getBrandOptions: productType => {
        switch (productType) {
            case 'Air Conditioner':
                return ComplaintUtils.AIR_CONDITIONER_BRANDS;
            case 'Refrigerator':
                return ComplaintUtils.REFRIGERATOR_BRANDS;
            default:
                return ['Others'];
        }
    },

    getModelOptions: productType => {
        switch (productType) {
            case 'Air Conditioner':
                return ComplaintUtils.AIR_CONDITIONER_MODELS;
            case 'Refrigerator':
                return ComplaintUtils.REFRIGERATOR_MODELS;
            default:
                return ['Others'];
        }
    }
}

export default ComplaintUtils;