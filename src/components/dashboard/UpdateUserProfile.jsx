import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Avatar, Button, Alert, CircularProgress,
    Divider, InputAdornment, MenuItem, Chip, useTheme, useMediaQuery } from '@mui/material';
import { Person, Email, Phone, Badge, CalendarToday, Work, Save, Cancel,
    LocationOn, CurrencyRupee, WorkOutline, Dashboard, Male, Female, Transgender } from '@mui/icons-material';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../utils/useAuth.jsx';
import StyledTextField from "../../utils/form-styling/StyledTextField.jsx";
import StyledMenuProps from "../../utils/form-styling/StyledSelectMenu.jsx";
import ProfileUtils from "../../utils/ProfileUtils.jsx";
import { useCustomerProfileQuery, useEmployeeProfileQuery, useOwnerProfileQuery, useUpdateCustomerProfileMutation,
    useUpdateOwnerProfileMutation, useUpdateEmployeeProfileMutation } from "../../reducers/userProfileApi.js";

const UpdateUserProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userId = user.userId;
    const userType = user.userType;

    const hooks = {
        CUSTOMER: useCustomerProfileQuery,
        OWNER: useOwnerProfileQuery,
        EMPLOYEE: useEmployeeProfileQuery
    };

    const useProfileQuery = hooks[userType];
    const { data: profile, isLoading } = useProfileQuery(userId);

    if (isLoading) {
        ProfileUtils.profileLoader("Loading profile data...");
    }

    const userData = {
        userId: userId || 'N/A',
        userType: userType || 'USER',
        firstName: profile?.userDTO?.firstName || 'User',
        lastName: profile?.userDTO?.lastName || 'N/A',
        gender: profile?.userDTO?.gender || 'other',
        phoneNumber: profile?.userDTO?.phoneNumber.slice(3) || 'N/A',
        email: profile?.userDTO?.email || 'N/A',
        address: profile?.userDTO?.address || 'N/A',
        createdAt: profile?.userDTO?.createdAt,
        updatedAt: profile?.userDTO?.updatedAt,
        userStatus: profile?.userDTO?.status || 'N/A',
        // For Owner/Employee only
        dateOfBirth: profile?.userDTO?.dateOfBirth || '1990-01-01',
        nationalIdNumber: profile?.userDTO?.nationalIdNumber || 'N/A',
        // For Employee only
        dateOfHire: profile?.userDTO?.dateOfHire,
        dateOfExit: profile?.userDTO?.dateOfExit,
        designation: profile?.userDTO?.designation || 'N/A',
        salary: profile?.userDTO?.salary || '000'
    };

    const [updateCustomerProfile] = useUpdateCustomerProfileMutation();
    const [updateOwnerProfile] = useUpdateOwnerProfileMutation();
    const [updateEmployeeProfile] = useUpdateEmployeeProfileMutation();

    const handleSubmit = async (values, { setFieldError }) => {
        setIsSubmitting(true);
        const isMobileNumberUpdated = userData.phoneNumber !== values.phoneNumber;
        const isEmailUpdated = userData.email !== values.email;
        const userCredentialDTO = {
            userId: (isMobileNumberUpdated || isEmailUpdated) ? userData.userId : null,
            phoneNumber: isMobileNumberUpdated ? values.phoneNumber : null,
            email: isEmailUpdated ? values.email : null
        }

        try {
            console.log("Values: ", values);
            if(userType === 'CUSTOMER') {
                const customerCredentialDTO = {
                    customerDTO: {
                        customerId: userId,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        gender: values.gender,
                        phoneNumber: values.phoneNumber,
                        email: values.email.toLowerCase(),
                        address: values.address,
                        status: userData.userStatus
                    },
                    userCredentialDTO: userCredentialDTO
                }
                await updateCustomerProfile(customerCredentialDTO).unwrap();
            }
            else if(userType === 'OWNER') {
                const ownerCredentialDTO = {
                    ownerDTO: {
                        ownerId: userId,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        dateOfBirth: values.dateOfBirth,
                        gender: values.gender,
                        phoneNumber: values.phoneNumber,
                        email: values.email.toLowerCase(),
                        address: values.address,
                        nationalIdNumber: values.nationalIdNumber,
                        status: userData.userStatus
                    },
                    userCredentialDTO: userCredentialDTO
                }
                await updateOwnerProfile(ownerCredentialDTO).unwrap();
            }
            else if(userType === 'EMPLOYEE') {
                const employeeCredentialDTO = {
                    employeeDTO: {
                        employeeId: userId,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        dateOfBirth: values.dateOfBirth,
                        gender: values.gender,
                        phoneNumber: values.phoneNumber,
                        email: values.email.toLowerCase(),
                        address: values.address,
                        nationalIdNumber: values.nationalIdNumber,
                        designation: values.designation,
                        salary: values.salary,
                        status: userData.userStatus
                    },
                    userCredentialDTO: userCredentialDTO
                }
                await updateEmployeeProfile(employeeCredentialDTO).unwrap();
            }

            toast.success('Profile updated successfully!');
            navigate('/profile');
        } catch (error) {
            error.status === 409
                ? ProfileUtils.handleDuplicateFieldError(error, setFieldError)
                : toast.error("Profile update failed. Please try again.");
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    const statusColors = ProfileUtils.getStatusColor(userData.userStatus);

    const getGenderIcon = gender => {
        switch (gender?.toLowerCase()) {
            case 'male':
                return <Male sx={{ color: '#2196f3' }} />;
            case 'female':
                return <Female sx={{ color: '#e91e63' }} />;
            default:
                return <Transgender sx={{ color: '#9c27b0' }} />;
        }
    };

    const initialValues = ProfileUtils.getInitialValues(userType, { userDTO: userData }, true);
    const validationSchema = ProfileUtils.getValidationSchema(userType, true);

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
                                {userData.firstName?.[0]}{userData.lastName?.[0]}
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
                                    Update Profile
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
                                        label={userData.userType}
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
                                        icon={statusColors.icon}
                                        label={userData.userStatus.toUpperCase()}
                                        size={isMobile ? "small" : "medium"}
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            fontWeight: 600,
                                            backdropFilter: 'blur(10px)',
                                            '& .MuiChip-icon': {
                                                color: 'white',
                                                fontSize: {
                                                    xs: '16px',
                                                    md: '20px'
                                                }
                                            },
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
                                    Edit your personal information and preferences
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Update Form */}
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
                            Profile Information
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
                            Update your personal details and account information
                        </Typography>
                    </Box>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize={true}
                    >
                        {({ values, handleChange, errors, touched}) => (
                            <Form>
                                {/* Basic Information Section */}
                                <Box sx={{
                                    marginBottom: {
                                        xs: '24px',
                                        md: '40px'
                                    }
                                }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        marginBottom: {
                                            xs: '16px',
                                            md: '20px'
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
                                        Basic Information
                                    </Typography>

                                    <Grid container spacing={{
                                        xs: 2,
                                        md: 3
                                    }}>
                                        <Grid size={{xs:12, sm:6, md:4}}>
                                            <StyledTextField
                                                fullWidth
                                                label="First Name"
                                                name="firstName"
                                                value={values.firstName}
                                                onChange={handleChange}
                                                error={Boolean(touched.firstName && errors.firstName)}
                                                helperText={touched.firstName && errors.firstName}
                                                variant="outlined"
                                                placeholder="Enter your first name"
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
                                                                color: '#7f8c8d',
                                                                fontSize: {
                                                                    xs: '18px',
                                                                    md: '20px'
                                                                }
                                                            }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{xs:12, sm:6, md:4}}>
                                            <StyledTextField
                                                fullWidth
                                                label="Last Name"
                                                name="lastName"
                                                value={values.lastName}
                                                onChange={handleChange}
                                                error={Boolean(touched.lastName && errors.lastName)}
                                                helperText={touched.lastName && errors.lastName}
                                                variant="outlined"
                                                placeholder="Enter your last name"
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
                                                                color: '#7f8c8d',
                                                                fontSize: {
                                                                    xs: '18px',
                                                                    md: '20px'
                                                                }
                                                            }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{xs:12, sm:6, md:4}}>
                                            <StyledTextField
                                                fullWidth
                                                select
                                                label="Gender"
                                                name="gender"
                                                value={values.gender}
                                                onChange={handleChange}
                                                error={Boolean(touched.gender && errors.gender)}
                                                helperText={touched.gender && errors.gender}
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
                                                            {getGenderIcon(values.gender)}
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            >
                                                <MenuItem value="">--select--</MenuItem>
                                                <MenuItem value="Male">Male</MenuItem>
                                                <MenuItem value="Female">Female</MenuItem>
                                                <MenuItem value="Transgender">Transgender</MenuItem>
                                                <MenuItem value="Other">Other</MenuItem>
                                                <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                                            </StyledTextField>
                                        </Grid>

                                        {/* Date of Birth for Owner/Employee */}
                                        {(userType === 'OWNER' || userType === 'EMPLOYEE') && (
                                            <Grid size={{xs:12, sm:6, md:4}}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Date of Birth"
                                                    name="dateOfBirth"
                                                    type="date"
                                                    value={values.dateOfBirth ? new Date(values.dateOfBirth).toISOString().split('T')[0] : ''}
                                                    onChange={handleChange}
                                                    error={Boolean(touched.dateOfBirth && errors.dateOfBirth)}
                                                    helperText={touched.dateOfBirth && errors.dateOfBirth}
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
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <CalendarToday sx={{
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
                                            </Grid>
                                        )}

                                        {/* National ID for Owner/Employee */}
                                        {(userType === 'OWNER' || userType === 'EMPLOYEE') && (
                                            <Grid size={{xs:12, sm:6, md:4}}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Aadhar or PAN Number"
                                                    name="nationalIdNumber"
                                                    value={values.nationalIdNumber}
                                                    onChange={handleChange}
                                                    error={Boolean(touched.nationalIdNumber && errors.nationalIdNumber)}
                                                    helperText={touched.nationalIdNumber && errors.nationalIdNumber}
                                                    variant="outlined"
                                                    placeholder="Enter your Aadhar or PAN number"
                                                    disabled={userType !== 'OWNER'}
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
                                                            },
                                                            '&.Mui-disabled': {
                                                                backgroundColor: '#f8f9fa',
                                                                opacity: 0.7
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
                                                                <Badge sx={{
                                                                    color: '#6610f2',
                                                                    fontSize: {
                                                                        xs: '18px',
                                                                        md: '20px'
                                                                    }
                                                                }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                </Box>

                                {/* Contact Information Section */}
                                <Box sx={{
                                    marginBottom: {
                                        xs: '24px',
                                        md: '40px'
                                    }
                                }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        marginBottom: {
                                            xs: '16px',
                                            md: '20px'
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
                                        <Phone sx={{ color: '#28a745' }} />
                                        Contact Information
                                    </Typography>

                                    <Grid container spacing={{
                                        xs: 2,
                                        md: 3
                                    }}>
                                        <Grid size={{xs:12, sm:6}}>
                                            <StyledTextField
                                                fullWidth
                                                label="Phone Number"
                                                name="phoneNumber"
                                                value={values.phoneNumber}
                                                onChange={handleChange}
                                                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                                                helperText={touched.phoneNumber && errors.phoneNumber}
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
                                        </Grid>
                                        <Grid size={{xs:12, sm:6}}>
                                            <StyledTextField
                                                fullWidth
                                                label="Email"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                error={Boolean(touched.email && errors.email)}
                                                helperText={touched.email && errors.email}
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
                                        </Grid>
                                        <Grid size={{xs:12}}>
                                            <StyledTextField
                                                fullWidth
                                                label="Address"
                                                name="address"
                                                value={values.address}
                                                onChange={handleChange}
                                                error={Boolean(touched.address && errors.address)}
                                                helperText={touched.address && errors.address}
                                                variant="outlined"
                                                multiline
                                                rows={3}
                                                placeholder="Enter your full address"
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
                                                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', marginTop: '12px' }}>
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
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Employment Details for Employee */}
                                {userType === 'EMPLOYEE' && (
                                    <Box sx={{
                                        marginBottom: {
                                            xs: '24px',
                                            md: '40px'
                                        }
                                    }}>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 600,
                                            marginBottom: {
                                                xs: '16px',
                                                md: '20px'
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
                                            <Work sx={{ color: '#ff6b35' }} />
                                            Employment Details
                                        </Typography>

                                        <Grid container spacing={{
                                            xs: 2,
                                            md: 3
                                        }}>
                                            <Grid size={{xs:12, sm:6}}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Designation"
                                                    name="designation"
                                                    value={values.designation}
                                                    onChange={handleChange}
                                                    error={Boolean(touched.designation && errors.designation)}
                                                    helperText={touched.designation && errors.designation}
                                                    variant="outlined"
                                                    placeholder="Enter designation"
                                                    disabled={userType !== 'OWNER'}
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
                                                            },
                                                            '&.Mui-disabled': {
                                                                backgroundColor: '#f8f9fa',
                                                                opacity: 0.7
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
                                                                <WorkOutline sx={{
                                                                    color: '#ff6b35',
                                                                    fontSize: {
                                                                        xs: '18px',
                                                                        md: '20px'
                                                                    }
                                                                }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{xs:12, sm:6}}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Salary"
                                                    name="salary"
                                                    value={values.salary}
                                                    onChange={handleChange}
                                                    error={Boolean(touched.salary && errors.salary)}
                                                    helperText={touched.salary && errors.salary}
                                                    variant="outlined"
                                                    placeholder="Enter salary"
                                                    disabled={userType !== 'OWNER'}
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
                                                            },
                                                            '&.Mui-disabled': {
                                                                backgroundColor: '#f8f9fa',
                                                                opacity: 0.7
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
                                                                <CurrencyRupee sx={{
                                                                    color: '#ffc107',
                                                                    fontSize: {
                                                                        xs: '18px',
                                                                        md: '20px'
                                                                    }
                                                                }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

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
                                        onClick={handleCancel}
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
                                        {isSubmitting ? 'Updating Profile...' : 'Update Profile'}
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Paper>

                {/* Security Notice */}
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
                        <strong>Update Notice:</strong> Changes to your email or phone number may require verification.
                        Some fields may not be editable based on your user type and company policies.
                    </Typography>
                </Alert>
            </Box>
        </Box>
    );
};

export default UpdateUserProfile;