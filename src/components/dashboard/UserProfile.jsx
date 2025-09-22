import React from 'react';
import { Box, Typography, Paper, Grid, Avatar, Chip, IconButton, Tooltip, Alert, useTheme, useMediaQuery } from '@mui/material';
import { Person, Edit, Email, Phone, Home, Badge, CalendarToday, Work, AccountBalance,
    Dashboard, Security, Male, Female, Transgender } from '@mui/icons-material';
import useAuth from '../../utils/useAuth.jsx';
import ProfileUtils from "../../utils/ProfileUtils.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import Unauthorized from "../exceptions/Unauthorized.jsx";

const UserProfile = () => {
    const { user, isLoggingOut } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const paramUserId = queryParams.get("userId");
    const paramUserType = paramUserId.endsWith("OWNR") ? "OWNER"
        : paramUserId.endsWith("EMPL") ? "EMPLOYEE"
            : paramUserId.endsWith("CUST") ? "CUSTOMER"
                : '';

    const userId = paramUserId ? paramUserId : user?.userId;
    const userType = paramUserType ? paramUserType : user?.userType;

    const shouldFetch = userId && userType && location.pathname === "/profile" && !isLoggingOut;

    const { data: profile, isLoading: isFetchProfileLoading, isError: isFetchProfileError,
        error: fetchProfileError } = ProfileUtils.getActiveUserProfileQuery(userId, userType, shouldFetch);

    const userData = {
        userId: userId || 'N/A',
        userType: userType || 'USER',
        firstName: profile?.userDTO?.firstName || 'User',
        lastName: profile?.userDTO?.lastName || 'N/A',
        gender: profile?.userDTO?.gender || 'Other',
        phoneNumber: profile?.userDTO?.phoneNumber || 'N/A',
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

    const statusColors = ProfileUtils.getStatusColor(userData.userStatus);

    if (isFetchProfileLoading) {
        ProfileUtils.profileLoader(`Fetching ${user?.username}'s details...`);
    }

    if(isFetchProfileError && fetchProfileError.status === 403) {
        return <Unauthorized />;
    }

    if (isFetchProfileError) {
        ProfileUtils.profileError(`Failed to ${user?.username}'s details. Please try again.`);
    }

    const InfoCard = ({ icon, label, value, fullWidth = false }) => (
        <Grid
            size={{
                xs: 12,
                sm: fullWidth ? 12 : 6,
                md: fullWidth ? 12 : 4,
            }}
        >
            <Paper sx={{
                p: { xs: 1.5, sm: 2, md: 2.5 },
                borderRadius: { xs: '8px', sm: '10px', md: '12px' },
                border: '1px solid rgba(0, 0, 0, 0.08)',
                transition: 'all 0.2s ease',
                '&:hover': {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    transform: { xs: 'none', md: 'translateY(-2px)' }
                }
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: { xs: 1, sm: 1.5, md: 2 }
                }}>
                    <Box sx={{
                        p: { xs: 0.5, sm: 0.75, md: 1 },
                        borderRadius: { xs: '6px', sm: '7px', md: '8px' },
                        backgroundColor: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: { xs: '32px', sm: '36px', md: '40px' },
                        height: { xs: '32px', sm: '36px', md: '40px' }
                    }}>
                        {React.cloneElement(icon, {
                            sx: {
                                ...icon.props.sx,
                                fontSize: { xs: '18px', sm: '20px', md: '24px' }
                            }
                        })}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{
                            color: '#6c757d',
                            fontWeight: 500,
                            marginBottom: '4px',
                            textTransform: 'uppercase',
                            fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                            letterSpacing: '0.5px'
                        }}>
                            {label}
                        </Typography>
                        <Typography variant="body1" sx={{
                            color: '#2c3e50',
                            fontWeight: 600,
                            wordBreak: 'break-word',
                            fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
                            lineHeight: { xs: '1.3', sm: '1.4', md: '1.5' }
                        }}>
                            {value}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Grid>
    );

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
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%'
            }}>
                {/* Header Section */}
                <Paper sx={{
                    borderRadius: { xs: '12px', sm: '16px', md: '20px' },
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    marginBottom: { xs: '20px', sm: '25px', md: '30px' },
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                    <Box sx={{
                        p: { xs: 2, sm: 3, md: 4 },
                        color: 'white',
                        position: 'relative'
                    }}>
                        {/* Action Buttons */}
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
                                    onClick={() => {
                                        navigate('/dashboard');
                                    }}
                                >
                                    <Dashboard sx={{ fontSize: { xs: '18px', sm: '20px', md: '24px' } }} />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Edit Profile">
                                <IconButton
                                    size={isMobile ? 'small' : 'medium'}
                                    sx={{
                                        color: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                                        width: { xs: '36px', sm: '40px', md: '48px' },
                                        height: { xs: '36px', sm: '40px', md: '48px' }
                                    }}
                                    onClick={() => {
                                        navigate(`/update-profile?userId=${userId}&userType=${userType}`);
                                    }}
                                >
                                    <Edit sx={{ fontSize: { xs: '18px', sm: '20px', md: '24px' } }} />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {/* Profile Header Content */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 2, sm: 2.5, md: 3 },
                            marginTop: { xs: 2, sm: 0 },
                            textAlign: { xs: 'center', sm: 'left' }
                        }}>
                            <Avatar sx={{
                                width: { xs: 70, sm: 80, md: 100 },
                                height: { xs: 70, sm: 80, md: 100 },
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                                fontWeight: 700,
                                border: '4px solid rgba(255, 255, 255, 0.3)',
                                alignSelf: { xs: 'center', sm: 'flex-start' }
                            }}>
                                {userData.firstName?.[0]}{userData.lastName?.[0]}
                            </Avatar>

                            <Box sx={{
                                flex: 1,
                                textAlign: { xs: 'center', sm: 'left' },
                                marginRight: { xs: 0, sm: '80px' }
                            }}>
                                <Typography variant={isSmallMobile ? 'h5' : isMobile ? 'h4' : 'h3'} sx={{
                                    fontWeight: 800,
                                    marginBottom: '8px',
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                                    lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
                                    wordBreak: 'break-word'
                                }}>
                                    {userData.firstName} {userData.lastName}
                                </Typography>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: { xs: 1, sm: 1.5, md: 2 },
                                    marginBottom: '16px',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    justifyContent: { xs: 'center', sm: 'flex-start' }
                                }}>
                                    <Chip
                                        label={userData.userType}
                                        size={isMobile ? 'small' : 'medium'}
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            fontWeight: 600,
                                            backdropFilter: 'blur(10px)',
                                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8125rem' }
                                        }}
                                    />
                                    <Chip
                                        icon={statusColors.icon}
                                        label={userData.userStatus.toUpperCase()}
                                        size={isMobile ? 'small' : 'medium'}
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            fontWeight: 600,
                                            backdropFilter: 'blur(10px)',
                                            '& .MuiChip-icon': { color: 'white' },
                                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8125rem' }
                                        }}
                                    />
                                </Box>

                                <Typography variant="body1" sx={{
                                    opacity: 0.9,
                                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                    wordBreak: 'break-all'
                                }}>
                                    User ID: {userData.userId}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Profile Information */}
                <Paper sx={{
                    borderRadius: { xs: '12px', sm: '16px', md: '20px' },
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    p: { xs: 2, sm: 3, md: 4 }
                }}>
                    {/* Section Title */}
                    <Box sx={{
                        textAlign: 'center',
                        marginBottom: { xs: '25px', sm: '32px', md: '40px' },
                        position: 'relative'
                    }}>
                        <Typography variant={isSmallMobile ? 'h5' : isMobile ? 'h4' : 'h4'} sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '12px',
                            letterSpacing: '-0.02em',
                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
                        }}>
                            Profile Information
                        </Typography>
                        <Box sx={{
                            width: { xs: '40px', sm: '50px', md: '60px' },
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
                            fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
                            px: { xs: 1, sm: 0 }
                        }}>
                            Personal details and account information
                        </Typography>
                    </Box>

                    {/* Basic Information - Common for all users */}
                    <Box sx={{ marginBottom: { xs: '25px', sm: '32px', md: '40px' } }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            marginBottom: { xs: '15px', sm: '18px', md: '20px' },
                            color: '#495057',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                        }}>
                            <Person sx={{
                                color: '#4fc3f7',
                                fontSize: { xs: '18px', sm: '20px', md: '24px' }
                            }} />
                            Basic Information
                        </Typography>
                        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                            <InfoCard
                                icon={<Badge sx={{ color: '#6f42c1' }} />}
                                label="First Name"
                                value={userData.firstName}
                            />
                            <InfoCard
                                icon={<Badge sx={{ color: '#6f42c1' }} />}
                                label="Last Name"
                                value={userData.lastName}
                            />
                            <InfoCard
                                icon={getGenderIcon(userData.gender)}
                                label="Gender"
                                value={userData.gender}
                            />
                        </Grid>
                    </Box>

                    {/* Contact Information */}
                    <Box sx={{ marginBottom: { xs: '25px', sm: '32px', md: '40px' } }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            marginBottom: { xs: '15px', sm: '18px', md: '20px' },
                            color: '#495057',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                        }}>
                            <Phone sx={{
                                color: '#28a745',
                                fontSize: { xs: '18px', sm: '20px', md: '24px' }
                            }} />
                            Contact Information
                        </Typography>
                        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                            <InfoCard
                                icon={<Phone sx={{ color: '#28a745' }} />}
                                label="Phone Number"
                                value={userData.phoneNumber}
                            />
                            <InfoCard
                                icon={<Email sx={{ color: '#dc3545' }} />}
                                label="Email Address"
                                value={userData.email}
                            />
                            <InfoCard
                                icon={<Home sx={{ color: '#fd7e14' }} />}
                                label="Address"
                                value={userData.address}
                                fullWidth={true}
                            />
                        </Grid>
                    </Box>

                    {/* Additional Information for Owner and Employee */}
                    {(userData.userType === 'OWNER' || userData.userType === 'EMPLOYEE') && (
                        <Box sx={{ marginBottom: { xs: '25px', sm: '32px', md: '40px' } }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                marginBottom: { xs: '15px', sm: '18px', md: '20px' },
                                color: '#495057',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                            }}>
                                <Security sx={{
                                    color: '#6610f2',
                                    fontSize: { xs: '18px', sm: '20px', md: '24px' }
                                }} />
                                Personal Details
                            </Typography>
                            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                                <InfoCard
                                    icon={<CalendarToday sx={{ color: '#20c997' }} />}
                                    label="Date of Birth"
                                    value={ProfileUtils.formatDate(userData.dateOfBirth)}
                                />
                                <InfoCard
                                    icon={<Badge sx={{ color: '#6610f2' }} />}
                                    label="National ID"
                                    value={userData.nationalIdNumber}
                                />
                            </Grid>
                        </Box>
                    )}

                    {/* Employee-specific Information */}
                    {userData.userType === 'EMPLOYEE' && (
                        <Box sx={{ marginBottom: { xs: '25px', sm: '32px', md: '40px' } }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                marginBottom: { xs: '15px', sm: '18px', md: '20px' },
                                color: '#495057',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                            }}>
                                <Work sx={{
                                    color: '#ff6b35',
                                    fontSize: { xs: '18px', sm: '20px', md: '24px' }
                                }} />
                                Employment Details
                            </Typography>
                            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                                <InfoCard
                                    icon={<CalendarToday sx={{ color: '#28a745' }} />}
                                    label="Date of Hire"
                                    value={ProfileUtils.formatDate(userData.dateOfHire)}
                                />
                                <InfoCard
                                    icon={<Work sx={{ color: '#ff6b35' }} />}
                                    label="Designation"
                                    value={userData.designation}
                                />
                                <InfoCard
                                    icon={<AccountBalance sx={{ color: '#ffc107' }} />}
                                    label="Salary"
                                    value={ProfileUtils.formatSalary(userData.salary)}
                                />
                                <InfoCard
                                    icon={<CalendarToday sx={{ color: userData.dateOfExit ? '#dc3545' : '#6c757d' }} />}
                                    label="Date of Exit"
                                    value={userData.dateOfExit ? ProfileUtils.formatDate(userData.dateOfExit) : 'Currently Active'}
                                />
                            </Grid>
                        </Box>
                    )}

                    {/* System Information */}
                    <Box>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            marginBottom: { xs: '15px', sm: '18px', md: '20px' },
                            color: '#495057',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                        }}>
                            <CalendarToday sx={{
                                color: '#6c757d',
                                fontSize: { xs: '18px', sm: '20px', md: '24px' }
                            }} />
                            System Information
                        </Typography>
                        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                            <InfoCard
                                icon={<CalendarToday sx={{ color: '#17a2b8' }} />}
                                label={userData.userType === 'EMPLOYEE' ? 'Date Joined' : 'Account Created'}
                                value={userData.userType === 'EMPLOYEE' ? ProfileUtils.formatDateTime(userData.dateOfHire) : ProfileUtils.formatDateTime(userData.createdAt)}
                            />
                            <InfoCard
                                icon={<CalendarToday sx={{ color: '#6c757d' }} />}
                                label="Last Updated"
                                value={ProfileUtils.formatDateTime(userData.updatedAt)}
                            />
                        </Grid>
                    </Box>
                </Paper>

                {/* Security Alert */}
                <Alert
                    severity="info"
                    sx={{
                        marginTop: { xs: '15px', sm: '18px', md: '20px' },
                        borderRadius: { xs: '8px', sm: '10px', md: '12px' },
                        '& .MuiAlert-icon': {
                            fontSize: { xs: '20px', sm: '22px', md: '24px' }
                        },
                        '& .MuiAlert-message': {
                            padding: { xs: '4px 0', sm: '6px 0', md: '8px 0' }
                        }
                    }}
                >
                    <Typography variant="body2" sx={{
                        fontWeight: 500,
                        fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.875rem' },
                        lineHeight: { xs: 1.4, sm: 1.43, md: 1.43 }
                    }}>
                        <strong>Privacy Notice:</strong> Your personal information is protected and encrypted.
                        Only authorized personnel can view sensitive details based on your user type.
                    </Typography>
                </Alert>
            </Box>
        </Box>
    );
};

export default UserProfile;