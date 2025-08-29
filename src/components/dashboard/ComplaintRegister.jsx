import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Avatar, Button, Alert, CircularProgress,
    Divider, Chip, useTheme, useMediaQuery, InputAdornment, MenuItem } from '@mui/material';
import { Person, Email, Phone, Home, Build, Category,
    Business, Save, Cancel, Dashboard, LocationOn, Map, Handyman, Description } from '@mui/icons-material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {useLocation, useNavigate} from 'react-router-dom';
import StyledTextField from "../../utils/form-styling/StyledTextField.jsx";
import StyledMenuProps from "../../utils/form-styling/StyledSelectMenu.jsx";
import useAuth from "../../utils/useAuth.jsx";
import {useComplaintRegisterMutation} from "../../reducers/complaintApi.js";

const PRODUCT_TYPES = ["Air Conditioner", "Refrigerator", "Other"];
const AIR_CONDITIONER_BRANDS = ["Samsung", "LG", "Panasonic", "Daikin", "Haier", "Lloyd", "Hitachi", "BlueStar", "Carrier", "O'General", "Voltas", "Others"];
const AIR_CONDITIONER_MODELS = ["Inverter Technology Split AC", "Non-Inverter Split AC", "Window Air Conditioner"];
const REFRIGERATOR_BRANDS = ["Samsung", "LG", "Whirlpool", "Haier", "Godrej", "Bosch", "Hitachi", "Kelvinator", "Voltas", "Panasonic", "Others"];
const REFRIGERATOR_MODELS = ["Single-door Non-Inverter", "Single-door Inverter", "Double-door Non-Inverter", "Double-door Inverter"];

const validationSchema = Yup.object().shape({
    fullName: Yup.string()
        .min(4, 'Full name must be at least 4 characters')
        .required('Full name is required'),
    contactNumber: Yup.string()
        .matches(/^\d{10}$/, 'Contact number must be 10 digits')
        .required('Contact number is required'),
    email: Yup.string()
        .transform(value => (value ? value.trim() : value))
        .email('Invalid email address'),
    doorNumber: Yup.string()
        .min(1, 'Door number is required')
        .required('Door number is required'),
    street: Yup.string()
        .min(3, 'Street must be at least 3 characters')
        .required('Street is required'),
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
        .min(2, 'Country must be at least 2 characters')
        .required('Country is required'),
    productType: Yup.string()
        .oneOf(PRODUCT_TYPES, 'Please select a valid product type')
        .required('Product type is required'),
    brand: Yup.string()
        .required('Brand is required'),
    productModel: Yup.string()
        .required('Product model is required'),
    description: Yup.string()
        .min(10, 'Description must be at least 10 characters')
        .required('Description is required')
});

