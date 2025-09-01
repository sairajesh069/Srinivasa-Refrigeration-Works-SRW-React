import React, {useMemo, useState} from 'react';
import * as Yup from "yup";
import { Box, Typography, Paper, Grid, Card, CardContent, Avatar, Button, Alert, useTheme, useMediaQuery,
    MenuItem, Collapse, IconButton, Tooltip, Chip, CircularProgress, InputAdornment } from '@mui/material';
import {
    Dashboard, Edit, Person, Phone, Email, Home, Description, Engineering, Feedback, Save, Cancel,
    ExpandMore, ExpandLess, Lock, Assignment, CheckCircle, Info, Category, Business, Badge,
    LocationOn, Public, AccountCircle, Work, RateReview, AssignmentTurnedIn
} from '@mui/icons-material';
import {useLocation, useNavigate} from 'react-router-dom';
import StyledTextField from "../../utils/form-styling/StyledTextField.jsx";
import StyledMenuProps from "../../utils/form-styling/StyledSelectMenu.jsx";
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import useAuth from "../../utils/useAuth.jsx";
import {useSearchParams} from "react-router";
import ComplaintUtils from "../../utils/ComplaintUtils.jsx";
import {useFetchComplaintQuery, useFetchTechniciansQuery, useUpdateComplaintMutation} from "../../reducers/complaintApi.js";

