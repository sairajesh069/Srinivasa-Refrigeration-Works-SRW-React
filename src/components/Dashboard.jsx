import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip, Avatar, Button } from '@mui/material';
import { Dashboard as DashboardIcon, Person, Security, AccessTime, AccountBox, Edit, Report, List,
    TrackChanges, Feedback, Settings, Notifications, ArrowForward } from '@mui/icons-material';
import useAuth from '../utils/useAuth.jsx';
import {useNavigate} from "react-router-dom";
import ProfileUtils from "../utils/ProfileUtils.jsx";

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const accountActions = [
        {
            id: 'profile',
            title: 'View Profile',
            description: 'View your account details and information',
            path: '/profile',
            icon: <AccountBox />,
            color: '#4fc3f7',
            bgColor: '#e3f2fd'
        },
        {
            id: 'update-profile',
            title: 'Update Profile',
            description: 'Edit your personal information and preferences',
            path: '/update-profile',
            icon: <Edit />,
            color: '#66bb6a',
            bgColor: '#e8f5e8'
        },
        {
            id: 'register-complaint',
            title: 'Register Complaint',
            description: 'Submit a new complaint or report an issue',
            icon: <Report />,
            color: '#ff7043',
            bgColor: '#fbe9e7'
        },
        {
            id: 'all-complaints',
            title: 'All Complaints',
            description: 'View all your submitted complaints',
            icon: <List />,
            color: '#ab47bc',
            bgColor: '#f3e5f5'
        },
        {
            id: 'track-complaint',
            title: 'Track Status',
            description: 'Track the progress of your complaints',
            icon: <TrackChanges />,
            color: '#29b6f6',
            bgColor: '#e1f5fe'
        },
        {
            id: 'give-feedback',
            title: 'Give Feedback',
            description: 'Provide feedback on resolved complaints',
            icon: <Feedback />,
            color: '#ffa726',
            bgColor: '#fff3e0'
        },
        {
            id: 'notifications',
            title: 'Notifications',
            description: 'Manage your notification preferences',
            icon: <Notifications />,
            color: '#ef5350',
            bgColor: '#ffebee'
        },
        {
            id: 'account-settings',
            title: 'Account Settings',
            description: 'Manage security and account preferences',
            path: '/account-settings',
            icon: <Settings />,
            color: '#78909c',
            bgColor: '#eceff1'
        }
    ];

    const handleActionClick = actionId => {
        const action = accountActions.find(a => a.id === actionId);
        if (action?.path) {
            navigate(action.path);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            padding: '100px 20px 20px',
        }}>
            <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '40px',
                    gap: 2
                }}>
                    <Avatar sx={{
                        backgroundColor: '#4fc3f7',
                        width: 64,
                        height: 64,
                        boxShadow: '0 8px 24px rgba(79, 195, 247, 0.3)'
                    }}>
                        <DashboardIcon sx={{ fontSize: '32px' }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h3" sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #2c3e50 0%, #4a6741 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '8px',
                            letterSpacing: '-0.02em'
                        }}>
                            Dashboard
                        </Typography>
                        <Typography variant="h6" sx={{
                            color: '#7f8c8d',
                            fontWeight: 400,
                            opacity: 0.8
                        }}>
                            Welcome back, {user?.username || 'User'}!
                        </Typography>
                    </Box>
                </Box>

                {/* User Info Cards */}
                <Grid container spacing={3} sx={{ marginBottom: '40px' }}>
                    <Grid item xs={12} md={6} lg={3}>
                        <Card sx={{
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
                            color: 'white'
                        }}>
                            <CardContent sx={{ padding: '24px' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Person sx={{ fontSize: '32px', opacity: 0.9 }} />
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            User ID
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            {user?.userId || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <Card sx={{
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            <CardContent sx={{ padding: '24px' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Security sx={{ fontSize: '32px', color: ProfileUtils.getUserTypeColor(user?.userType) }} />
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                            User Type
                                        </Typography>
                                        <Chip
                                            label={user?.userType || 'N/A'}
                                            size="small"
                                            sx={{
                                                backgroundColor: `${ProfileUtils.getUserTypeColor(user?.userType)}15`,
                                                color: ProfileUtils.getUserTypeColor(user?.userType),
                                                fontWeight: 600
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <Card sx={{
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            <CardContent sx={{ padding: '24px' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <AccessTime sx={{ fontSize: '32px', color: '#27ae60' }} />
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                            Session Expires
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                            {ProfileUtils.getTimeUntilExpiry(user?.expiresIn, user?.timeStamp)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6} lg={3}>
                        <Card sx={{
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            <CardContent sx={{ padding: '24px' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <AccessTime sx={{ fontSize: '32px', color: '#f39c12' }} />
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                            Last Login
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                            {ProfileUtils.formatDate(user?.timeStamp)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Account Overview Section */}
                <Paper sx={{
                    borderRadius: '20px',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '40px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                }}>
                    <Box sx={{
                        textAlign: 'center',
                        marginBottom: '40px',
                        position: 'relative'
                    }}>
                        <Typography variant="h4" sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '12px',
                            letterSpacing: '-0.02em'
                        }}>
                            Account Overview
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
                            margin: '0 auto'
                        }}>
                            Access all your account features and manage your complaints efficiently
                        </Typography>
                    </Box>

                    {/* Action Cards Grid */}
                    <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                        {accountActions.map((action) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={action.id}>
                                <Card sx={{
                                    borderRadius: '16px',
                                    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15)',
                                        borderColor: action.color,
                                        '& .action-icon': {
                                            transform: 'scale(1.1)',
                                            backgroundColor: action.color,
                                            '& svg': {
                                                color: 'white'
                                            }
                                        }
                                    }
                                }} onClick={() => handleActionClick(action.id)}>
                                    <CardContent sx={{
                                        padding: '24px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center'
                                    }}>
                                        <Box sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: '16px',
                                            backgroundColor: action.bgColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '20px',
                                            transition: 'all 0.3s ease'
                                        }} className="action-icon">
                                            {React.cloneElement(action.icon, {
                                                sx: {
                                                    fontSize: '28px',
                                                    color: action.color,
                                                    transition: 'color 0.3s ease'
                                                }
                                            })}
                                        </Box>

                                        <Typography variant="h6" sx={{
                                            fontWeight: 700,
                                            color: '#2c3e50',
                                            marginBottom: '12px',
                                            lineHeight: 1.2
                                        }}>
                                            {action.title}
                                        </Typography>

                                        <Typography variant="body2" sx={{
                                            color: '#7f8c8d',
                                            lineHeight: 1.5,
                                            marginBottom: '20px'
                                        }}>
                                            {action.description}
                                        </Typography>

                                        <Button
                                            variant="text"
                                            endIcon={<ArrowForward sx={{ fontSize: '18px' }} />}
                                            sx={{
                                                color: action.color,
                                                fontWeight: 600,
                                                padding: '10px 16px',
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                fontSize: '14px',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: `${action.color}10`,
                                                    '& .MuiButton-endIcon': {
                                                        transform: 'translateX(4px)'
                                                    }
                                                },
                                                '& .MuiButton-endIcon': {
                                                    transition: 'transform 0.2s ease'
                                                }
                                            }}
                                        >
                                            Access
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Security Notice */}
                    <Box sx={{
                        marginTop: '40px',
                        padding: '24px',
                        background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
                        borderRadius: '16px',
                        border: '1px solid #c8e6c9',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)'
                        }
                    }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 700,
                            color: '#2e7d32',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Security sx={{ fontSize: '20px' }} />
                            Security Notice
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: '#388e3c',
                            lineHeight: 1.6
                        }}>
                            Your account is secured with login protection.
                            If you’re on a shared computer, remember to log out. For any security issues,
                            please contact our support team right away.
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Dashboard;