import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip, Avatar, Button, Alert, Divider, useTheme,
    useMediaQuery, InputAdornment, MenuItem, Collapse, Badge, Tooltip, IconButton, Switch, FormControlLabel } from '@mui/material';
import { Dashboard, FilterList, Search, CalendarToday, Person, Phone, Email, Home, Work, Error, PeopleAlt, ExpandMore,
    ExpandLess, PersonAdd, History, Edit, PersonOutline, Badge as BadgeIcon, DateRange,
    AccountBalance, AttachMoney } from '@mui/icons-material';
import {useLocation, useNavigate} from 'react-router-dom';
import StyledTextField from "../../utils/form-styling/StyledTextField.jsx";
import StyledMenuProps from "../../utils/form-styling/StyledSelectMenu.jsx";
import useAuth from "../../utils/useAuth.jsx";
import { toast } from 'react-toastify';
import { useFetchAllUsersByUserTypeQuery, useUpdateUserStatusMutation } from "../../reducers/userProfileApi.js";
import ProfileUtils from "../../utils/ProfileUtils.jsx";

const DisplayUsers = () => {
    const {  isLoggingOut } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [userStatusFilter, setUserStatusFilter] = useState('All');
    const [expandedCards, setExpandedCards] = useState({});

    const isFetchingOwners = location.pathname === "/owner-list";
    const isFetchingEmployees = location.pathname === "/employee-list";
    const isFetchingCustomers = location.pathname === "/customer-list";

    const fetchedUserType = isFetchingOwners ? "Owner"
        : isFetchingEmployees ? "Employee"
            : isFetchingCustomers ? "Customer"
                : '';

    const { data: usersList, isLoading: fetchUsersListLoading,
        isError: fetchUsersListError, refetch: refetchUsersList } = useFetchAllUsersByUserTypeQuery(fetchedUserType.toLowerCase(), {
            refetchOnMountOrArgChange: true,
            skip: !fetchedUserType && isLoggingOut
    });

    const users = usersList?.usersDTO || [];

    const fetchedUserID = user => {
        return fetchedUserType === "Owner" ? user.ownerId
            : fetchedUserType === "Employee" ? user.employeeId
                : fetchedUserType === "Customer" ? user.customerId
                    : '';
    };

    const toggleCardExpansion = userId => {
        setExpandedCards(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    const getUserStatusColor = status => {
        return status?.toLowerCase() === 'active' ? '#4caf50' : '#f44336';
    };

    const [updateUserStatus] = useUpdateUserStatusMutation();

    const handleUserStatusToggle = async (userId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'ACTIVE' ? 'IN_ACTIVE' : 'ACTIVE';
            const userType = fetchedUserType.toLowerCase();

            const updateUserStatusDTO = {
                userId: userId,
                userStatus: newStatus
            }

            await updateUserStatus({
                updateUserStatusDTO,
                userType
            }).unwrap();

            toast.success(`${fetchedUserType} ${newStatus === 'ACTIVE' ? newStatus.toLowerCase() : 'deactivate'}d successfully`);
            refetchUsersList();
        } catch (error) {
            toast.error(`Failed to update ${fetchedUserType.toLowerCase()} status`);
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

    const formatDateOnly = dateString => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getUserTypeIcon = userType => {
        switch (userType?.toLowerCase()) {
            case 'owner':
                return <AccountBalance />;
            case 'employee':
                return <BadgeIcon />;
            case 'customer':
                return <PersonOutline />;
            default:
                return <Person />;
        }
    };

    const getUserTypeColor = userType => {
        switch (userType?.toLowerCase()) {
            case 'owner':
                return '#9c27b0';
            case 'employee':
                return '#2196f3';
            case 'customer':
                return '#4caf50';
            default:
                return '#9e9e9e';
        }
    };

    const filteredUsers = useMemo(() => {
        if (!users || !Array.isArray(users)) {
            return [];
        }
        return users.filter(user => {
            const matchesSearch = fetchedUserID(user).includes(searchTerm) ||
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phoneNumber.includes(searchTerm);
            const matchesStatus = userStatusFilter === 'All' || user.status === userStatusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [users, searchTerm, userStatusFilter]);

    const userStatusOptions = ['All', 'ACTIVE', 'IN_ACTIVE'];

    if (fetchUsersListLoading) {
        ProfileUtils.profileLoader("Fetching users......")
    }

    if (fetchUsersListError) {
        ProfileUtils.profileError("Failed to load users. Please try again.");
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
                                    onClick={() => {
                                        navigate('/dashboard');
                                    }}
                                >
                                    <Dashboard sx={{ fontSize: { xs: '18px', sm: '20px', md: '24px' } }} />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title={`Add ${fetchedUserType}`}>
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
                                        navigate(`/${fetchedUserType.toLowerCase()}-register`);
                                    }}
                                >
                                    <PersonAdd sx={{ fontSize: { xs: '18px', sm: '20px', md: '24px' } }} />
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
                                <PeopleAlt sx={{ fontSize: { xs: '2rem', md: '3rem' } }} />
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
                                    { `${fetchedUserType}s Management` }
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
                                    <Badge badgeContent={filteredUsers.length} color="secondary">
                                        <Chip
                                            label="Total Users"
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
                                    Manage and monitor all system users
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
                            Filter Users
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid size={{xs:12, sm:6}}>
                            <StyledTextField
                                fullWidth
                                label="Search Users"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by ID, name, email, or phone"
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

                        <Grid size={{xs:12, sm:6}}>
                            <StyledTextField
                                fullWidth
                                select
                                label="User Status"
                                value={userStatusFilter}
                                onChange={(e) => setUserStatusFilter(e.target.value)}
                                SelectProps={{
                                    MenuProps: StyledMenuProps
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px'
                                    }
                                }}
                            >
                                {userStatusOptions.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </StyledTextField>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Users Grid */}
                {filteredUsers.length === 0 ? (
                    <Paper sx={{
                        borderRadius: '20px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        p: 6,
                        textAlign: 'center'
                    }}>
                        <Error sx={{ fontSize: '4rem', color: '#9e9e9e', mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#495057', mb: 1 }}>
                            No Users Found
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
                            Try adjusting your search criteria or add a new user.
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {filteredUsers.map((user) => (
                            <Grid size={{xs:12, lg:6}} key={fetchedUserID(user)}>
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
                                            {/* User ID and Edit Button */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 1
                                            }}>
                                                <Typography variant="h6" sx={{
                                                    fontWeight: 700,
                                                    color: '#2c3e50',
                                                    fontSize: {xs: '16px', sm: '18.5px', lg: '20px'},
                                                }}>
                                                    {fetchedUserID(user)}
                                                </Typography>
                                                <Tooltip title="Edit User">
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            color: '#4fc3f7',
                                                            backgroundColor: 'rgba(79, 195, 247, 0.1)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(79, 195, 247, 0.2)',
                                                                transform: 'scale(1.05)'
                                                            },
                                                            width: '32px',
                                                            height: '32px',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onClick={() => {
                                                            navigate(`/update-profile?userId=${fetchedUserID(user)}&userType=${fetchedUserType.toUpperCase()}`);
                                                        }}
                                                    >
                                                        <Edit sx={{ fontSize: '16px' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>

                                            {/* Updated Date and User Type */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <Typography variant="body2" sx={{
                                                    color: '#7f8c8d',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.6
                                                }}>
                                                    <CalendarToday sx={{ fontSize: '14px' }} />
                                                    {formatDate(user.updatedAt)}
                                                </Typography>
                                                <Chip
                                                    icon={getUserTypeIcon(fetchedUserType)}
                                                    label={fetchedUserType.toUpperCase()}
                                                    sx={{
                                                        backgroundColor: `${getUserTypeColor(fetchedUserType)}15`,
                                                        color: getUserTypeColor(fetchedUserType),
                                                        fontWeight: 600,
                                                        '& .MuiChip-icon': {
                                                            color: getUserTypeColor(fetchedUserType)
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* User Info */}
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
                                                {user.firstName} {user.lastName}
                                            </Typography>
                                            <Box sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 2,
                                                fontSize: '14px',
                                                color: '#7f8c8d'
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Phone sx={{ fontSize: '14px' }} />
                                                    {user.phoneNumber}
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Email sx={{ fontSize: '14px' }} />
                                                    {user.email}
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* User Status Toggle */}
                                        <Box sx={{ mb: 2 }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={user.status === 'ACTIVE'}
                                                        onChange={() => handleUserStatusToggle(fetchedUserID(user), user.status)}
                                                        sx={{
                                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                                color: '#4caf50',
                                                            },
                                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                backgroundColor: '#4caf50',
                                                            },
                                                            '& .MuiSwitch-track': {
                                                                backgroundColor: user.status === 'ACTIVE' ? '#4caf50' : '#f44336',
                                                            }
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Typography variant="body2" sx={{
                                                            fontWeight: 600,
                                                            color: getUserStatusColor(user.status)
                                                        }}>
                                                            {user.status}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </Box>

                                        {/* Gender */}
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: '#495057', fontWeight: 500 }}>
                                                Gender: {user.gender}
                                            </Typography>
                                        </Box>

                                        {/* Expand/Collapse Button */}
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Typography variant="body2" sx={{
                                                color: '#7f8c8d',
                                                fontSize: '12px'
                                            }}>
                                                Last updated: {formatDate(user.updatedAt)}
                                            </Typography>
                                            <Button
                                                onClick={() => toggleCardExpansion(fetchedUserID(user))}
                                                endIcon={expandedCards[user.userId] ? <ExpandLess /> : <ExpandMore />}
                                                sx={{
                                                    textTransform: 'none',
                                                    color: '#4fc3f7',
                                                    fontWeight: 600
                                                }}
                                            >
                                                {expandedCards[fetchedUserID(user)] ? 'Less Details' : 'More Details'}
                                            </Button>
                                        </Box>

                                        {/* Expanded Details */}
                                        <Collapse in={expandedCards[fetchedUserID(user)]}>
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
                                                    Address
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#7f8c8d', lineHeight: 1.6 }}>
                                                    {user.address}
                                                </Typography>
                                            </Box>

                                            {/* Owner/Employee specific fields */}
                                            {(fetchedUserType === 'Owner' || fetchedUserType === 'Employee') && (
                                                <Box sx={{ mb: 3 }}>
                                                    <Typography variant="subtitle2" sx={{
                                                        fontWeight: 600,
                                                        color: '#495057',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        mb: 1
                                                    }}>
                                                        <DateRange sx={{ fontSize: '16px', color: '#2196f3' }} />
                                                        Personal Information
                                                    </Typography>
                                                    <Box sx={{
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: '8px',
                                                        p: 2
                                                    }}>
                                                        {user.dateOfBirth && (
                                                            <Typography variant="body2" sx={{ color: '#495057', mb: 0.5 }}>
                                                                <strong>Date of Birth:</strong> {formatDateOnly(user.dateOfBirth)}
                                                            </Typography>
                                                        )}
                                                        {user.nationalIdNumber && (
                                                            <Typography variant="body2" sx={{ color: '#495057' }}>
                                                                <strong>National ID:</strong> {user.nationalIdNumber}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            )}

                                            {/* Employee specific fields */}
                                            {fetchedUserType === 'Employee' && (
                                                <Box sx={{ mb: 3 }}>
                                                    <Typography variant="subtitle2" sx={{
                                                        fontWeight: 600,
                                                        color: '#495057',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        mb: 1
                                                    }}>
                                                        <Work sx={{ fontSize: '16px', color: '#4caf50' }} />
                                                        Employment Information
                                                    </Typography>
                                                    <Box sx={{
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: '8px',
                                                        p: 2
                                                    }}>
                                                        {user.designation && (
                                                            <Typography variant="body2" sx={{ color: '#495057', mb: 0.5 }}>
                                                                <strong>Designation:</strong> {user.designation}
                                                            </Typography>
                                                        )}
                                                        {user.dateOfHire && (
                                                            <Typography variant="body2" sx={{ color: '#495057', mb: 0.5 }}>
                                                                <strong>Date of Hire:</strong> {formatDateOnly(user.dateOfHire)}
                                                            </Typography>
                                                        )}
                                                        {user.dateOfExit && (
                                                            <Typography variant="body2" sx={{ color: '#495057', mb: 0.5 }}>
                                                                <strong>Date of Exit:</strong> {formatDateOnly(user.dateOfExit)}
                                                            </Typography>
                                                        )}
                                                        {user.salary && (
                                                            <Typography variant="body2" sx={{ color: '#495057', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <AttachMoney sx={{ fontSize: '14px' }} />
                                                                <strong>Salary:</strong> ₹{user.salary.toLocaleString('en-IN')}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            )}

                                            {/* Owner/Customer specific fields */}
                                            {(fetchedUserType === 'Owner' || fetchedUserType === 'Customer') && user.createdAt && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="subtitle2" sx={{
                                                        fontWeight: 600,
                                                        color: '#495057',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        mb: 1
                                                    }}>
                                                        <History sx={{ fontSize: '16px', color: '#6c757d' }} />
                                                        Registration Information
                                                    </Typography>
                                                    <Box sx={{
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: '8px',
                                                        p: 2
                                                    }}>
                                                        <Typography variant="body2" sx={{ color: '#495057' }}>
                                                            <strong>Created:</strong> {formatDate(user.createdAt)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Collapse>
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
                        User Statistics
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid size={{xs:6, sm:4}}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{
                                    fontWeight: 800,
                                    color: '#4fc3f7',
                                    mb: 1
                                }}>
                                    {users?.length || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                    Total
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{xs:6, sm:4}}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{
                                    fontWeight: 800,
                                    color: '#4caf50',
                                    mb: 1
                                }}>
                                    {users?.filter(u => u.status === 'ACTIVE').length || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                    Active
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{xs:6, sm:4}}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{
                                    fontWeight: 800,
                                    color: '#f44336',
                                    mb: 1
                                }}>
                                    {users?.filter(u => u.status === 'IN_ACTIVE').length || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                    IN_ACTIVE
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
                        <strong>User Management:</strong> Users are automatically updated in real-time.
                        Use the status toggle to activate/deactivate users instantly.
                        Filter users by status, type, or search terms to quickly find specific users.
                    </Typography>
                </Alert>
            </Box>
        </Box>
    );
};

export default DisplayUsers;