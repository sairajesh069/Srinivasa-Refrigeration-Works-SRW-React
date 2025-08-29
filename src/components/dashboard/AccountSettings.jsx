import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Avatar, Button, Alert, CircularProgress,
    Divider, InputAdornment, Chip, IconButton, Tooltip, Card, CardContent, useTheme, useMediaQuery } from '@mui/material';
import { Settings, Person, Lock, Visibility, VisibilityOff, Save, Cancel,
    Dashboard, Security, Key, Shield, AccountCircle, AccessTime, VpnKey } from '@mui/icons-material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../utils/useAuth.jsx';
import StyledTextField from "../../utils/form-styling/StyledTextField.jsx";
import ProfileUtils from "../../utils/ProfileUtils.jsx";
import { useFetchUsernameQuery, useChangePasswordMutation } from "../../reducers/userProfileApi.js";

const AccountSettings = () => {
    const { user, isLoggingOut, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data: loginData } = useFetchUsernameQuery(user?.userId);

    const validationSchema = Yup.object({
        oldPassword: Yup.string()
            .required('Current password is required')
            .min(8, 'Password must be at least 8 characters'),
        newPassword: Yup.string()
            .required('New password is required')
            .min(8, 'New password must be at least 8 characters')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%.*?&])[A-Za-z\d@$!%*.?&]/,
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            ),
        confirmPassword: Yup.string()
            .required('Please confirm your new password')
            .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    });

    const [changePassword] = useChangePasswordMutation();
    const handleSubmit = async (values, { setFieldError, resetForm }) => {
        setIsSubmitting(true);

        try {
            if(values.oldPassword === values.newPassword) {
                setFieldError('newPassword', 'New password cannot be the same as the current password');
                toast.error("Invalid new password");
                setIsSubmitting(false);
                return;
            }
            const passwordChangeDTO = {
                userId: user?.userId,
                username: loginData?.username,
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            };

            await changePassword(passwordChangeDTO).unwrap();
            toast.success('Password updated successfully. Please login again!');
            resetForm();
            await logout(false);
        }
        catch (error) {
            const errorMessage = error?.data?.message || error?.message;
            if (errorMessage === 'Invalid current password') {
                setFieldError('oldPassword', 'Current password is incorrect');
                toast.error(errorMessage);
            }
            else {
                toast.error('Failed to update password. Please try again.');
            }
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const statusColors = ProfileUtils.getStatusColor(user?.status || 'active');

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
                            <Tooltip title="Dashboard">
                                <IconButton
                                    sx={{
                                        color: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                                        width: {
                                            xs: 40,
                                            md: 48
                                        },
                                        height: {
                                            xs: 40,
                                            md: 48
                                        }
                                    }}
                                    onClick={() => navigate('/dashboard')}
                                >
                                    <Dashboard sx={{
                                        fontSize: {
                                            xs: '20px',
                                            md: '24px'
                                        }
                                    }} />
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
                                <Settings sx={{
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
                                    Account Settings
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
                                        label={user?.userType || 'USER'}
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
                                        label="ACTIVE"
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
                                    Manage your account security and preferences
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Account Overview Cards */}
                <Grid container spacing={{
                    xs: 2,
                    md: 3
                }} sx={{
                    marginBottom: {
                        xs: '20px',
                        md: '30px'
                    }
                }}>
                    <Grid size={{xs: 6, sm: 6, md: 6, lg: 3}}> {/* 2 cards per row on mobile */}
                        <Card sx={{
                            borderRadius: {
                                xs: '12px',
                                md: '16px'
                            },
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
                            color: 'white',
                            height: '100%'
                        }}>
                            <CardContent sx={{
                                padding: {
                                    xs: '16px',
                                    md: '24px'
                                }
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: {
                                        xs: 1,
                                        md: 2
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
                                    <AccountCircle sx={{
                                        fontSize: {
                                            xs: '24px',
                                            md: '32px'
                                        },
                                        opacity: 0.9
                                    }} />
                                    <Box>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 600,
                                            fontSize: {
                                                xs: '0.9rem',
                                                md: '1.25rem'
                                            }
                                        }}>
                                            Name
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            opacity: 0.9,
                                            fontSize: {
                                                xs: '0.75rem',
                                                md: '0.875rem'
                                            },
                                            wordBreak: 'break-word'
                                        }}>
                                            {user?.username || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 6, sm: 6, md: 6, lg: 3}}>
                        <Card sx={{
                            borderRadius: {
                                xs: '12px',
                                md: '16px'
                            },
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                            color: 'white',
                            height: '100%'
                        }}>
                            <CardContent sx={{
                                padding: {
                                    xs: '16px',
                                    md: '24px'
                                }
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: {
                                        xs: 1,
                                        md: 2
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
                                    <Person sx={{
                                        fontSize: {
                                            xs: '24px',
                                            md: '32px'
                                        },
                                        opacity: 0.9
                                    }} />
                                    <Box>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 600,
                                            fontSize: {
                                                xs: '0.9rem',
                                                md: '1.25rem'
                                            }
                                        }}>
                                            Login ID
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            opacity: 0.9,
                                            fontSize: {
                                                xs: '0.75rem',
                                                md: '0.875rem'
                                            },
                                            wordBreak: 'break-word'
                                        }}>
                                            @{loginData?.username || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 6, sm: 6, md: 6, lg: 3}}>
                        <Card sx={{
                            borderRadius: {
                                xs: '12px',
                                md: '16px'
                            },
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            height: '100%'
                        }}>
                            <CardContent sx={{
                                padding: {
                                    xs: '16px',
                                    md: '24px'
                                }
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: {
                                        xs: 1,
                                        md: 2
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
                                    <Person sx={{
                                        fontSize: {
                                            xs: '24px',
                                            md: '32px'
                                        },
                                        color: ProfileUtils.getUserTypeColor(user?.userType)
                                    }} />
                                    <Box>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 600,
                                            color: '#2c3e50',
                                            fontSize: {
                                                xs: '0.9rem',
                                                md: '1.25rem'
                                            }
                                        }}>
                                            User ID
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: '#7f8c8d',
                                            fontSize: {
                                                xs: '0.75rem',
                                                md: '0.875rem'
                                            },
                                            wordBreak: 'break-all'
                                        }}>
                                            {user?.userId || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 6, sm: 6, md: 6, lg: 3}}>
                        <Card sx={{
                            borderRadius: {
                                xs: '12px',
                                md: '16px'
                            },
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            height: '100%'
                        }}>
                            <CardContent sx={{
                                padding: {
                                    xs: '16px',
                                    md: '24px'
                                }
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: {
                                        xs: 1,
                                        md: 2
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
                                    <AccessTime sx={{
                                        fontSize: {
                                            xs: '24px',
                                            md: '32px'
                                        },
                                        color: '#27ae60'
                                    }} />
                                    <Box>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 600,
                                            color: '#2c3e50',
                                            fontSize: {
                                                xs: '0.9rem',
                                                md: '1.25rem'
                                            }
                                        }}>
                                            Session Expires
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: '#7f8c8d',
                                            fontSize: {
                                                xs: '0.75rem',
                                                md: '0.875rem'
                                            }
                                        }}>
                                            {ProfileUtils.getTimeUntilExpiry(user?.expiresIn, user?.timeStamp)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, sm: 6, md: 6, lg: 12}}> {/* Full width on mobile for security status */}
                        <Card sx={{
                            borderRadius: {
                                xs: '12px',
                                md: '16px'
                            },
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            display: {
                                lg: 'none'
                            }
                        }}>
                            <CardContent sx={{
                                padding: {
                                    xs: '16px',
                                    md: '24px'
                                }
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    justifyContent: 'center'
                                }}>
                                    <Shield sx={{
                                        fontSize: {
                                            xs: '24px',
                                            md: '32px'
                                        },
                                        color: '#dc3545'
                                    }} />
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 600,
                                            color: '#2c3e50',
                                            fontSize: {
                                                xs: '0.9rem',
                                                md: '1.25rem'
                                            }
                                        }}>
                                            Security Status
                                        </Typography>
                                        <Chip
                                            label="Protected"
                                            size="small"
                                            sx={{
                                                backgroundColor: '#d4edda',
                                                color: '#155724',
                                                fontWeight: 600,
                                                fontSize: {
                                                    xs: '0.7rem',
                                                    md: '0.75rem'
                                                }
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Change Password Section */}
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
                            Change Password
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
                            Update your password to keep your account secure
                        </Typography>
                    </Box>

                    <Formik
                        initialValues={{
                            oldPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, handleChange, errors, touched }) => (
                            <Form>
                                {/* Password Security Section */}
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
                                        <Lock sx={{ color: '#dc3545' }} />
                                        Password Security
                                    </Typography>

                                    <Grid container spacing={{
                                        xs: 2,
                                        md: 3
                                    }}>
                                        <Grid size={{xs: 12}}>
                                            <StyledTextField
                                                fullWidth
                                                label="Current Password"
                                                name="oldPassword"
                                                type={showOldPassword ? 'text' : 'password'}
                                                value={values.oldPassword}
                                                onChange={handleChange}
                                                error={Boolean((touched.oldPassword || values.oldPassword) && errors.oldPassword)}
                                                helperText={(touched.oldPassword || values.oldPassword) && errors.oldPassword}
                                                variant="outlined"
                                                placeholder="Enter your current password"
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
                                                            <Key sx={{
                                                                color: '#dc3545',
                                                                fontSize: {
                                                                    xs: '18px',
                                                                    md: '20px'
                                                                }
                                                            }} />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowOldPassword(!showOldPassword)}
                                                                edge="end"
                                                                size={isMobile ? "small" : "medium"}
                                                            >
                                                                {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid size={{xs: 12, sm: 6}}>
                                            <StyledTextField
                                                fullWidth
                                                label="New Password"
                                                name="newPassword"
                                                type={showNewPassword ? 'text' : 'password'}
                                                value={values.newPassword}
                                                onChange={handleChange}
                                                error={Boolean((touched.newPassword || values.newPassword) && errors.newPassword)}
                                                helperText={(touched.newPassword || values.newPassword) && errors.newPassword}
                                                variant="outlined"
                                                placeholder="Enter your new password"
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
                                                            boxShadow: '0 2px 8px rgba (0, 0, 0, 0.1)',
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
                                                            <VpnKey sx={{
                                                                color: '#28a745',
                                                                fontSize: {
                                                                    xs: '18px',
                                                                    md: '20px'
                                                                }
                                                            }} />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                                edge="end"
                                                                size={isMobile ? "small" : "medium"}
                                                            >
                                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid size={{xs: 12, sm: 6}}>
                                            <StyledTextField
                                                fullWidth
                                                label="Confirm New Password"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={values.confirmPassword}
                                                onChange={handleChange}
                                                error={Boolean((touched.confirmPassword || values.confirmPassword) && errors.confirmPassword)}
                                                helperText={(touched.confirmPassword || values.confirmPassword) && errors.confirmPassword}
                                                variant="outlined"
                                                placeholder="Confirm your new password"
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
                                                            <Lock sx={{
                                                                color: '#6610f2',
                                                                fontSize: {
                                                                    xs: '18px',
                                                                    md: '20px'
                                                                }
                                                            }} />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                edge="end"
                                                                size={isMobile ? "small" : "medium"}
                                                            >
                                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Password Requirements */}
                                <Box sx={{
                                    marginBottom: {
                                        xs: '24px',
                                        md: '40px'
                                    },
                                    padding: {
                                        xs: '16px',
                                        md: '24px'
                                    },
                                    background: 'linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%)',
                                    borderRadius: {
                                        xs: '12px',
                                        md: '16px'
                                    },
                                    border: '1px solid #ffeaa7',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: 'linear-gradient(90deg, #f39c12 0%, #e67e22 100%)'
                                    }
                                }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 700,
                                        color: '#8a6d3b',
                                        marginBottom: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        fontSize: {
                                            xs: '1rem',
                                            md: '1.25rem'
                                        },
                                        justifyContent: {
                                            xs: 'center',
                                            sm: 'flex-start'
                                        }
                                    }}>
                                        <Security sx={{ fontSize: '20px' }} />
                                        Password Requirements
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: '#8a6d3b',
                                        lineHeight: 1.6,
                                        fontSize: {
                                            xs: '0.8rem',
                                            md: '0.875rem'
                                        },
                                        textAlign: {
                                            xs: 'left',
                                            sm: 'left'
                                        }
                                    }}>
                                        • At least 8 characters long<br />
                                        • Contains at least one uppercase letter (A-Z)<br />
                                        • Contains at least one lowercase letter (a-z)<br />
                                        • Contains at least one number (0-9)<br />
                                        • Contains at least one special character (@$!%*?.&)
                                    </Typography>
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
                                            navigate('/dashboard');
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
                                        disabled={isSubmitting || isLoggingOut}
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
                                        {isSubmitting ? 'Updating Password...' : 'Update Password'}
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Paper>

                {/* Security Notice */}
                <Alert
                    severity="warning"
                    sx={{
                        marginTop: '20px',
                        borderRadius: {
                            xs: '8px',
                            md: '12px'
                        },
                        border: '1px solid rgba(255, 193, 7, 0.2)',
                        backgroundColor: 'rgba(255, 193, 7, 0.04)',
                        '& .MuiAlert-icon': {
                            fontSize: {
                                xs: '20px',
                                md: '24px'
                            },
                            color: '#f57c00'
                        },
                        '& .MuiAlert-message': {
                            padding: '8px 0'
                        }
                    }}
                >
                    <Typography variant="body2" sx={{
                        fontWeight: 500,
                        color: '#e65100',
                        fontSize: {
                            xs: '0.8rem',
                            md: '0.875rem'
                        },
                        lineHeight: 1.5
                    }}>
                        <strong>Security Notice:</strong> After changing your password, you may need to log in again.
                        Make sure to use a strong, unique password that you haven't used elsewhere.
                        If you experience any issues, please contact support immediately.
                    </Typography>
                </Alert>
            </Box>
        </Box>
    );
};

export default AccountSettings;