const UpdateComplaint = () => {
    const { user, isLoggingOut } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [searchParams] = useSearchParams();
    const complaintId = searchParams.get('complaintId');

    const shouldFetch = location.pathname === '/update-complaint' && !isLoggingOut && complaintId;

    const { data: complaintData, isLoading: isFetchComplaintLoading,
        isError: isFetchComplaintError } = useFetchComplaintQuery(complaintId, {
        refetchOnMountOrArgChange: true,
        skip: !shouldFetch
    });

    const complaint = complaintData?.complaintDTO;

    const isOwner = user?.userType === 'OWNER';
    const isEmployee = user?.userType === 'EMPLOYEE';
    const isCustomer = user?.userType === 'CUSTOMER';
    const isComplaintOwner = complaint?.bookedById === user?.userId;
    const isAssignedTechnician = complaint?.technicianDetails?.employeeId === user?.userId;
    const isResolved = complaint?.status === 'RESOLVED';

    const { data: techniciansData, isLoading: isFetchTechniciansLoading,
        isError: isFetchTechniciansError } = useFetchTechniciansQuery("update-complaint", {
        refetchOnMountOrArgChange: true,
        skip: !(shouldFetch && isOwner)
    });
    const technicianDetails = techniciansData?.usersDTO || [];

    const techniciansList = isOwner
        ?   technicianDetails.reduce((list, technician) => {
            list[technician?.employeeId] = `${technician?.employeeId} - ${technician?.fullName} (${technician?.designation})`;
            return list;
        }, {})
        :   {[`${complaint?.technicianDetails?.employeeId}`]: `${complaint?.technicianDetails?.employeeId} - ${complaint?.technicianDetails?.fullName} (${complaint?.technicianDetails?.designation})`}

    const technicianIds = technicianDetails.map(technician => technician.employeeId);

    const validationSchema = useMemo(() => {
        const baseExtraFields = {
            technicianFeedback: Yup.string()
                .min(10, 'Feedback must be at least 10 characters'),
            customerFeedback: Yup.string()
                .min(10, 'Feedback must be at least 10 characters')
        };

        if(isOwner && technicianIds?.length > 0) {
            baseExtraFields.assignTo = Yup.string()
                .oneOf(technicianIds, 'Please assign an active technician');
        }

        if(isOwner || isEmployee) {
            baseExtraFields.status = Yup.string()
                .oneOf(["PENDING", "IN_PROGRESS", "RESOLVED"], 'Please select a valid complaint status');
        }

        return ComplaintUtils.getValidationSchema(true, baseExtraFields);
    }, [isOwner, isEmployee, technicianIds]);

    const [expandedSections, setExpandedSections] = useState({
        address: true,
        technician: true,
        feedback: true
    });
    const toggleSection = section => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const [updateComplaint, isLoading] = useUpdateComplaintMutation();

    const handleSubmit = async values => {

        const complaintDTO = {
            complaintId: complaintId,
            bookedById: complaint?.bookedById,
            customerName: values.customerName || '',
            contactNumber: values.contactNumber || '',
            email: values.email === 'N/A' ? '' : values.email,
            address: {
                doorNumber: values.address?.doorNumber || '',
                street: values.address?.street || '',
                landmark: values.address?.landmark === 'N/A' ? '' : values.address.landmark,
                city: values.address?.city || '',
                district: values.address?.district || '',
                state: values.address?.state || '',
                pincode: values.address?.pincode || '',
                country: values.address?.country || ''
            },
            productType: values.productType || '',
            brand: values.brand || '',
            productModel: values.productModel || '',
            description: values.description || '',
            status: values.status || '',
            technicianDetails: {
                employeeId: values.technicianDetails?.employeeId === 'N/A' ? '' : values.technicianDetails.employeeId,
                fullName: values.technicianDetails?.fullName === 'N/A' ? '' : values.technicianDetails.fullName,
                phoneNumber: values.technicianDetails?.phoneNumber === 'N/A' ? '' : values.technicianDetails.phoneNumber,
                designation: values.technicianDetails?.designation === 'N/A' ? '' : values.technicianDetails.designation
            },
            createdAt: complaint?.createdAt,
            updatedAt: complaint?.updatedAt,
            reopenedAt: complaint?.reopenedAt,
            complaintState: complaint?.complaintState,
            technicianFeedback: values.technicianFeedback || '',
            customerFeedback: values.customerFeedback || ''
        };

        setIsSubmitting(true);
        try {
            await updateComplaint(complaintDTO).unwrap();
            toast.success('Complaint updated successfully!');
            navigate(-1);
        } catch (err) {
            toast.error('Failed to update complaint');
        } finally {
            setIsSubmitting(false);
        }
    };

    const canEditField = (fieldType, formValues = {}) => {
        switch (fieldType) {
            case 'status':
                return (isOwner || isEmployee)
                    && (formValues?.technicianDetails?.employeeId && formValues?.technicianDetails?.employeeId !== 'N/A');
            case 'technicianDetails':
                return isOwner;
            case 'technicianFeedback':
                return isOwner || isAssignedTechnician;
            case 'customerFeedback':
                return isComplaintOwner && isResolved;
            case 'basic':
                return isOwner || isComplaintOwner;
            default:
                return false;
        }
    };

    if (isFetchComplaintLoading || isFetchTechniciansLoading) {
        return ComplaintUtils.complaintLoader("Fetching complaint details....");
    }

    if (isFetchComplaintError || isFetchTechniciansError) {
        return ComplaintUtils.complaintError("Failed to load complaint data. Please try again.");
    }

    const initialValues = {
        complaintId: complaintId || '',
        bookedById: complaint?.bookedById || '',
        customerName: complaint?.customerName || '',
        contactNumber: complaint?.contactNumber?.slice(3) || '',
        email: !(complaint?.email === 'N/A' && (isComplaintOwner || isOwner)) ? complaint?.email : '',
        address: {
            doorNumber: complaint?.address?.doorNumber || '',
            street: complaint?.address?.street || '',
            landmark: !(complaint?.address?.landmark === 'N/A' && (isComplaintOwner || isOwner)) ? complaint?.address?.landmark : '',
            city: complaint?.address?.city || '',
            district: complaint?.address?.district || '',
            state: complaint?.address?.state || '',
            pincode: complaint?.address?.pincode || '',
            country: complaint?.address?.country || ''
        },
        productType: complaint?.productType || '',
        brand: complaint?.brand || '',
        productModel: complaint?.productModel || '',
        description: complaint?.description || '',
        status: complaint?.status || '',
        technicianDetails: {
            employeeId: complaint?.technicianDetails?.employeeId || '',
            fullName: complaint?.technicianDetails?.fullName || '',
            phoneNumber: complaint?.technicianDetails?.phoneNumber?.slice(3) || '',
            designation: complaint?.technicianDetails?.designation || ''
        },
        assignTo: complaint?.technicianDetails?.employeeId || '',
        technicianFeedback: complaint?.technicianFeedback || '',
        customerFeedback: complaint?.customerFeedback || ''
    };

    const handleAssignToChange = (values, event, handleChange, setValues) => {
        handleChange(event);

        const assignedTechnicianId = event.target.value;
        if(assignedTechnicianId === '') {
            values.status = "PENDING";
        }

        const assignedTechnician = technicianDetails.find(
            technician => technician.employeeId === assignedTechnicianId
        );

        if (assignedTechnician) {
            setValues({
                ...values,
                assignTo: assignedTechnician.employeeId,
                technicianDetails: {
                    employeeId: assignedTechnician.employeeId,
                    fullName: assignedTechnician.fullName,
                    phoneNumber: assignedTechnician.phoneNumber?.slice(3),
                    designation: assignedTechnician.designation,
                }
            });
        } else {
            setValues({
                ...values,
                assignTo: '',
                technicianDetails: {
                    employeeId: 'N/A',
                    fullName: 'N/A',
                    phoneNumber: 'N/A',
                    designation: 'N/A',
                }
            });
        }
    };

    const getDisplayValue = (value, isDisabled) => {
        if (isDisabled && (!value || value === '')) {
            return 'N/A';
        }
        return value || '';
    };

    return (
        <Box sx={{
            backgroundColor: '#f8f9fa',
            padding: {
                xs: '80px 10px 20px',
                sm: '90px 16px 20px',
                md: '100px 20px 20px'
            }
        }}>
            <Box sx={{
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%'
            }}>
                {/* Header Section */}
                <Paper sx={{
                    borderRadius: { xs: '16px', md: '20px' },
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    marginBottom: { xs: '20px', md: '30px' },
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                    <Box sx={{
                        p: { xs: 2, sm: 3, md: 4 },
                        color: 'white',
                        position: 'relative'
                    }}>
                        <Box sx={{
                            position: 'absolute',
                            top: { xs: 12, sm: 16, md: 20 },
                            right: { xs: 12, sm: 16, md: 20 },
                            display: 'flex',
                            gap: { xs: 1, sm: 1.5, md: 2 },
                            flexDirection: { xs: 'column', sm: 'row' }
                        }}>
                            <Tooltip title="Dashboard">
                                <IconButton
                                    size={isMobile ? 'small' : 'medium'}
                                    sx={{
                                        color: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                                        width: { xs: '36px', sm: '40px', md: '48px' },
                                        height: { xs: '36px', sm: '40px', md: '48px' }
                                    }}
                                    onClick={() => navigate('/dashboard')}
                                >
                                    <Dashboard sx={{ fontSize: { xs: '18px', sm: '20px', md: '24px' } }} />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 2, md: 3 },
                            flexDirection: { xs: 'column', sm: 'row' },
                            textAlign: { xs: 'center', sm: 'left' }
                        }}>
                            <Avatar sx={{
                                width: { xs: 70, sm: 85, md: 100 },
                                height: { xs: 70, sm: 85, md: 100 },
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                fontSize: { xs: '1.8rem', md: '2.5rem' },
                                fontWeight: 700,
                                border: '4px solid rgba(255, 255, 255, 0.3)'
                            }}>
                                <Edit sx={{ fontSize: { xs: '2rem', md: '3rem' } }} />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant={isMobile ? "h4" : "h3"} sx={{
                                    fontWeight: 800,
                                    marginBottom: '8px',
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' }
                                }}>
                                    Update Complaint
                                </Typography>
                                <Typography variant="body1" sx={{
                                    opacity: 0.9,
                                    fontSize: { xs: '0.95rem', md: '1.1rem' }
                                }}>
                                    Modify complaint details and track progress
                                </Typography>
                                <Chip
                                    label={initialValues.complaintId}
                                    size={isMobile ? "small" : "medium"}
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                        fontWeight: 600,
                                        marginTop: '8px'
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    {({ values, handleChange, errors, touched, setFieldValue, setValues }) => (
                        <Form>
                            {/* Basic Information */}
                            <Paper sx={{
                                borderRadius: { xs: '16px', md: '20px' },
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                p: { xs: 2, sm: 3, md: 4 },
                                marginBottom: { xs: '20px', md: '30px' }
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    marginBottom: { xs: '16px', md: '24px' }
                                }}>
                                    <Assignment sx={{ color: '#4fc3f7' }} />
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        color: '#495057',
                                        fontSize: { xs: '1.1rem', md: '1.25rem' }
                                    }}>
                                        Complaint Information
                                    </Typography>
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <StyledTextField
                                            fullWidth
                                            label="Complaint ID"
                                            name="complaintId"
                                            value={values.complaintId}
                                            disabled
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Badge sx={{ fontSize: '20px', color: '#4fc3f7' }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <StyledTextField
                                            fullWidth
                                            label="Booked By ID"
                                            name="bookedById"
                                            value={values.bookedById}
                                            disabled
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AccountCircle sx={{ fontSize: '20px', color: '#163e80' }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <StyledTextField
                                            fullWidth
                                            label="Customer Name"
                                            name="customerName"
                                            value={getDisplayValue(values.customerName, !canEditField('basic'))}
                                            onChange={handleChange}
                                            disabled={!canEditField('basic')}
                                            error={Boolean(touched.customerName && errors.customerName)}
                                            helperText={touched.customerName && errors.customerName}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person sx={{ fontSize: '20px', color: '#7ef443' }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: !canEditField('basic') ? (
                                                    <InputAdornment position="end">
                                                        <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                    </InputAdornment>
                                                ) : null
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <StyledTextField
                                            fullWidth
                                            label="Contact Number"
                                            name="contactNumber"
                                            value={getDisplayValue(values.contactNumber, !canEditField('basic'))}
                                            onChange={handleChange}
                                            disabled={!canEditField('basic')}
                                            error={Boolean(touched.contactNumber && errors.contactNumber)}
                                            helperText={touched.contactNumber && errors.contactNumber}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Phone sx={{ fontSize: '20px', color: '#4fc3f7' }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: !canEditField('basic') ? (
                                                    <InputAdornment position="end">
                                                        <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                    </InputAdornment>
                                                ) : null
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <StyledTextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            value={getDisplayValue(values.email, !canEditField('basic'))}
                                            onChange={handleChange}
                                            disabled={!canEditField('basic')}
                                            error={Boolean(touched.email && errors.email)}
                                            helperText={touched.email && errors.email}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Email sx={{ fontSize: '20px', color: '#4fc3f7' }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: !canEditField('basic') ? (
                                                    <InputAdornment position="end">
                                                        <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                    </InputAdornment>
                                                ) : null
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <StyledTextField
                                            fullWidth
                                            select
                                            label="Product Type"
                                            name="productType"
                                            value={values.productType}
                                            disabled={!canEditField('basic')}
                                            onChange={event => {
                                                handleChange(event);
                                                setFieldValue('brand', '');
                                                setFieldValue('productModel', '');
                                            }}
                                            error={Boolean(touched.productType && errors.productType)}
                                            helperText={touched.productType && errors.productType}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: {
                                                        xs: '8px',
                                                        md: '12px'
                                                    },
                                                    transition: 'all 0.2s ease',
                                                    fontSize: {
                                                        xs: '14px',
                                                        md: '16px'
                                                    },
                                                    '&:hover': {
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                    },
                                                    '&.Mui-focused': {
                                                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
                                                    }
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: {
                                                        xs: '14px',
                                                        md: '16px'
                                                    }
                                                },
                                                '& .MuiSelect-icon': {
                                                    display: !canEditField('basic') ? 'none' : 'block'
                                                }
                                            }}
                                            SelectProps={{
                                                displayEmpty: true,
                                                MenuProps: StyledMenuProps
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Category sx={{
                                                            color: '#ff6b35',
                                                            fontSize: {
                                                                xs: '18px',
                                                                md: '20px'
                                                            }
                                                        }}
                                                        />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: !canEditField('basic') ? (
                                                    <InputAdornment position="end">
                                                        <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                    </InputAdornment>
                                                ) : null
                                            }}
                                        >
                                            <MenuItem value="">--Select Product Type--</MenuItem>
                                            {ComplaintUtils.PRODUCT_TYPES.map(type => (
                                                <MenuItem key={type} value={type}>{type}</MenuItem>
                                            ))}
                                        </StyledTextField>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <StyledTextField
                                            fullWidth
                                            select
                                            label="Brand"
                                            name="brand"
                                            value={values.brand}
                                            onChange={event => {
                                                handleChange(event);
                                                setFieldValue('productModel', '');
                                            }}
                                            error={Boolean(touched.brand && errors.brand)}
                                            helperText={touched.brand && errors.brand}
                                            disabled={!(canEditField('basic') && values.productType)}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: {
                                                        xs: '8px',
                                                        md: '12px'
                                                    },
                                                    transition: 'all 0.2s ease',
                                                    fontSize: {
                                                        xs: '14px',
                                                        md: '16px'
                                                    },
                                                    '&:hover': {
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                    },
                                                    '&.Mui-focused': {
                                                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
                                                    }
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: {
                                                        xs: '14px',
                                                        md: '16px'
                                                    }
                                                },
                                                '& .MuiSelect-icon': {
                                                    display: !canEditField('basic') ? 'none' : 'block'
                                                }
                                            }}
                                            SelectProps={{
                                                displayEmpty: true,
                                                MenuProps: StyledMenuProps
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Business sx={{
                                                            color: '#6610f2',
                                                            fontSize: {
                                                                xs: '18px',
                                                                md: '20px'
                                                            }
                                                        }}
                                                        />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: !canEditField('basic') ? (
                                                    <InputAdornment position="end">
                                                        <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                    </InputAdornment>
                                                ) : null
                                            }}
                                        >
                                            <MenuItem value="">--Select Brand--</MenuItem>
                                            {ComplaintUtils.getBrandOptions(values.productType).map(brand => (
                                                <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                                            ))}
                                        </StyledTextField>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <StyledTextField
                                            fullWidth
                                            select
                                            label="Product Model"
                                            name="productModel"
                                            value={values.productModel}
                                            onChange={handleChange}
                                            error={Boolean(touched.productModel && errors.productModel)}
                                            helperText={touched.productModel && errors.productModel}
                                            variant="outlined"
                                            disabled={!((values.productType || values.brand) && canEditField('basic'))}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: {
                                                        xs: '8px',
                                                        md: '12px'
                                                    },
                                                    transition: 'all 0.2s ease',
                                                    fontSize: {
                                                        xs: '14px',
                                                        md: '16px'
                                                    },
                                                    '&:hover': {
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                    },
                                                    '&.Mui-focused': {
                                                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
                                                    }
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: {
                                                        xs: '14px',
                                                        md: '16px'
                                                    }
                                                },
                                                '& .MuiSelect-icon': {
                                                    display: !canEditField('basic') ? 'none' : 'block'
                                                }
                                            }}
                                            SelectProps={{
                                                displayEmpty: true,
                                                MenuProps: StyledMenuProps
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Category sx={{
                                                            color: '#ffc107',
                                                            fontSize: {
                                                                xs: '18px',
                                                                md: '20px'
                                                            }
                                                        }}
                                                        />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: !canEditField('basic') ? (
                                                    <InputAdornment position="end">
                                                        <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                    </InputAdornment>
                                                ) : null
                                            }}
                                        >
                                            <MenuItem value="">--Select Model--</MenuItem>
                                            {ComplaintUtils.getModelOptions(values.productType).map((model) => (
                                                <MenuItem key={model} value={model}>{model}</MenuItem>
                                            ))}
                                        </StyledTextField>
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <StyledTextField
                                            fullWidth
                                            label="Description"
                                            name="description"
                                            value={values.description}
                                            onChange={handleChange}
                                            error={Boolean((touched.description || values.description) && errors.description)}
                                            helperText={(touched.description || values.description) && errors.description}
                                            variant="outlined"
                                            multiline
                                            rows={3}
                                            placeholder="Describe the issue in detail (minimum 10 characters)"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Description sx={{ fontSize: '20px', color: '#20c997' }} />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Address Section */}
                            <Card sx={{
                                borderRadius: '16px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                marginBottom: '20px'
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Home sx={{ color: '#fd7e14' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#495057' }}>
                                                Service Address
                                            </Typography>
                                        </Box>
                                        <IconButton onClick={() => toggleSection('address')}>
                                            {expandedSections.address ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    </Box>

                                    <Collapse in={expandedSections.address}>
                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Door Number"
                                                    name="address.doorNumber"
                                                    value={getDisplayValue(values.address.doorNumber, !canEditField('basic'))}
                                                    onChange={handleChange}
                                                    disabled={!canEditField('basic')}
                                                    error={Boolean(touched.address?.doorNumber && errors.address?.doorNumber)}
                                                    helperText={touched.address?.doorNumber && errors.address?.doorNumber}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Home sx={{ fontSize: '20px', color: '#1976d2' }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: !canEditField('basic') ? (
                                                            <InputAdornment position="end">
                                                                <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                            </InputAdornment>
                                                        ) : null
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Street"
                                                    name="address.street"
                                                    value={getDisplayValue(values.address.street, !canEditField('basic'))}
                                                    onChange={handleChange}
                                                    disabled={!canEditField('basic')}
                                                    error={Boolean(touched.address?.street && errors.address?.street)}
                                                    helperText={touched.address?.street && errors.address?.street}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LocationOn sx={{ fontSize: '20px', color: '#d32f2f' }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: !canEditField('basic') ? (
                                                            <InputAdornment position="end">
                                                                <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                            </InputAdornment>
                                                        ) : null
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Landmark"
                                                    name="address.landmark"
                                                    value={getDisplayValue(values.address.landmark, !canEditField('basic'))}
                                                    onChange={handleChange}
                                                    disabled={!canEditField('basic')}
                                                    error={Boolean(touched.address?.landmark && errors.address?.landmark)}
                                                    helperText={touched.address?.landmark && errors.address?.landmark}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LocationOn sx={{ fontSize: '20px', color: '#388e3c' }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: !canEditField('basic') ? (
                                                            <InputAdornment position="end">
                                                                <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                            </InputAdornment>
                                                        ) : null
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="City"
                                                    name="address.city"
                                                    value={getDisplayValue(values.address.city, !canEditField('basic'))}
                                                    onChange={handleChange}
                                                    disabled={!canEditField('basic')}
                                                    error={Boolean(touched.address?.city && errors.address?.city)}
                                                    helperText={touched.address?.city && errors.address?.city}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LocationOn sx={{ fontSize: '20px', color: '#f57c00' }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: !canEditField('basic') ? (
                                                            <InputAdornment position="end">
                                                                <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                            </InputAdornment>
                                                        ) : null
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="District"
                                                    name="address.district"
                                                    value={getDisplayValue(values.address.district, !canEditField('basic'))}
                                                    onChange={handleChange}
                                                    disabled={!canEditField('basic')}
                                                    error={Boolean(touched.address?.district && errors.address?.district)}
                                                    helperText={touched.address?.district && errors.address?.district}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LocationOn sx={{ fontSize: '20px', color: '#fbc02d' }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: !canEditField('basic') ? (
                                                            <InputAdornment position="end">
                                                                <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                            </InputAdornment>
                                                        ) : null
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="State"
                                                    name="address.state"
                                                    value={getDisplayValue(values.address.state, !canEditField('basic'))}
                                                    onChange={handleChange}
                                                    disabled={!canEditField('basic')}
                                                    error={Boolean(touched.address?.state && errors.address?.state)}
                                                    helperText={touched.address?.state && errors.address?.state}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Public sx={{ fontSize: '20px', color: '#0288d1' }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: !canEditField('basic') ? (
                                                            <InputAdornment position="end">
                                                                <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                            </InputAdornment>
                                                        ) : null
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Pincode"
                                                    name="address.pincode"
                                                    value={getDisplayValue(values.address.pincode, !canEditField('basic'))}
                                                    onChange={handleChange}
                                                    disabled={!canEditField('basic')}
                                                    error={Boolean(touched.address?.pincode && errors.address?.pincode)}
                                                    helperText={touched.address?.pincode && errors.address?.pincode}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LocationOn sx={{ fontSize: '20px', color: '#1976d2' }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: !canEditField('basic') ? (
                                                            <InputAdornment position="end">
                                                                <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                            </InputAdornment>
                                                        ) : null
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Country"
                                                    name="address.country"
                                                    value={getDisplayValue(values.address.country, !canEditField('basic'))}
                                                    onChange={handleChange}
                                                    disabled={!canEditField('basic')}
                                                    error={Boolean(touched.address?.country && errors.address?.country)}
                                                    helperText={touched.address?.country && errors.address?.country}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Public sx={{ fontSize: '20px', color: '#388e3c' }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: !canEditField('basic') ? (
                                                            <InputAdornment position="end">
                                                                <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                            </InputAdornment>
                                                        ) : null
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Collapse>
                                </CardContent>
                            </Card>

                            {/* Technician Details Section */}
                            <Card sx={{
                                borderRadius: '16px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                marginBottom: '20px'
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Engineering sx={{ color: '#28a745' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#495057' }}>
                                                Technician Assignment
                                            </Typography>
                                            {!canEditField('technicianDetails') && (
                                                <Chip
                                                    size="small"
                                                    label="Owner Only"
                                                    icon={<Lock sx={{ fontSize: '12px' }} />}
                                                    sx={{ backgroundColor: '#fff3cd', color: '#856404' }}
                                                />
                                            )}
                                        </Box>
                                        <IconButton onClick={() => toggleSection('technician')}>
                                            {expandedSections.technician ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    </Box>

                                    <Collapse in={expandedSections.technician}>
                                        <Grid container spacing={3}>
                                            {(isOwner || isEmployee) && (
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <StyledTextField
                                                        fullWidth
                                                        select
                                                        label="Assign To"
                                                        name="assignTo"
                                                        value={values.assignTo}
                                                        onChange={event => {
                                                            handleAssignToChange(values, event, handleChange, setValues);
                                                        }}
                                                        disabled={!canEditField('technicianDetails')}
                                                        error={Boolean(touched.assignTo && errors.assignTo)}
                                                        helperText={touched.assignTo && errors.assignTo}
                                                        variant="outlined"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: {
                                                                    xs: '8px',
                                                                    md: '12px'
                                                                },
                                                                transition: 'all 0.2s ease',
                                                                fontSize: {
                                                                    xs: '14px',
                                                                    md: '16px'
                                                                },
                                                                '&:hover': {
                                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                },
                                                                '&.Mui-focused': {
                                                                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
                                                                }
                                                            },
                                                            '& .MuiInputLabel-root': {
                                                                fontSize: {
                                                                    xs: '14px',
                                                                    md: '16px'
                                                                }
                                                            },
                                                            '& .MuiSelect-icon': {
                                                                display: !canEditField('technicianDetails') ? 'none' : 'block'
                                                            }
                                                        }}
                                                        SelectProps={{
                                                            displayEmpty: true,
                                                            MenuProps: StyledMenuProps
                                                        }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Engineering sx={{ fontSize: '20px', color: '#616161' }} />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: !canEditField('technicianDetails') ? (
                                                                <InputAdornment position="end">
                                                                    <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                                </InputAdornment>
                                                            ) : null
                                                        }}
                                                    >
                                                        <MenuItem value="">--Select Assignee--</MenuItem>
                                                        {Object.entries(techniciansList).map(([employeeId, label]) => (
                                                            <MenuItem key={employeeId} value={employeeId}>
                                                                {label}
                                                            </MenuItem>
                                                        ))}
                                                    </StyledTextField>
                                                </Grid>
                                            )}
                                            {(isOwner || isEmployee) && (
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <StyledTextField
                                                        fullWidth
                                                        select
                                                        label="Status"
                                                        name="status"
                                                        value={values.status}
                                                        onChange={handleChange}
                                                        disabled={!canEditField('status', values)}
                                                        error={Boolean(touched.status && errors.status)}
                                                        helperText={touched.status && errors.status}
                                                        variant="outlined"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: {
                                                                    xs: '8px',
                                                                    md: '12px'
                                                                },
                                                                transition: 'all 0.2s ease',
                                                                fontSize: {
                                                                    xs: '14px',
                                                                    md: '16px'
                                                                },
                                                                '&:hover': {
                                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                },
                                                                '&.Mui-focused': {
                                                                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
                                                                }
                                                            },
                                                            '& .MuiInputLabel-root': {
                                                                fontSize: {
                                                                    xs: '14px',
                                                                    md: '16px'
                                                                }
                                                            },
                                                            '& .MuiSelect-icon': {
                                                                display: !canEditField('status', values) ? 'none' : 'block'
                                                            }
                                                        }}
                                                        SelectProps={{
                                                            displayEmpty: true,
                                                            MenuProps: StyledMenuProps
                                                        }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <AssignmentTurnedIn sx={{ fontSize: '20px', color: '#0288d1' }} />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: !canEditField('status', values) ? (
                                                                <InputAdornment position="end">
                                                                    <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                                </InputAdornment>
                                                            ) : null
                                                        }}
                                                    >
                                                        <MenuItem value="PENDING">PENDING</MenuItem>
                                                        <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                                                        <MenuItem value="RESOLVED">RESOLVED</MenuItem>
                                                    </StyledTextField>
                                                </Grid>
                                            )}
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Employee ID"
                                                    name="technicianDetails.employeeId"
                                                    value={getDisplayValue(values.technicianDetails.employeeId, true)}
                                                    onChange={handleChange}
                                                    disabled
                                                    error={Boolean(touched.technicianDetails?.employeeId && errors.technicianDetails?.employeeId)}
                                                    helperText={touched.technicianDetails?.employeeId && errors.technicianDetails?.employeeId}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Badge sx={{ fontSize: '20px', color: '#7b1fa2' }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Full Name"
                                                    name="technicianDetails.fullName"
                                                    value={getDisplayValue(values.technicianDetails.fullName, true)}
                                                    onChange={handleChange}
                                                    disabled
                                                    error={Boolean(touched.technicianDetails?.fullName && errors.technicianDetails?.fullName)}
                                                    helperText={touched.technicianDetails?.fullName && errors.technicianDetails?.fullName}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Person sx={{ fontSize: '20px', color: '#7ef443' }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Phone Number"
                                                    name="technicianDetails.phoneNumber"
                                                    value={getDisplayValue(values.technicianDetails.phoneNumber, true)}
                                                    onChange={handleChange}
                                                    disabled
                                                    error={Boolean(touched.technicianDetails?.phoneNumber && errors.technicianDetails?.phoneNumber)}
                                                    helperText={touched.technicianDetails?.phoneNumber && errors.technicianDetails?.phoneNumber}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Phone sx={{ fontSize: '20px', color: '#4fc3f7' }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Designation"
                                                    name="technicianDetails.designation"
                                                    value={getDisplayValue(values.technicianDetails.designation, true)}
                                                    onChange={handleChange}
                                                    disabled
                                                    error={Boolean(touched.technicianDetails?.designation && errors.technicianDetails?.designation)}
                                                    helperText={touched.technicianDetails?.designation && errors.technicianDetails?.designation}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Work sx={{ fontSize: '20px', color: '#2e7d32' }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Collapse>
                                </CardContent>
                            </Card>

                            {/* Feedback Section */}
                            <Card sx={{
                                borderRadius: '16px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                marginBottom: '20px'
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Feedback sx={{ color: '#ffc107' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#495057' }}>
                                                Feedback Section
                                            </Typography>
                                        </Box>
                                        <IconButton onClick={() => toggleSection('feedback')}>
                                            {expandedSections.feedback ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    </Box>

                                    <Collapse in={expandedSections.feedback}>
                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12 }}>
                                                <Box sx={{ mb: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                            Technician Feedback
                                                        </Typography>
                                                        {!canEditField('technicianFeedback') && (
                                                            <Chip
                                                                size="small"
                                                                label={isOwner ? "Editable" : isAssignedTechnician ? "Editable" : "Read Only"}
                                                                icon={canEditField('technicianFeedback') ? <CheckCircle sx={{ fontSize: '12px' }} /> : <Lock sx={{ fontSize: '12px' }} />}
                                                                sx={{
                                                                    backgroundColor: canEditField('technicianFeedback') ? '#d4edda' : '#fff3cd',
                                                                    color: canEditField('technicianFeedback') ? '#155724' : '#856404'
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                    <StyledTextField
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        name="technicianFeedback"
                                                        value={values.technicianFeedback}
                                                        onChange={handleChange}
                                                        disabled={!canEditField('technicianFeedback')}
                                                        error={Boolean(touched.technicianFeedback && errors.technicianFeedback)}
                                                        helperText={touched.technicianFeedback && errors.technicianFeedback}
                                                        placeholder="Technical findings, repair actions taken, recommendations..."
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Engineering sx={{ fontSize: '20px', color: '#ed8f39' }} />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: !canEditField('technicianFeedback') ? (
                                                                <InputAdornment position="end">
                                                                    <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                                </InputAdornment>
                                                            ) : null
                                                        }}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                            Customer Feedback
                                                        </Typography>
                                                        <Chip
                                                            size="small"
                                                            label={canEditField('customerFeedback') ? "Available" : isResolved ? "Complaint Owner Only" : "Available After Resolution"}
                                                            icon={canEditField('customerFeedback') ? <CheckCircle sx={{ fontSize: '12px' }} /> : <Lock sx={{ fontSize: '12px' }} />}
                                                            sx={{
                                                                backgroundColor: canEditField('customerFeedback') ? '#d4edda' : '#fff3cd',
                                                                color: canEditField('customerFeedback') ? '#155724' : '#856404'
                                                            }}
                                                        />
                                                    </Box>
                                                    <StyledTextField
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        name="customerFeedback"
                                                        value={values.customerFeedback}
                                                        onChange={handleChange}
                                                        disabled={!canEditField('customerFeedback')}
                                                        error={Boolean(touched.customerFeedback && errors.customerFeedback)}
                                                        helperText={touched.customerFeedback && errors.customerFeedback}
                                                        placeholder="Rate the service quality, satisfaction level, suggestions..."
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <RateReview sx={{ fontSize: '20px', color: '#915422' }} />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: !canEditField('customerFeedback') ? (
                                                                <InputAdornment position="end">
                                                                    <Lock sx={{ fontSize: '16px', color: '#ff9800' }} />
                                                                </InputAdornment>
                                                            ) : null
                                                        }}
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Collapse>
                                </CardContent>
                            </Card>

                            {/* Permission Notice */}
                            <Alert
                                severity="info"
                                sx={{
                                    marginBottom: '20px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(33, 150, 243, 0.2)',
                                    backgroundColor: 'rgba(33, 150, 243, 0.04)'
                                }}
                            >
                                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1565c0' }}>
                                    <strong>Edit Permissions:</strong>
                                    {isOwner && " As an owner, you can edit all fields including technician assignment."}
                                    {isEmployee && !isOwner && " As an employee, you can only edit technician feedback if assigned to this complaint."}
                                    {isCustomer && !isOwner && " You can edit basic complaint details and provide customer feedback once resolved."}
                                    {" Fields marked with lock icon are read-only based on your role and complaint status."}
                                </Typography>
                            </Alert>

                            {/* Action Buttons */}
                            <Paper sx={{
                                borderRadius: '16px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                p: 3,
                                marginBottom: '20px',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    justifyContent: 'center',
                                    flexDirection: { xs: 'column', sm: 'row' }
                                }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                        type="submit"
                                        disabled={isSubmitting || isLoading}
                                        sx={{
                                            backgroundColor: '#4fc3f7',
                                            color: 'white',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            borderRadius: '12px',
                                            padding: '12px 24px',
                                            minWidth: '160px',
                                            '&:hover': {
                                                backgroundColor: '#29b6f6',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 25px rgba(79, 195, 247, 0.4)'
                                            }
                                        }}
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        startIcon={<Cancel />}
                                        onClick={() => {
                                            navigate(-1);
                                        }}
                                        sx={{
                                            borderColor: '#dee2e6',
                                            color: '#6c757d',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            borderRadius: '12px',
                                            padding: '12px 24px',
                                            minWidth: '160px',
                                            '&:hover': {
                                                borderColor: '#adb5bd',
                                                backgroundColor: '#f8f9fa',
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Paper>
                        </Form>
                    )}
                </Formik>

                {/* Status Information */}
                <Card sx={{
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                    background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
                    border: '1px solid #c8e6c9'
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: '#2e7d32',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Info sx={{ fontSize: '20px' }} />
                            Field Access Guide
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2', mb: 1 }}>
                                        Owner Access
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555', fontSize: '0.85rem' }}>
                                        <>
                                            • Full edit access to all fields <br />
                                            • Can assign/reassign technicians <br />
                                            • Can update technician feedback <br />
                                        </>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2e7d32', mb: 1 }}>
                                        Employee Access
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555', fontSize: '0.85rem' }}>
                                        <>
                                            • Read-only for most fields <br />
                                            • Can edit technician feedback if assigned <br />
                                            • Cannot modify assignments <br />
                                        </>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#f57c00', mb: 1 }}>
                                        Customer Access
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555', fontSize: '0.85rem' }}>
                                        <>
                                            • Can edit own complaint details <br />
                                            • Customer feedback only after resolution <br />
                                            • Cannot modify technician details <br />
                                        </>
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default UpdateComplaint;