const ComplaintRegister = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const productType = queryParams.get("productType");

    const initialValues = {
        fullName: '',
        contactNumber: '',
        email: '',
        doorNumber: '',
        street: '',
        landmark: '',
        city: '',
        district: '',
        state: '',
        pincode: '',
        country: 'India',
        productType: productType ? productType : '',
        brand: '',
        productModel: '',
        description: ''
    };

    const getBrandOptions = productType => {
        switch (productType) {
            case 'Air Conditioner':
                return AIR_CONDITIONER_BRANDS;
            case 'Refrigerator':
                return REFRIGERATOR_BRANDS;
            default:
                return ['Others'];
        }
    };

    const getModelOptions = productType => {
        switch (productType) {
            case 'Air Conditioner':
                return AIR_CONDITIONER_MODELS;
            case 'Refrigerator':
                return REFRIGERATOR_MODELS;
            default:
                return ['Others'];
        }
    };

    const [complaintRegister] = useComplaintRegisterMutation();

    const handleSubmit = async (values, { resetForm }) => {
        setIsSubmitting(true);

        const complaintDTO = {
            bookedById: user?.userId,
            customerName: values.fullName,
            contactNumber: values.contactNumber,
            email: values.email || 'N/A',
            address: {
                doorNumber: values.doorNumber,
                street: values.street,
                landmark: values.landmark || 'N/A',
                city: values.city,
                district: values.district,
                state: values.state,
                pincode: values.pincode,
                country: values.country
            },
            productType: values.productType,
            brand: values.brand,
            productModel: values.productModel,
            description: values.description
        };

        try {
            await complaintRegister(complaintDTO).unwrap();

            toast.success('Complaint registered successfully!');
            resetForm();
            navigate(-1);
        }
        catch (error) {
            toast.error('Failed to register complaint. Please try again.');
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            padding: {
                xs: '80px 10px 20px',
                sm: '90px 16px 20px',
                md: '100px 20px 20px'
            },
        }}>
            <Box sx={{
                maxWidth: '1200px',
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
                            top: {
                                xs: 12,
                                md: 20
                            },
                            right: {
                                xs: 12,
                                md: 20
                            },
                            display: 'flex',
                            gap: 1
                        }}>
                            <Button
                                variant="outlined"
                                startIcon={<Dashboard />}
                                onClick={() => navigate('/dashboard')}
                                sx={{
                                    color: 'white',
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    fontWeight: 600,
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    padding: {
                                        xs: '8px 16px',
                                        md: '12px 24px'
                                    },
                                    fontSize: {
                                        xs: '0.8rem',
                                        md: '1rem'
                                    },
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        borderColor: 'rgba(255, 255, 255, 0.5)'
                                    }
                                }}
                            >
                                Dashboard
                            </Button>
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
                                <Handyman sx={{
                                    fontSize: {
                                        xs: '2rem',
                                        md: '3rem'
                                    }
                                }} />
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
                                    Register Complaint
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: {
                                        xs: 1,
                                        md: 2
                                    },
                                    marginBottom: '16px',
                                    flexWrap: 'wrap',
                                    justifyContent: {
                                        xs: 'center',
                                        sm: 'flex-start'
                                    }
                                }}>
                                    <Chip
                                        label={user?.userType}
                                        size={isMobile ? "small" : "medium"}
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            fontWeight: 600,
                                            backdropFilter: 'blur(10px)',
                                            fontSize: {
                                                xs: '0.75rem',
                                                md: '0.875rem'
                                            }
                                        }}
                                    />
                                    <Chip
                                        label="NEW COMPLAINT"
                                        size={isMobile ? "small" : "medium"}
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            fontWeight: 600,
                                            backdropFilter: 'blur(10px)',
                                            fontSize: {
                                                xs: '0.75rem',
                                                md: '0.875rem'
                                            }
                                        }}
                                    />
                                </Box>
                                <Typography variant="body1" sx={{
                                    opacity: 0.9,
                                    fontSize: {
                                        xs: '0.95rem',
                                        md: '1.1rem'
                                    }
                                }}>
                                    Submit your product service request and issue details
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Complaint Form */}
                <Paper sx={{
                    borderRadius: {
                        xs: '16px',
                        md: '20px'
                    },
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    p: {
                        xs: 2,
                        sm: 3,
                        md: 4
                    }
                }}>
                    <Box sx={{
                        textAlign: 'center',
                        marginBottom: {
                            xs: '24px',
                            md: '40px'
                        },
                        position: 'relative'
                    }}>
                        <Typography variant={isMobile ? "h5" : "h4"} sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '12px',
                            letterSpacing: '-0.02em',
                            fontSize: {
                                xs: '1.5rem',
                                sm: '1.8rem',
                                md: '2.125rem'
                            }
                        }}>
                            Complaint Details
                        </Typography>
                        <Box sx={{
                            width: '60px',
                            height: '4px',
                            background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
                            borderRadius: '2px',
                            margin: '0 auto',
                            marginBottom: '8px'
                        }} />
                        <Typography variant="body1" sx={{
                            color: '#7f8c8d',
                            maxWidth: '500px',
                            margin: '0 auto',
                            fontSize: {
                                xs: '0.9rem',
                                md: '1rem'
                            },
                            padding: {
                                xs: '0 16px',
                                md: '0'
                            }
                        }}>
                            Please provide accurate information for quick resolution
                        </Typography>
                    </Box>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize={true}
                    >
                        {({ values, handleChange, errors, touched, setFieldValue }) => (
                            <Form>
                                {/* Personal Information Section */}
                                <Box sx={{
                                    marginBottom: {
                                        xs: '24px',
                                        md: '40px'
                                    }
                                }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        marginBottom: {
                                            xs: '20px',
                                            md: '24px'
                                        },
                                        color: '#495057',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        fontSize: {
                                            xs: '1.1rem',
                                            md: '1.25rem'
                                        },
                                        justifyContent: {
                                            xs: 'center',
                                            sm: 'flex-start'
                                        }
                                    }}>
                                        <Person sx={{ color: '#4fc3f7' }} />
                                        Personal Information
                                    </Typography>

                                    <Grid container spacing={{
                                        xs: 2,
                                        md: 3
                                    }}>
                                        <Grid size={{xs:12, sm:6}}>
                                            <Box sx={{ mb: 0.5 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Full Name"
                                                    name="fullName"
                                                    value={values.fullName}
                                                    onChange={handleChange}
                                                    error={Boolean((touched.fullName || values.fullName) && errors.fullName)}
                                                    helperText={(touched.fullName || values.fullName) && errors.fullName}
                                                    variant="outlined"
                                                    placeholder="Enter your full name"
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
                                                        }
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Person sx={{
                                                                    color: '#4fc3f9',
                                                                    fontSize: {
                                                                        xs: '18px',
                                                                        md: '20px'
                                                                    }
                                                                }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid size={{xs:12, sm:6}}>
                                            <Box sx={{ mb: 0.5 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Contact Number"
                                                    name="contactNumber"
                                                    value={values.contactNumber}
                                                    onChange={handleChange}
                                                    error={Boolean((touched.contactNumber || values.contactNumber) && errors.contactNumber)}
                                                    helperText={(touched.contactNumber || values.contactNumber) && errors.contactNumber}
                                                    variant="outlined"
                                                    placeholder="Enter your phone number"
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
                                                        }
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Phone sx={{
                                                                    color: '#28a745',
                                                                    fontSize: {
                                                                        xs: '18px',
                                                                        md: '20px'
                                                                    }
                                                                }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid size={{xs:12, sm:6}}>
                                            <Box sx={{ mb: 0.5 }}>
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
                                                        }
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Email sx={{
                                                                    color: '#dc3545',
                                                                    fontSize: {
                                                                        xs: '18px',
                                                                        md: '20px'
                                                                    }
                                                                }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Address Information Section */}
                                <Box sx={{
                                    marginBottom: {
                                        xs: '24px',
                                        md: '40px'
                                    }
                                }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        marginBottom: {
                                            xs: '20px',
                                            md: '24px'
                                        },
                                        color: '#495057',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        fontSize: {
                                            xs: '1.1rem',
                                            md: '1.25rem'
                                        },
                                        justifyContent: {
                                            xs: 'center',
                                            sm: 'flex-start'
                                        }
                                    }}>
                                        <Home sx={{ color: '#fd7e14' }} />
                                        Service Address
                                    </Typography>

                                    <Grid container spacing={{
                                        xs: 2,
                                        md: 3
                                    }}>
                                        <Grid size={{xs:12, sm:6, md:4}}>
                                            <Box sx={{ mb: 0.5 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Door Number"
                                                    name="doorNumber"
                                                    value={values.doorNumber}
                                                    onChange={handleChange}
                                                    error={Boolean((touched.doorNumber || values.doorNumber) && errors.doorNumber)}
                                                    helperText={(touched.doorNumber || values.doorNumber) && errors.doorNumber}
                                                    variant="outlined"
                                                    placeholder="Enter your door/flat number"
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
                                                        }
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Home sx={{
                                                                    color: '#fd7e14',
                                                                    fontSize: {
                                                                        xs: '18px',
                                                                        md: '20px'
                                                                    }
                                                                }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid size={{xs:12, sm:6, md:8}}>
                                            <Box sx={{ mb: 0.5 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Street"
                                                    name="street"
                                                    value={values.street}
                                                    onChange={handleChange}
                                                    error={Boolean((touched.street || values.street) && errors.street)}
                                                    helperText={(touched.street || values.street) && errors.street}
                                                    variant="outlined"
                                                    placeholder="Enter street name"
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
                                                        }
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LocationOn sx={{
                                                                    color: '#fd7e14',
                                                                    fontSize: {
                                                                        xs: '18px',
                                                                        md: '20px'
                                                                    }
                                                                }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid size={{xs:12, sm:6, md:8}}>
                                            <Box sx={{ mb: 0.5 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Landmark"
                                                    name="landmark"
                                                    value={values.landmark}
                                                    onChange={handleChange}
                                                    error={Boolean((touched.landmark || values.landmark) && errors.landmark)}
                                                    helperText={(touched.landmark || values.landmark) && errors.landmark}
                                                    variant="outlined"
                                                    placeholder="Enter landmark"
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
                                                        }
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LocationOn sx={{
                                                                    color: '#c27d3e',
                                                                    fontSize: {
                                                                        xs: '18px',
                                                                        md: '20px'
                                                                    }
                                                                }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid size={{xs:12, sm:6}}>
                                            <Box sx={{ mb: 0.5 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="City"
                                                    name="city"
                                                    value={values.city}
                                                    onChange={handleChange}
                                                    error={Boolean((touched.city || values.city) && errors.city)}
                                                    helperText={(touched.city || values.city) && errors.city}
                                                    variant="outlined"
                                                    placeholder="Enter city"
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
                                                        }
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Map sx={{
                                                                    color: '#20c997',
                                                                    fontSize: {
                                                                        xs: '18px',
                                                                        md: '20px'
                                                                    }
                                                                }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid size={{xs:12, sm:6}}>
                                            <Box sx={{ mb: 0.5 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="District"
                                                    name="district"
                                                    value={values.district}
                                                    onChange={handleChange}
                                                    error={Boolean((touched.district || values.district) && errors.district)}
                                                    helperText={(touched.district || values.district) && errors.district}
                                                    variant="outlined"
                                                    placeholder="Enter district"
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
                                                        }
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Map sx={{
                                                                    color: '#20c997',
                                                                    fontSize: {
                                                                        xs: '18px',
                                                                        md: '20px'
                                                                    }
                                                                }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid size={{xs:12, sm:6, md:4}}>
                                            <Box sx={{ mb: 0.5 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="State"
                                                    name="state"
                                                    value={values.state}
                                                    onChange={handleChange}
                                                    error={Boolean((touched.state || values.state) && errors.state)}
                                                    helperText={(touched.state || values.state) && errors.state}
                                                    variant="outlined"
                                                    placeholder="Enter state"
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
                                                        }
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Map sx={{
                                                                    color: '#20c997',
                                                                    fontSize: {
                                                                        xs: '18px',
                                                                        md: '20px'
                                                                    }
                                                                }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid size={{xs:12, sm:6, md:4}}>
                                            <Box sx={{ mb: 0.5 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Pincode"
                                                    name="pincode"
                                                    value={values.pincode}
                                                    onChange={handleChange}
                                                    error={Boolean((touched.pincode || values.pincode) && errors.pincode)}
                                                    helperText={(touched.pincode || values.pincode) && errors.pincode}
                                                    variant="outlined"
                                                    placeholder="Enter 6-digit pincode"
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
                                                        }
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LocationOn sx={{
                                                                    color: '#fd7e14',
                                                                    fontSize: {
                                                                        xs: '18px',
                                                                        md: '20px'
                                                                    }
                                                                }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Box>
                                        </Grid>

                                        <Grid size={{xs:12, sm:6, md:4}}>
                                            <Box sx={{ mb: 0.5 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Country"
                                                    name="country"
                                                    value={values.country}
                                                    onChange={handleChange}
                                                    error={Boolean((touched.country || values.country) && errors.country)}
                                                    helperText={(touched.country || values.country) && errors.country}
                                                    variant="outlined"
                                                    placeholder="Enter country"
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
                                                        }
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Map sx={{
                                                                    color: '#20c997',
                                                                    fontSize: {
                                                                        xs: '18px',
                                                                        md: '20px'
                                                                    }
                                                                }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Product Information Section */}
                                <Box sx={{
                                    marginBottom: {
                                        xs: '24px',
                                        md: '40px'
                                    }
                                }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        marginBottom: {
                                            xs: '20px',
                                            md: '24px'
                                        },
                                        color: '#495057',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        fontSize: {
                                            xs: '1.1rem',
                                            md: '1.25rem'
                                        },
                                        justifyContent: {
                                            xs: 'center',
                                            sm: 'flex-start'
                                        }
                                    }}>
                                        <Build sx={{ color: '#ff6b35' }} />
                                        Product Information
                                    </Typography>

                                    <Grid container spacing={{
                                        xs: 2,
                                        md: 3
                                    }}>
                                        <Grid size={{xs:12, sm:6, md:4}}>
                                            <Box sx={{ mb: 0.5 }}>
                                                <StyledTextField
                                                    fullWidth
                                                    select
                                                    label="Product Type"
                                                    name="productType"
                                                    value={values.productType}
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
                                                    }}
                                                >
                                                    <MenuItem value="">--Select Product Type--</MenuItem>
                                                    {PRODUCT_TYPES.map(type => (
                                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                                    ))}
                                                </StyledTextField>
                                            </Box>
                                        </Grid>

                                        <Grid size={{xs:12, sm:6, md:4}}>
                                            <Box sx={{ mb: 0.5 }}>
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
                                                    variant="outlined"
                                                    disabled={!values.productType}
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
                                                    }}
                                                >
                                                    <MenuItem value="">--Select Brand--</MenuItem>
                                                    {getBrandOptions(values.productType).map(brand => (
                                                        <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                                                    ))}
                                                </StyledTextField>
                                            </Box>
                                        </Grid>

                                        <Grid size={{xs:12, sm:6, md:4}}>
                                            <Box sx={{ mb: 0.5 }}>
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
                                                    disabled={!values.productType || !values.brand}
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
                                                    }}
                                                >
                                                    <MenuItem value="">--Select Model--</MenuItem>
                                                    {getModelOptions(values.productType).map((model) => (
                                                        <MenuItem key={model} value={model}>{model}</MenuItem>
                                                    ))}
                                                </StyledTextField>
                                            </Box>
                                        </Grid>

                                        <Grid size={{xs:12}}>
                                            <Box sx={{ mb: 0.5 }}>
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
                                                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', marginTop: '12px' }}>
                                                                <Description sx={{
                                                                    color: '#20c997',
                                                                    fontSize: {
                                                                        xs: '18px',
                                                                        md: '20px'
                                                                    }
                                                                }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Action Buttons */}
                                <Divider sx={{
                                    my: {
                                        xs: 3,
                                        md: 4
                                    },
                                    borderColor: 'rgba(0, 0, 0, 0.08)',
                                    borderWidth: '1px'
                                }} />

                                <Box sx={{
                                    display: 'flex',
                                    gap: {
                                        xs: 2,
                                        md: 3
                                    },
                                    justifyContent: {
                                        xs: 'center',
                                        sm: 'flex-end'
                                    },
                                    flexWrap: 'wrap',
                                    marginTop: {
                                        xs: '24px',
                                        md: '32px'
                                    },
                                    flexDirection: {
                                        xs: 'column',
                                        sm: 'row'
                                    }
                                }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Cancel />}
                                        onClick={() => {
                                            navigate(-1);
                                        }}
                                        disabled={isSubmitting}
                                        fullWidth={isMobile}
                                        sx={{
                                            borderRadius: {
                                                xs: '8px',
                                                md: '12px'
                                            },
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            padding: {
                                                xs: '12px 24px',
                                                md: '14px 32px'
                                            },
                                            fontSize: {
                                                xs: '0.9rem',
                                                md: '1rem'
                                            },
                                            borderColor: '#dc3545',
                                            color: '#dc3545',
                                            minWidth: {
                                                xs: 'auto',
                                                sm: '140px'
                                            },
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: '#c82333',
                                                backgroundColor: 'rgba(220, 53, 69, 0.04)',
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(220, 53, 69, 0.2)'
                                            },
                                            '&:active': {
                                                transform: 'translateY(0px)'
                                            }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                        disabled={isSubmitting}
                                        fullWidth={isMobile}
                                        sx={{
                                            borderRadius: {
                                                xs: '8px',
                                                md: '12px'
                                            },
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            padding: {
                                                xs: '12px 24px',
                                                md: '14px 32px'
                                            },
                                            fontSize: {
                                                xs: '0.9rem',
                                                md: '1rem'
                                            },
                                            minWidth: {
                                                xs: 'auto',
                                                sm: '180px'
                                            },
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                                boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)',
                                                transform: 'translateY(-2px)'
                                            },
                                            '&:active': {
                                                transform: 'translateY(0px)'
                                            },
                                            '&:disabled': {
                                                background: '#cccccc',
                                                boxShadow: 'none',
                                                transform: 'none'
                                            }
                                        }}
                                    >
                                        {isSubmitting ? 'Registering Complaint...' : 'Register Complaint'}
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Paper>

                {/* Important Notice */}
                <Alert
                    severity="info"
                    sx={{
                        marginTop: '20px',
                        borderRadius: {
                            xs: '8px',
                            md: '12px'
                        },
                        border: '1px solid rgba(33, 150, 243, 0.2)',
                        backgroundColor: 'rgba(33, 150, 243, 0.04)',
                        '& .MuiAlert-icon': {
                            fontSize: {
                                xs: '20px',
                                md: '24px'
                            },
                            color: '#1976d2'
                        },
                        '& .MuiAlert-message': {
                            padding: '8px 0'
                        }
                    }}
                >
                    <Typography variant="body2" sx={{
                        fontWeight: 500,
                        color: '#1565c0',
                        fontSize: {
                            xs: '0.8rem',
                            md: '0.875rem'
                        },
                        lineHeight: 1.5
                    }}>
                        <strong>Service Notice:</strong> Please ensure all information is accurate for quick resolution.
                        Our service team will contact you within 24-48 hours to schedule an appointment.
                        Keep your contact number active for service updates.
                    </Typography>
                </Alert>
            </Box>
        </Box>
    );
};

export default ComplaintRegister;