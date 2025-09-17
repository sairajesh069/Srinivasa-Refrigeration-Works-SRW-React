import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip, Avatar, Button, Alert, Divider, useTheme,
    useMediaQuery, IconButton, Tooltip, Collapse } from '@mui/material';
import { Dashboard, CalendarToday, Person, Home, Build, Description,
    CheckCircle, Feedback, ContactPhone, Engineering, ExpandMore, ExpandLess,
    RateReview, Send, Edit } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import StyledTextField from "../../utils/form-styling/StyledTextField.jsx";
import useAuth from "../../utils/useAuth.jsx";
import { useFetchResolvedComplaintsQuery, useSaveComplaintFeedbackMutation } from "../../reducers/complaintApi.js";
import { toast } from "react-toastify";
import * as Yup from "yup";
import ComplaintUtils from "../../utils/ComplaintUtils.jsx";
import Unauthorized from "../exceptions/Unauthorized.jsx";

const ComplaintFeedback = () => {
    const { user, isLoggingOut } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const userId = user?.userId;

    const [expandedCards, setExpandedCards] = useState({});
    const [editingFeedback, setEditingFeedback] = useState({});

    const { data: resolvedComplaintsData, isLoading: isFetchResolvedComplaintsLoading, isError: isFetchingResolvedComplaintsError,
        error: fetchingResolvedComplaintsError, refetch: refetchResolvedComplaints } = useFetchResolvedComplaintsQuery(userId, {
            refetchOnMountOrArgChange: true,
            skip: !(location.pathname === '/user-feedback' && userId && !isLoggingOut)
        }
    );

    const resolvedComplaints = resolvedComplaintsData?.complaintsDTO;

    const [saveComplaintFeedback, { isLoading: isSavingFeedback }] = useSaveComplaintFeedbackMutation();

    const toggleCardExpansion = complaintId => {
        setExpandedCards(prev => ({
            ...prev,
            [complaintId]: !prev[complaintId]
        }));
    };

    const toggleEditFeedback = complaintId => {
        setEditingFeedback(prev => ({
            ...prev,
            [complaintId]: !prev[complaintId]
        }));
    };

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        const complaintFeedbackDTO = {
            complaintId: values.complaintId,
            customerFeedback: values.customerFeedback
        };

        try {
            await saveComplaintFeedback(complaintFeedbackDTO).unwrap();
            toast.success("Complaint feedback saved successfully");

            setEditingFeedback(prev => ({
                ...prev,
                [values.complaintId]: false
            }));

            await refetchResolvedComplaints();

            resetForm();
        } catch (error) {
            toast.error("Failed to save complaint feedback");
        } finally {
            setSubmitting(false);
        }
    };

    const validationSchema = Yup.object().shape({
        customerFeedback: Yup.string()
            .min(10, "Feedback must have more than 10 characters")
            .required("Feedback is required")
    });

    const formatDate = dateString => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isFetchResolvedComplaintsLoading) {
        ComplaintUtils.complaintLoader("Loading resolved complaints...");
    }

    if(isFetchingResolvedComplaintsError && fetchingResolvedComplaintsError.status === 403) {
        return <Unauthorized />;
    }

    if (isFetchingResolvedComplaintsError) {
        ComplaintUtils.complaintError("Failed to load resolved complaints. Please try again.");
    }

    return (
        <Box sx={{
            backgroundColor: '#f8f9fa',
            padding: {
                xs: '80px 10px 20px',
                sm: '90px 16px 20px',
                md: '100px 20px 20px'
            },
        }}>
            <Box sx={{
                maxWidth: '1400px',
                margin: '0 auto',
                width: '100%'
            }}>
                {/* Header Section */}
                <Paper sx={{
                    borderRadius: {
                        xs: '16px',
                        md: '20px'
                    },
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    marginBottom: {
                        xs: '20px',
                        md: '30px'
                    },
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                    <Box sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                            md: 4
                        },
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
                            gap: {
                                xs: 2,
                                md: 3
                            },
                            flexDirection: {
                                xs: 'column',
                                sm: 'row'
                            },
                            textAlign: {
                                xs: 'center',
                                sm: 'left'
                            }
                        }}>
                            <Avatar sx={{
                                width: {
                                    xs: 70,
                                    sm: 85,
                                    md: 100
                                },
                                height: {
                                    xs: 70,
                                    sm: 85,
                                    md: 100
                                },
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                fontSize: {
                                    xs: '1.8rem',
                                    md: '2.5rem'
                                },
                                fontWeight: 700,
                                border: '4px solid rgba(255, 255, 255, 0.3)'
                            }}>
                                <RateReview sx={{ fontSize: { xs: '2rem', md: '3rem' } }} />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant={isMobile ? "h4" : "h3"} sx={{
                                    fontWeight: 800,
                                    marginBottom: '8px',
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                                    fontSize: {
                                        xs: '1.8rem',
                                        sm: '2.2rem',
                                        md: '3rem'
                                    }
                                }}>
                                    Complaint Feedback
                                </Typography>
                                <Typography variant="body1" sx={{
                                    opacity: 0.9,
                                    fontSize: {
                                        xs: '0.95rem',
                                        md: '1.1rem'
                                    }
                                }}>
                                    Share your experience with our resolved services
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Complaints Grid */}
                {!resolvedComplaints || resolvedComplaints.length === 0 ? (
                    <Paper sx={{
                        borderRadius: '20px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        p: 6,
                        textAlign: 'center'
                    }}>
                        <RateReview sx={{ fontSize: '4rem', color: '#9e9e9e', mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#495057', mb: 1 }}>
                            No Resolved Complaints Found
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
                            You don't have any resolved complaints to provide feedback for at the moment.
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {resolvedComplaints.map((complaint) => (
                            <Grid size={{ xs: 12, lg: 6 }} key={complaint.complaintId}>
                                <Card sx={{
                                    borderRadius: '16px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)'
                                    }
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ mb: 1.5 }}>
                                            {/* Complaint ID and Status */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 1
                                            }}>
                                                <Typography variant="h6" sx={{
                                                    fontWeight: 700,
                                                    color: '#2c3e50',
                                                    fontSize: { xs: '16px', sm: '18.5px', lg: '20px' },
                                                }}>
                                                    {complaint.complaintId}
                                                </Typography>
                                                <Chip
                                                    icon={<CheckCircle />}
                                                    label="RESOLVED"
                                                    sx={{
                                                        backgroundColor: '#4caf5015',
                                                        color: '#4caf50',
                                                        fontWeight: 600,
                                                        '& .MuiChip-icon': {
                                                            color: '#4caf50'
                                                        }
                                                    }}
                                                />
                                            </Box>

                                            {/* Created Date */}
                                            <Typography variant="body2" sx={{
                                                color: '#7f8c8d',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.6,
                                                mb: 2
                                            }}>
                                                <CalendarToday sx={{ fontSize: '14px' }} />
                                                Resolved on: {formatDate(complaint.updatedAt)}
                                            </Typography>
                                        </Box>

                                        {/* Customer Info */}
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle1" sx={{
                                                fontWeight: 600,
                                                color: '#495057',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                mb: 1
                                            }}>
                                                <Person sx={{ fontSize: '18px', color: '#4fc3f7' }} />
                                                {complaint.customerName}
                                            </Typography>
                                        </Box>

                                        {/* Product Info */}
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{
                                                color: '#7f8c8d',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                mb: 0.5
                                            }}>
                                                <Build sx={{ fontSize: '14px' }} />
                                                Product Information
                                            </Typography>
                                            <Box sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 1,
                                                mb: 1
                                            }}>
                                                <Chip
                                                    label={complaint.productType}
                                                    size="small"
                                                    sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                                                />
                                                <Chip
                                                    label={complaint.brand}
                                                    size="small"
                                                    sx={{ backgroundColor: '#f3e5f5', color: '#7b1fa2' }}
                                                />
                                            </Box>
                                            <Typography variant="body2" sx={{ color: '#495057', fontWeight: 500 }}>
                                                {complaint.productModel}
                                            </Typography>
                                        </Box>

                                        {/* Description Preview */}
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{
                                                color: '#495057',
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 0.5
                                            }}>
                                                <Description sx={{ fontSize: '14px', mt: 0.2 }} />
                                                {complaint.description.length > 100 ?
                                                    `${complaint.description.substring(0, 100)}...` :
                                                    complaint.description
                                                }
                                            </Typography>
                                        </Box>

                                        {/* Expand/Collapse Button */}
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 2
                                        }}>
                                            <Typography variant="body2" sx={{
                                                color: '#7f8c8d',
                                                fontSize: '12px'
                                            }}>
                                                Service completed: {formatDate(complaint.updatedAt)}
                                            </Typography>
                                            <Button
                                                onClick={() => toggleCardExpansion(complaint.complaintId)}
                                                endIcon={expandedCards[complaint.complaintId] ? <ExpandLess /> : <ExpandMore />}
                                                sx={{
                                                    textTransform: 'none',
                                                    color: '#4fc3f7',
                                                    fontWeight: 600
                                                }}
                                            >
                                                {expandedCards[complaint.complaintId] ? 'Less Details' : 'More Details'}
                                            </Button>
                                        </Box>

                                        {/* Expanded Details */}
                                        <Collapse in={expandedCards[complaint.complaintId]}>
                                            <Divider sx={{ my: 2 }} />

                                            {/* Address Details */}
                                            <Box sx={{ mb: 3 }}>
                                                <Typography variant="subtitle2" sx={{
                                                    fontWeight: 600,
                                                    color: '#495057',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    mb: 1
                                                }}>
                                                    <Home sx={{ fontSize: '16px', color: '#fd7e14' }} />
                                                    Service Address
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#7f8c8d', lineHeight: 1.6 }}>
                                                    {complaint.address.doorNumber}, {complaint.address.street}
                                                    {complaint.address.landmark !== 'N/A' && `, ${complaint.address.landmark}`}
                                                    <br />
                                                    {complaint.address.city}, {complaint.address.district}
                                                    <br />
                                                    {complaint.address.state} - {complaint.address.pincode}, {complaint.address.country}
                                                </Typography>
                                            </Box>

                                            {/* Technician Details */}
                                            {complaint.technicianDetails && (
                                                <Box sx={{ mb: 3 }}>
                                                    <Typography variant="subtitle2" sx={{
                                                        fontWeight: 600,
                                                        color: '#495057',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        mb: 1
                                                    }}>
                                                        <Engineering sx={{ fontSize: '16px', color: '#28a745' }} />
                                                        Service Technician
                                                    </Typography>
                                                    <Box sx={{
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: '8px',
                                                        p: 2
                                                    }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                            {complaint.technicianDetails.fullName}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 0.5 }}>
                                                            {complaint.technicianDetails.designation}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{
                                                            color: '#495057',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5
                                                        }}>
                                                            <ContactPhone sx={{ fontSize: '14px' }} />
                                                            {complaint.technicianDetails.phoneNumber}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}

                                            {/* Existing Feedback */}
                                            {complaint.technicianFeedback && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="subtitle2" sx={{
                                                        fontWeight: 600,
                                                        color: '#495057',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        mb: 1
                                                    }}>
                                                        <Feedback sx={{ fontSize: '16px', color: '#ffc107' }} />
                                                        Technician Feedback
                                                    </Typography>
                                                    <Alert severity="info" sx={{ mb: 1, fontSize: '14px' }}>
                                                        {complaint.technicianFeedback}
                                                    </Alert>
                                                </Box>
                                            )}
                                        </Collapse>

                                        {/* Customer Feedback Form */}
                                        <Box sx={{
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '12px',
                                            p: 3,
                                            mt: 2
                                        }}>
                                            <Typography variant="subtitle2" sx={{
                                                fontWeight: 600,
                                                color: '#495057',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                mb: 2
                                            }}>
                                                <Feedback sx={{ fontSize: '16px', color: '#4fc3f7' }} />
                                                Share Your Feedback
                                            </Typography>

                                            {complaint.customerFeedback ? (
                                                <Box>
                                                    {/* Display existing feedback */}
                                                    {!editingFeedback[complaint.complaintId] ? (
                                                        <Box>
                                                            <Alert severity="success" sx={{ fontSize: '14px', mb: 2 }}>
                                                                <strong>Your Feedback:</strong> {complaint.customerFeedback}
                                                            </Alert>
                                                            <Button
                                                                variant="outlined"
                                                                startIcon={<Edit />}
                                                                onClick={() => toggleEditFeedback(complaint.complaintId)}
                                                                sx={{
                                                                    color: '#4fc3f7',
                                                                    borderColor: '#4fc3f7',
                                                                    fontWeight: 600,
                                                                    borderRadius: '8px',
                                                                    textTransform: 'none',
                                                                    px: 2,
                                                                    py: 1,
                                                                    '&:hover': {
                                                                        backgroundColor: 'rgba(79, 195, 247, 0.04)',
                                                                        borderColor: '#29b6f6'
                                                                    }
                                                                }}
                                                            >
                                                                Edit Feedback
                                                            </Button>
                                                        </Box>
                                                    ) : (
                                                        /* Edit feedback form */
                                                        <Formik
                                                            initialValues={{
                                                                complaintId: complaint.complaintId,
                                                                customerFeedback: complaint.customerFeedback
                                                            }}
                                                            validationSchema={validationSchema}
                                                            onSubmit={handleSubmit}
                                                        >
                                                            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                                                                <Form>
                                                                    <StyledTextField
                                                                        fullWidth
                                                                        name="customerFeedback"
                                                                        label="Edit Your Feedback"
                                                                        multiline
                                                                        rows={4}
                                                                        value={values.customerFeedback}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        error={touched.customerFeedback && Boolean(errors.customerFeedback)}
                                                                        helperText={touched.customerFeedback && errors.customerFeedback}
                                                                        placeholder="Update your experience with our service..."
                                                                        sx={{
                                                                            mb: 2,
                                                                            '& .MuiOutlinedInput-root': {
                                                                                borderRadius: '8px',
                                                                                backgroundColor: 'white'
                                                                            }
                                                                        }}
                                                                    />
                                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                                        <Button
                                                                            type="submit"
                                                                            variant="contained"
                                                                            startIcon={<Send />}
                                                                            disabled={isSubmitting || isSavingFeedback}
                                                                            sx={{
                                                                                backgroundColor: '#4fc3f7',
                                                                                color: 'white',
                                                                                fontWeight: 600,
                                                                                borderRadius: '8px',
                                                                                textTransform: 'none',
                                                                                px: 3,
                                                                                py: 1,
                                                                                '&:hover': {
                                                                                    backgroundColor: '#29b6f6'
                                                                                },
                                                                                '&:disabled': {
                                                                                    backgroundColor: '#e0e0e0'
                                                                                }
                                                                            }}
                                                                        >
                                                                            {isSubmitting || isSavingFeedback ? 'Updating...' : 'Update Feedback'}
                                                                        </Button>
                                                                        <Button
                                                                            variant="outlined"
                                                                            onClick={() => toggleEditFeedback(complaint.complaintId)}
                                                                            disabled={isSubmitting || isSavingFeedback}
                                                                            sx={{
                                                                                color: '#757575',
                                                                                borderColor: '#757575',
                                                                                fontWeight: 600,
                                                                                borderRadius: '8px',
                                                                                textTransform: 'none',
                                                                                px: 3,
                                                                                py: 1,
                                                                                '&:hover': {
                                                                                    backgroundColor: 'rgba(117, 117, 117, 0.04)',
                                                                                    borderColor: '#616161'
                                                                                }
                                                                            }}
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                    </Box>
                                                                </Form>
                                                            )}
                                                        </Formik>
                                                    )}
                                                </Box>
                                            ) : (
                                                <Formik
                                                    initialValues={{
                                                        complaintId: complaint.complaintId,
                                                        customerFeedback: ''
                                                    }}
                                                    validationSchema={validationSchema}
                                                    onSubmit={handleSubmit}
                                                >
                                                    {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                                                        <Form>
                                                            <StyledTextField
                                                                fullWidth
                                                                name="customerFeedback"
                                                                label="Your Feedback"
                                                                multiline
                                                                rows={4}
                                                                value={values.customerFeedback}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                error={touched.customerFeedback && Boolean(errors.customerFeedback)}
                                                                helperText={touched.customerFeedback && errors.customerFeedback}
                                                                placeholder="Please share your experience with our service..."
                                                                sx={{
                                                                    mb: 2,
                                                                    '& .MuiOutlinedInput-root': {
                                                                        borderRadius: '8px',
                                                                        backgroundColor: 'white'
                                                                    }
                                                                }}
                                                            />
                                                            <Button
                                                                type="submit"
                                                                variant="contained"
                                                                startIcon={<Send />}
                                                                disabled={isSubmitting || isSavingFeedback}
                                                                sx={{
                                                                    backgroundColor: '#4fc3f7',
                                                                    color: 'white',
                                                                    fontWeight: 600,
                                                                    borderRadius: '8px',
                                                                    textTransform: 'none',
                                                                    px: 3,
                                                                    py: 1,
                                                                    '&:hover': {
                                                                        backgroundColor: '#29b6f6'
                                                                    },
                                                                    '&:disabled': {
                                                                        backgroundColor: '#e0e0e0'
                                                                    }
                                                                }}
                                                            >
                                                                {isSubmitting || isSavingFeedback ? 'Saving...' : 'Save Feedback'}
                                                            </Button>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Info Notice */}
                <Alert
                    severity="info"
                    sx={{
                        marginTop: '20px',
                        borderRadius: '12px',
                        border: '1px solid rgba(33, 150, 243, 0.2)',
                        backgroundColor: 'rgba(33, 150, 243, 0.04)',
                        '& .MuiAlert-icon': {
                            fontSize: '20px',
                            color: '#1976d2'
                        }
                    }}
                >
                    <Typography variant="body2" sx={{
                        fontWeight: 500,
                        color: '#1565c0',
                        fontSize: '0.875rem',
                        lineHeight: 1.5
                    }}>
                        <strong>Feedback Notice:</strong> Your feedback helps us improve our services.
                        You can provide feedback only for resolved complaints. Once submitted, feedback can be updated anytime.
                        Thank you for helping us serve you better!
                    </Typography>
                </Alert>
            </Box>
        </Box>
    );
};

export default ComplaintFeedback;