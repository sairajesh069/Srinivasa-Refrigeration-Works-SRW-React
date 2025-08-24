import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Avatar, Chip, Divider, Button,
    IconButton, Tooltip, Alert, CircularProgress } from '@mui/material';
import { Person, Edit, Email, Phone, Home, Badge, CalendarToday, Work, AccountBalance, Visibility,
    Security, CheckCircle, Cancel, Male, Female, Transgender } from '@mui/icons-material';
import useAuth from '../utils/useAuth.jsx';
import {useCustomerProfileQuery, useEmployeeProfileQuery, useOwnerProfileQuery} from "../reducers/fetchProfileApi.js";

const UserProfile = () => {
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState('view');
    const userId = user.userId;
    const userType = user.userType;

    const profileLoader = () => (
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
                Fetching {user.username}'s details...
            </Typography>
        </Box>
    );

    const hooks = {
        CUSTOMER: useCustomerProfileQuery,
        OWNER: useOwnerProfileQuery,
        EMPLOYEE: useEmployeeProfileQuery
    };

    const useProfileQuery = hooks[userType];
    const { data: profile, isLoading } = useProfileQuery(userId);

    if (isLoading) {
        profileLoader();
    }

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

    const formatDate = dateString => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = dateString => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatSalary = amount => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const getUserTypeColor = userType => {
        switch (userType?.toUpperCase()) {
            case 'CUSTOMER':
                return { color: '#4fc3f7', bgColor: '#e3f2fd' };
            case 'OWNER':
                return { color: '#f44336', bgColor: '#ffebee' };
            case 'EMPLOYEE':
                return { color: '#ff9800', bgColor: '#fff3e0' };
            default:
                return { color: '#9e9e9e', bgColor: '#f5f5f5' };
        }
    };

    const getStatusColor = status => {
        return status?.toLowerCase() === 'active'
            ? { color: '#4caf50', bgColor: '#e8f5e8', icon: <CheckCircle /> }
            : { color: '#f44336', bgColor: '#ffebee', icon: <Cancel /> };
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

    const userTypeColors = getUserTypeColor(userType);
    const statusColors = getStatusColor(userData.userStatus);

    const InfoCard = ({ icon, label, value, fullWidth = false }) => (
        <Grid xs={12} sm={fullWidth ? 12 : 6} md={fullWidth ? 12 : 4}>
            <Paper sx={{
                p: 2.5,
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                transition: 'all 0.2s ease',
                '&:hover': {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)'
                }
            }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{
                        p: 1,
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{
                            color: '#6c757d',
                            fontWeight: 500,
                            marginBottom: '4px',
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            letterSpacing: '0.5px'
                        }}>
                            {label}
                        </Typography>
                        <Typography variant="body1" sx={{
                            color: '#2c3e50',
                            fontWeight: 600,
                            wordBreak: 'break-word'
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
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            padding: '100px 20px 20px',
        }}>
            <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header Section */}
                <Paper sx={{
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    marginBottom: '30px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                    <Box sx={{ p: 4, color: 'white', position: 'relative' }}>
                        <Box sx={{
                            position: 'absolute',
                            top: 20,
                            right: 20,
                            display: 'flex',
                            gap: 1
                        }}>
                            <Tooltip title="View Mode">
                                <IconButton
                                    sx={{
                                        color: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
                                    }}
                                    onClick={() => setViewMode('view')}
                                >
                                    <Visibility />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Profile">
                                <IconButton
                                    sx={{
                                        color: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
                                    }}
                                    onClick={() => setViewMode('edit')}
                                >
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Avatar sx={{
                                width: 100,
                                height: 100,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                fontSize: '2.5rem',
                                fontWeight: 700,
                                border: '4px solid rgba(255, 255, 255, 0.3)'
                            }}>
                                {userData.firstName?.[0]}{userData.lastName?.[0]}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h3" sx={{
                                    fontWeight: 800,
                                    marginBottom: '8px',
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                }}>
                                    {userData.firstName} {userData.lastName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '16px' }}>
                                    <Chip
                                        label={userData.userType}
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            fontWeight: 600,
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    />
                                    <Chip
                                        icon={statusColors.icon}
                                        label={userData.userStatus.toUpperCase()}
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            fontWeight: 600,
                                            backdropFilter: 'blur(10px)',
                                            '& .MuiChip-icon': { color: 'white' }
                                        }}
                                    />
                                </Box>
                                <Typography variant="body1" sx={{
                                    opacity: 0.9,
                                    fontSize: '1.1rem'
                                }}>
                                    User ID: {userData.userId}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Profile Information */}
                <Paper sx={{
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    p: 4
                }}>
                    <Typography variant="h4" sx={{
                        fontWeight: 700,
                        marginBottom: '8px',
                        color: '#2c3e50'
                    }}>
                        Profile Information
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: '#6c757d',
                        marginBottom: '32px'
                    }}>
                        Personal details and account information
                    </Typography>

                    {/* Basic Information - Common for all users */}
                    <Box sx={{ marginBottom: '40px' }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            marginBottom: '20px',
                            color: '#495057',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Person sx={{ color: '#4fc3f7' }} />
                            Basic Information
                        </Typography>
                        <Grid container spacing={3}>
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
                    <Box sx={{ marginBottom: '40px' }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            marginBottom: '20px',
                            color: '#495057',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Phone sx={{ color: '#28a745' }} />
                            Contact Information
                        </Typography>
                        <Grid container spacing={3}>
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
                        <Box sx={{ marginBottom: '40px' }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                marginBottom: '20px',
                                color: '#495057',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Security sx={{ color: '#6610f2' }} />
                                Personal Details
                            </Typography>
                            <Grid container spacing={3}>
                                <InfoCard
                                    icon={<CalendarToday sx={{ color: '#20c997' }} />}
                                    label="Date of Birth"
                                    value={formatDate(userData.dateOfBirth)}
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
                        <Box sx={{ marginBottom: '40px' }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                marginBottom: '20px',
                                color: '#495057',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Work sx={{ color: '#ff6b35' }} />
                                Employment Details
                            </Typography>
                            <Grid container spacing={3}>
                                <InfoCard
                                    icon={<CalendarToday sx={{ color: '#28a745' }} />}
                                    label="Date of Hire"
                                    value={formatDate(userData.dateOfHire)}
                                />
                                <InfoCard
                                    icon={<Work sx={{ color: '#ff6b35' }} />}
                                    label="Designation"
                                    value={userData.designation}
                                />
                                <InfoCard
                                    icon={<AccountBalance sx={{ color: '#ffc107' }} />}
                                    label="Salary"
                                    value={formatSalary(userData.salary)}
                                />
                                <InfoCard
                                    icon={<CalendarToday sx={{ color: userData.dateOfExit ? '#dc3545' : '#6c757d' }} />}
                                    label="Date of Exit"
                                    value={userData.dateOfExit ? formatDate(userData.dateOfExit) : 'Currently Active'}
                                />
                            </Grid>
                        </Box>
                    )}

                    {/* System Information */}
                    <Box>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            marginBottom: '20px',
                            color: '#495057',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <CalendarToday sx={{ color: '#6c757d' }} />
                            System Information
                        </Typography>
                        <Grid container spacing={3}>
                            <InfoCard
                                icon={<CalendarToday sx={{ color: '#17a2b8' }} />}
                                label={userData.userType === 'EMPLOYEE' ? 'Date Joined' : 'Account Created'}
                                value={userData.userType === 'EMPLOYEE' ? formatDateTime(userData.dateOfHire) : formatDateTime(userData.createdAt)}
                            />
                            <InfoCard
                                icon={<CalendarToday sx={{ color: '#6c757d' }} />}
                                label="Last Updated"
                                value={formatDateTime(userData.updatedAt)}
                            />
                        </Grid>
                    </Box>

                    {/* Action Buttons */}
                    <Divider sx={{ my: 4 }} />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            startIcon={<Edit />}
                            sx={{
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Edit Profile
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Paper>

                {/* Security Alert */}
                <Alert
                    severity="info"
                    sx={{
                        marginTop: '20px',
                        borderRadius: '12px',
                        '& .MuiAlert-icon': {
                            fontSize: '24px'
                        }
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        <strong>Privacy Notice:</strong> Your personal information is protected and encrypted.
                        Only authorized personnel can view sensitive details based on your user type.
                    </Typography>
                </Alert>
            </Box>
        </Box>
    );
};

export default UserProfile;