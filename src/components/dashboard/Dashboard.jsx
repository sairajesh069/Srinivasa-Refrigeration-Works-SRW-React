import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip, Avatar, Button } from '@mui/material';
import { Dashboard as DashboardIcon, Person, Security, AccessTime, AccountBox, Edit, List,
    TrackChanges, Feedback, Settings, Notifications, ArrowForward, Handyman } from '@mui/icons-material';
import useAuth from '../../utils/useAuth.jsx';
import {useNavigate} from "react-router-dom";
import ProfileUtils from "../../utils/ProfileUtils.jsx";

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
            path: '/complaint-register',
            icon: <Handyman />,
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
            padding: { xs: '80px 12px 12px', sm: '90px 16px 16px', md: '100px 20px 20px' },
        }}>
            <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: { xs: '24px', md: '40px' },
                    gap: { xs: 1.5, md: 2 },
                    flexDirection: { xs: 'column', sm: 'row' },
                    textAlign: { xs: 'center', sm: 'left' }
                }}>
                    <Avatar sx={{
                        backgroundColor: '#4fc3f7',
                        width: { xs: 48, md: 64 },
                        height: { xs: 48, md: 64 },
                        boxShadow: '0 8px 24px rgba(79, 195, 247, 0.3)'
                    }}>
                        <DashboardIcon sx={{ fontSize: { xs: '24px', md: '32px' } }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h3" sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #2c3e50 0%, #4a6741 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '8px',
                            letterSpacing: '-0.02em',
                            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
                        }}>
                            Dashboard
                        </Typography>
                        <Typography variant="h6" sx={{
                            color: '#7f8c8d',
                            fontWeight: 400,
                            opacity: 0.8,
                            fontSize: { xs: '1rem', md: '1.25rem' }
                        }}>
                            Welcome back, {user?.username || 'User'}!
                        </Typography>
                    </Box>
                </Box>

                {/* User Info Cards */}
                <Grid container spacing={{ xs: 2, md: 3 }} sx={{ marginBottom: { xs: '24px', md: '40px' } }}>
                    <Grid size={{xs:12, sm:6, md:6, lg:3}}>
                        <Card sx={{
                            borderRadius: { xs: '12px', md: '16px' },
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
                            color: 'white',
                            height: '100%'
                        }}>
                            <CardContent sx={{ padding: { xs: '16px', md: '24px' } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 } }}>
                                    <Person sx={{ fontSize: { xs: '24px', md: '32px' }, opacity: 0.9 }} />
                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 600,
                                            fontSize: { xs: '1rem', md: '1.25rem' }
                                        }}>
                                            User ID
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            opacity: 0.9,
                                            fontSize: { xs: '0.8rem', md: '0.875rem' },
                                            wordBreak: 'break-all'
                                        }}>
                                            {user?.userId || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs:12, sm:6, md:6, lg:3}}>
                        <Card sx={{
                            borderRadius: { xs: '12px', md: '16px' },
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            height: '100%'
                        }}>
                            <CardContent sx={{ padding: { xs: '16px', md: '24px' } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 } }}>
                                    <Security sx={{ fontSize: { xs: '24px', md: '32px' }, color: ProfileUtils.getUserTypeColor(user?.userType) }} />
                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 600,
                                            color: '#2c3e50',
                                            fontSize: { xs: '1rem', md: '1.25rem' }
                                        }}>
                                            User Type
                                        </Typography>
                                        <Chip
                                            label={user?.userType || 'N/A'}
                                            size="small"
                                            sx={{
                                                backgroundColor: `${ProfileUtils.getUserTypeColor(user?.userType)}15`,
                                                color: ProfileUtils.getUserTypeColor(user?.userType),
                                                fontWeight: 600,
                                                fontSize: { xs: '0.7rem', md: '0.75rem' },
                                                height: { xs: '20px', md: '24px' }
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs:12, sm:6, md:6, lg:3}}>
                        <Card sx={{
                            borderRadius: { xs: '12px', md: '16px' },
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            height: '100%'
                        }}>
                            <CardContent sx={{ padding: { xs: '16px', md: '24px' } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 } }}>
                                    <AccessTime sx={{ fontSize: { xs: '24px', md: '32px' }, color: '#27ae60' }} />
                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 600,
                                            color: '#2c3e50',
                                            fontSize: { xs: '1rem', md: '1.25rem' }
                                        }}>
                                            Session Expires
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: '#7f8c8d',
                                            fontSize: { xs: '0.8rem', md: '0.875rem' },
                                            wordBreak: 'break-word'
                                        }}>
                                            {ProfileUtils.getTimeUntilExpiry(user?.expiresIn, user?.timeStamp)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs:12, sm:6, md:6, lg:3}}>
                        <Card sx={{
                            borderRadius: { xs: '12px', md: '16px' },
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            height: '100%'
                        }}>
                            <CardContent sx={{ padding: { xs: '16px', md: '24px' } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 } }}>
                                    <AccessTime sx={{ fontSize: { xs: '24px', md: '32px' }, color: '#f39c12' }} />
                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 600,
                                            color: '#2c3e50',
                                            fontSize: { xs: '1rem', md: '1.25rem' }
                                        }}>
                                            Last Login
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: '#7f8c8d',
                                            fontSize: { xs: '0.8rem', md: '0.875rem' },
                                            wordBreak: 'break-word'
                                        }}>
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
                    borderRadius: { xs: '16px', md: '20px' },
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: { xs: '24px 16px', sm: '32px 24px', md: '40px' },
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                }}>
                    <Box sx={{
                        textAlign: 'center',
                        marginBottom: { xs: '24px', md: '40px' },
                        position: 'relative'
                    }}>
                        <Typography variant="h4" sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '12px',
                            letterSpacing: '-0.02em',
                            fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' }
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
                            margin: '0 auto',
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            px: { xs: 2, sm: 0 }
                        }}>
                            Access all your account features and manage your complaints efficiently
                        </Typography>
                    </Box>

                    {/* Action Cards Grid */}
                    <Grid container spacing={{ xs: 2, md: 3 }} sx={{ justifyContent: 'center' }}>
                        {accountActions.map((action) => (
                            <Grid size={{xs:12, sm:6, md:4, lg:3}} key={action.id}>
                                <Card sx={{
                                    borderRadius: { xs: '12px', md: '16px' },
                                    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
                                    height: '100%',
                                    '&:hover': {
                                        transform: { xs: 'translateY(-4px)', md: 'translateY(-8px)' },
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
                                        padding: { xs: '16px', md: '24px' },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center'
                                    }}>
                                        <Box sx={{
                                            width: { xs: 48, md: 56 },
                                            height: { xs: 48, md: 56 },
                                            borderRadius: { xs: '12px', md: '16px' },
                                            backgroundColor: action.bgColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: { xs: '16px', md: '20px' },
                                            transition: 'all 0.3s ease'
                                        }} className="action-icon">
                                            {React.cloneElement(action.icon, {
                                                sx: {
                                                    fontSize: { xs: '24px', md: '28px' },
                                                    color: action.color,
                                                    transition: 'color 0.3s ease'
                                                }
                                            })}
                                        </Box>

                                        <Typography variant="h6" sx={{
                                            fontWeight: 700,
                                            color: '#2c3e50',
                                            marginBottom: { xs: '8px', md: '12px' },
                                            lineHeight: 1.2,
                                            fontSize: { xs: '1rem', md: '1.25rem' },
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            {action.title}
                                        </Typography>

                                        <Typography variant="body2" sx={{
                                            color: '#7f8c8d',
                                            lineHeight: 1.5,
                                            marginBottom: { xs: '16px', md: '20px' },
                                            fontSize: { xs: '0.85rem', md: '0.875rem' },
                                            flex: 2,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            {action.description}
                                        </Typography>

                                        <Button
                                            variant="text"
                                            endIcon={<ArrowForward sx={{ fontSize: { xs: '16px', md: '18px' } }} />}
                                            sx={{
                                                color: action.color,
                                                fontWeight: 600,
                                                padding: { xs: '8px 12px', md: '10px 16px' },
                                                borderRadius: { xs: '8px', md: '12px' },
                                                textTransform: 'none',
                                                fontSize: { xs: '0.8rem', md: '14px' },
                                                transition: 'all 0.2s ease',
                                                minWidth: { xs: '80px', md: 'auto' },
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
                        marginTop: { xs: '24px', md: '40px' },
                        padding: { xs: '16px', md: '24px' },
                        background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
                        borderRadius: { xs: '12px', md: '16px' },
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
                            gap: 1,
                            fontSize: { xs: '1rem', md: '1.25rem' }
                        }}>
                            <Security sx={{ fontSize: { xs: '18px', md: '20px' } }} />
                            Security Notice
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: '#388e3c',
                            lineHeight: 1.6,
                            fontSize: { xs: '0.85rem', md: '0.875rem' }
                        }}>
                            Your account is secured with login protection.
                            If you're on a shared computer, remember to log out. For any security issues,
                            please contact our support team right away.
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default Dashboard;