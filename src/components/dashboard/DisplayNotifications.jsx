import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip, Avatar, Button, Alert, Divider, useTheme,
    useMediaQuery, InputAdornment, MenuItem, Badge, Tooltip, IconButton } from '@mui/material';
import { Notifications, FilterList, Search, CalendarToday, Dashboard, Info, Warning, Error as ErrorIcon,
    Build, ExpandMore, ExpandLess, NotificationImportant, PriorityHigh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StyledTextField from "../../utils/form-styling/StyledTextField.jsx";
import StyledMenuProps from "../../utils/form-styling/StyledSelectMenu.jsx";
import { useFetchMyNotificationsQuery } from "../../reducers/notificationApi.js";
import useAuth from "../../utils/useAuth.jsx";
import ProfileUtils from "../../utils/ProfileUtils.jsx";
import Unauthorized from "../exceptions/Unauthorized.jsx";

const DisplayNotifications = () => {
    const { user, isLoggingOut } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [expandedCards, setExpandedCards] = useState({});

    const userId = user?.userId;
    const userType = user?.userType;
    const isOwner = userType === 'OWNER';

    const { data, isLoading, isError, error } = useFetchMyNotificationsQuery(userId, {
        refetchOnMountOrArgChange: true,
        skip: !userId || isLoggingOut,
    });

    const notifications = data?.notifications || [];

    const toggleCardExpansion = notificationId => {
        setExpandedCards(prev => ({
            ...prev,
            [notificationId]: !prev[notificationId]
        }));
    };

    const getTypeColor = type => {
        switch (type?.toLowerCase()) {
            case 'info':
                return '#2196f3';
            case 'warning':
                return '#ff9800';
            case 'error':
                return '#f44336';
            case 'repair_update':
                return '#4caf50';
            default:
                return '#9e9e9e';
        }
    };

    const getTypeIcon = type => {
        switch (type?.toLowerCase()) {
            case 'info':
                return <Info />;
            case 'warning':
                return <Warning />;
            case 'error':
                return <ErrorIcon />;
            case 'repair_update':
                return <Build />;
            default:
                return <NotificationImportant />;
        }
    };

    const getTypeSeverity = type => {
        switch (type?.toLowerCase()) {
            case 'info':
                return 'info';
            case 'warning':
                return 'warning';
            case 'error':
                return 'error';
            case 'repair_update':
                return 'success';
            default:
                return 'info';
        }
    };

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

    const filteredNotifications = useMemo(() => {
        if (!notifications || !Array.isArray(notifications)) {
            return [];
        }
        return notifications.filter(notification => {
            const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (isOwner && notification?.notificationId.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesType = typeFilter === 'All' || notification.type === typeFilter;

            return matchesSearch && matchesType;
        });
    }, [notifications, searchTerm, typeFilter, isOwner]);

    const typeOptions = ['All', 'INFO', 'WARNING', 'ERROR', 'REPAIR_UPDATE'];

    const handleHrefClick = event => {
        const target = event.target;
        if (target.tagName === "A") {
            event.preventDefault(); // stop full reload
            const href = target.getAttribute("href");
            if (href.startsWith("/")) {
                navigate(href); // internal navigation
            } else {
                window.open(href, "_blank"); // external links
            }
        }
    };

    if (isLoading) {
        ProfileUtils.profileLoader("Fetching notifications...");
    }

    if (isError && error?.status === 403) {
        return <Unauthorized />
    }

    if (isError) {
        ProfileUtils.profileError("Error fetching notifications. Please try again.");
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
                                <Notifications sx={{ fontSize: { xs: '2rem', md: '3rem' } }} />
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
                                    Notifications
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
                                    <Badge badgeContent={filteredNotifications.length} color="secondary">
                                        <Chip
                                            label="Total Notifications"
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
                                    </Badge>
                                </Box>
                                <Typography variant="body1" sx={{
                                    opacity: 0.9,
                                    fontSize: {
                                        xs: '0.95rem',
                                        md: '1.1rem'
                                    }
                                }}>
                                    Stay updated with important system notifications
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Filters Section */}
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
                    },
                    marginBottom: {
                        xs: '20px',
                        md: '30px'
                    }
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        marginBottom: {
                            xs: '16px',
                            md: '24px'
                        }
                    }}>
                        <FilterList sx={{ color: '#4fc3f7' }} />
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: '#495057',
                            fontSize: {
                                xs: '1.1rem',
                                md: '1.25rem'
                            }
                        }}>
                            Filter Notifications
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid size={{xs:12, sm:6, md:6}}>
                            <StyledTextField
                                fullWidth
                                label="Search Notifications"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={isOwner ? "Search by ID, title, or message" : "Search by title or message"}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ color: '#4fc3f7' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px'
                                    }
                                }}
                            />
                        </Grid>

                        <Grid size={{xs:12, sm:6, md:6}}>
                            <StyledTextField
                                fullWidth
                                select
                                label="Type"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                SelectProps={{
                                    MenuProps: StyledMenuProps
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px'
                                    }
                                }}
                            >
                                {typeOptions.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </StyledTextField>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Notifications Grid */}
                {filteredNotifications.length === 0 ? (
                    <Paper sx={{
                        borderRadius: '20px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        p: 6,
                        textAlign: 'center'
                    }}>
                        <Notifications sx={{ fontSize: '4rem', color: '#9e9e9e', mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#495057', mb: 1 }}>
                            No Notifications Found
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
                            Try adjusting your search criteria or check back later.
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {filteredNotifications.map((notification) => (
                            <Grid size={{xs:12, lg:6}} key={notification.notificationId}>
                                <Card sx={{
                                    borderRadius: '16px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                    border: `2px solid ${getTypeColor(notification.type)}20`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)',
                                        borderColor: `${getTypeColor(notification.type)}40`
                                    }
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        {/* Header with ID (for owner) and Date */}
                                        <Box sx={{ mb: 1.5 }}>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                mb: 1
                                            }}>
                                                {isOwner && (
                                                    <Typography variant="body2" sx={{
                                                        color: '#7f8c8d',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 500,
                                                        backgroundColor: '#f8f9fa',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px'
                                                    }}>
                                                        ID: {notification.notificationId}
                                                    </Typography>
                                                )}
                                                <Typography variant="body2" sx={{
                                                    color: '#7f8c8d',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    fontSize: '0.85rem'
                                                }}>
                                                    <CalendarToday sx={{ fontSize: '14px' }} />
                                                    {formatDate(notification.createdAt)}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Type Badge */}
                                        <Box sx={{ mb: 2 }}>
                                            <Chip
                                                icon={getTypeIcon(notification.type)}
                                                label={notification.type.replace('_', ' ')}
                                                sx={{
                                                    backgroundColor: `${getTypeColor(notification.type)}15`,
                                                    color: getTypeColor(notification.type),
                                                    fontWeight: 600,
                                                    '& .MuiChip-icon': {
                                                        color: getTypeColor(notification.type)
                                                    }
                                                }}
                                            />
                                        </Box>

                                        {/* Title */}
                                        <Typography variant="h6" sx={{
                                            fontWeight: 700,
                                            color: '#2c3e50',
                                            marginBottom: '12px',
                                            fontSize: {xs: '16px', sm: '18px', lg: '20px'},
                                            lineHeight: 1.3
                                        }}>
                                            {notification.title}
                                        </Typography>

                                        {/* Message Preview */}
                                        <Box sx={{ mb: 2 }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#495057',
                                                    lineHeight: 1.6,
                                                    '& a': {
                                                        color: '#0d6efd',
                                                        fontWeight: 600,
                                                        textDecoration: 'none',
                                                        position: 'relative',
                                                        display: 'inline-block',
                                                        transition: 'color 0.2s ease-in-out, transform 0.2s ease-in-out',
                                                        '&::after': {
                                                            content: '""',
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0,
                                                            width: '0%',
                                                            height: '1px',
                                                            backgroundColor: '#0d6efd',
                                                            transition: 'width 0.3s ease-in-out',
                                                        },
                                                    },
                                                    '& a:hover': {
                                                        color: '#0856d3',
                                                        transform: 'translateY(-1px)',
                                                        '&::after': {
                                                            width: '100%',
                                                        },
                                                    },
                                                }}
                                                component="div"
                                                onClick={event => handleHrefClick(event)}
                                                dangerouslySetInnerHTML={{
                                                    __html: expandedCards[notification.notificationId] || notification.message.length <= 150
                                                        ? notification.message
                                                        : `${notification.message.substring(0, 150)}...`
                                                }}
                                            />
                                        </Box>

                                        {/* Notification as Alert (for better visibility) */}
                                        <Alert
                                            severity={getTypeSeverity(notification.type)}
                                            sx={{
                                                mb: 2,
                                                fontSize: '0.85rem',
                                                '& .MuiAlert-message': {
                                                    width: '100%'
                                                }
                                            }}
                                        >
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                width: '100%'
                                            }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {notification.type === 'REPAIR_UPDATE' && 'Service Update'}
                                                    {notification.type === 'INFO' && 'Information'}
                                                    {notification.type === 'WARNING' && 'Warning'}
                                                    {notification.type === 'ERROR' && 'Error Alert'}
                                                </Typography>
                                                {(notification.type === 'ERROR' || notification.type === 'WARNING') && (
                                                    <PriorityHigh sx={{ fontSize: '18px' }} />
                                                )}
                                            </Box>
                                        </Alert>

                                        {/* Expand/Collapse Button (only if message is long) */}
                                        {notification.message.length > 150 && (
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Button
                                                    onClick={() => toggleCardExpansion(notification.notificationId)}
                                                    endIcon={expandedCards[notification.notificationId] ? <ExpandLess /> : <ExpandMore />}
                                                    sx={{
                                                        textTransform: 'none',
                                                        color: getTypeColor(notification.type),
                                                        fontWeight: 600,
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    {expandedCards[notification.notificationId] ? 'Show Less' : 'Show More'}
                                                </Button>
                                            </Box>
                                        )}

                                        {/* Owner-only details */}
                                        {isOwner && (
                                            <>
                                                <Divider sx={{ my: 2 }} />
                                                <Box sx={{
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '8px',
                                                    p: 2
                                                }}>
                                                    <Typography variant="body2" sx={{
                                                        color: '#7f8c8d',
                                                        fontSize: '0.75rem',
                                                        mb: 0.5
                                                    }}>
                                                        <strong>User ID:</strong> {notification.userId}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{
                                                        color: '#7f8c8d',
                                                        fontSize: '0.75rem'
                                                    }}>
                                                        <strong>Notification ID:</strong> {notification.notificationId}
                                                    </Typography>
                                                </Box>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Summary Statistics */}
                <Paper sx={{
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    p: 4,
                    marginTop: 4,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                }}>
                    <Typography variant="h5" sx={{
                        fontWeight: 700,
                        color: '#2c3e50',
                        textAlign: 'center',
                        mb: 3
                    }}>
                        Notification Statistics
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid size={{xs:4, sm:2.4}}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{
                                    fontWeight: 800,
                                    color: '#4fc3f7',
                                    mb: 1
                                }}>
                                    {notifications?.length || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                    Total
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{xs:4, sm:2.4}}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{
                                    fontWeight: 800,
                                    color: '#2196f3',
                                    mb: 1
                                }}>
                                    {notifications?.filter(n => n.type === 'INFO').length || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                    Info
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{xs:4, sm:2.4}}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{
                                    fontWeight: 800,
                                    color: '#4caf50',
                                    mb: 1
                                }}>
                                    {notifications?.filter(n => n.type === 'REPAIR_UPDATE').length || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                    Updates
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{xs:4, sm:2.4}}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{
                                    fontWeight: 800,
                                    color: '#ff9800',
                                    mb: 1
                                }}>
                                    {notifications?.filter(n => n.type === 'WARNING').length || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                    Warnings
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{xs:4, sm:2.4}}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{
                                    fontWeight: 800,
                                    color: '#f44336',
                                    mb: 1
                                }}>
                                    {notifications?.filter(n => n.type === 'ERROR').length || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                    Errors
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Action Notice */}
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
                        <strong>Stay Informed:</strong> Notifications are updated in real-time to keep you informed about important system updates, service alerts, and repair progress.
                        Use the filter options to view specific types of notifications based on your needs.
                    </Typography>
                </Alert>
            </Box>
        </Box>
    );
};

export default DisplayNotifications;