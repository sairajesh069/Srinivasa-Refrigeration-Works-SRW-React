import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip, Avatar, Button, Alert, Divider, useTheme,
    useMediaQuery, InputAdornment, MenuItem, Collapse, Badge, Tooltip, IconButton, CircularProgress } from '@mui/material';
import {
    Dashboard, FilterList, Search, CalendarToday, Person, Phone, Email,
    Home, Build, Description, Schedule, CheckCircle, Pending, Error, Handyman,
    ExpandMore, ExpandLess, ContactPhone, Engineering, Feedback, History, List, TrackChanges} from '@mui/icons-material';
import {useLocation, useNavigate} from 'react-router-dom';
import StyledTextField from "../../utils/form-styling/StyledTextField.jsx";
import StyledMenuProps from "../../utils/form-styling/StyledSelectMenu.jsx";
import useAuth from "../../utils/useAuth.jsx";
import {useFetchMyComplaintsQuery} from "../../reducers/complaintApi.js";

const DisplayComplaints = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [productTypeFilter, setProductTypeFilter] = useState('All');
    const [expandedCards, setExpandedCards] = useState({});

    const { data, isLoading, isError } = useFetchMyComplaintsQuery(user.userId);

    const complaints = data?.complaintsDTO;

    const toggleCardExpansion = complaintId => {
        setExpandedCards(prev => ({
            ...prev,
            [complaintId]: !prev[complaintId]
        }));
    };

    const getStatusColor = status => {
        switch (status?.toLowerCase()) {
            case 'resolved':
            case 'closed':
                return '#4caf50';
            case 'in_progress':
            case 'assigned':
                return '#ff9800';
            case 'pending':
            case 'submitted':
            case 'reopened':
                return '#f44336';
            default:
                return '#9e9e9e';
        }
    };

    const getStatusIcon = status => {
        switch (status?.toLowerCase()) {
            case 'resolved':
            case 'closed':
                return <CheckCircle />;
            case 'in_progress':
            case 'assigned':
                return <Schedule />;
            case 'pending':
            case 'submitted':
            case 'reopened':
                return <Pending />;
            default:
                return <Error />;
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

    const filteredComplaints = useMemo(() => {
        if (!complaints || !Array.isArray(complaints)) {
            return [];
        }
        return complaints.filter(complaint => {
            const matchesSearch = complaint.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                complaint.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
            const matchesProductType = productTypeFilter === 'All' || complaint.productType === productTypeFilter;

            return matchesSearch && matchesStatus && matchesProductType;
        });
    }, [complaints, searchTerm, statusFilter, productTypeFilter]);

    const statusOptions = ['All', 'PENDING', 'IN_PROGRESS', 'RESOLVED'];
    const productTypeOptions = ['All', 'Air Conditioner', 'Refrigerator', 'Other'];

    const isUserComplaintsPath = location.pathname === '/my-complaints';

    if (isLoading) {
        return (
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
                    Fetching complaints....
                </Typography>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={{
                p: 4,
                textAlign: 'center',
                backgroundColor: '#f8f9fa',
                minHeight: '50vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Alert severity="error" sx={{ maxWidth: '500px' }}>
                    Failed to load complaints. Please try again.
                </Alert>
            </Box>
        );
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

                                <Tooltip title="Register Complaint">
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
                                            navigate('/complaint-register');
                                        }}
                                    >
                                        <Handyman sx={{ fontSize: { xs: '18px', sm: '20px', md: '24px' } }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
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
                                {isUserComplaintsPath
                                    ? <TrackChanges sx={{ fontSize: { xs: '2rem', md: '3rem' } }} />
                                    : <List sx={{ fontSize: { xs: '2rem', md: '3rem' } }} />
                                }
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
                                    {isUserComplaintsPath ? "Complaint History" : "All Complaints" }
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
                                    <Badge badgeContent={filteredComplaints.length} color="secondary">
                                        <Chip
                                            label="Total Complaints"
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
                                    View and manage all service complaints
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
                            Filter Complaints
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid size={{xs:12, sm:6, md:4}}>
                            <StyledTextField
                                fullWidth
                                label="Search Complaints"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by ID, name, or description"
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

                        <Grid size={{xs:12, sm:6, md:4}}>
                            <StyledTextField
                                fullWidth
                                select
                                label="Status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                SelectProps={{
                                    MenuProps: StyledMenuProps
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px'
                                    }
                                }}
                            >
                                {statusOptions.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </StyledTextField>
                        </Grid>

                        <Grid size={{xs:12, sm:6, md:4}}>
                            <StyledTextField
                                fullWidth
                                select
                                label="Product Type"
                                value={productTypeFilter}
                                onChange={(e) => setProductTypeFilter(e.target.value)}
                                SelectProps={{
                                    MenuProps: StyledMenuProps
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px'
                                    }
                                }}
                            >
                                {productTypeOptions.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </StyledTextField>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Complaints Grid */}
                {filteredComplaints.length === 0 ? (
                    <Paper sx={{
                        borderRadius: '20px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        p: 6,
                        textAlign: 'center'
                    }}>
                        <Error sx={{ fontSize: '4rem', color: '#9e9e9e', mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#495057', mb: 1 }}>
                            No Complaints Found
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
                            Try adjusting your search criteria or submit a new complaint.
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {filteredComplaints.map((complaint) => (
                            <Grid size={{xs:12, lg:6}} key={complaint.complaintId}>
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
                                        {/* Header with Complaint ID and Status */}
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            mb: 2
                                        }}>
                                            <Box>
                                                <Typography variant="h6" sx={{
                                                    fontWeight: 700,
                                                    color: '#2c3e50',
                                                    mb: 0.5
                                                }}>
                                                    {complaint.complaintId}
                                                </Typography>
                                                <Typography variant="body2" sx={{
                                                    color: '#7f8c8d',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}>
                                                    <CalendarToday sx={{ fontSize: '14px' }} />
                                                    {formatDate(complaint.createdAt)}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                icon={getStatusIcon(complaint.status)}
                                                label={complaint.status}
                                                sx={{
                                                    backgroundColor: `${getStatusColor(complaint.status)}15`,
                                                    color: getStatusColor(complaint.status),
                                                    fontWeight: 600,
                                                    '& .MuiChip-icon': {
                                                        color: getStatusColor(complaint.status)
                                                    }
                                                }}
                                            />
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
                                            <Box sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 2,
                                                fontSize: '14px',
                                                color: '#7f8c8d'
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Phone sx={{ fontSize: '14px' }} />
                                                    {complaint.contactNumber}
                                                </Box>
                                                {complaint.email !== 'N/A' && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Email sx={{ fontSize: '14px' }} />
                                                        {complaint.email}
                                                    </Box>
                                                )}
                                            </Box>
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
                                            alignItems: 'center'
                                        }}>
                                            <Typography variant="body2" sx={{
                                                color: '#7f8c8d',
                                                fontSize: '12px'
                                            }}>
                                                Last updated: {formatDate(complaint.updatedAt)}
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
                                                        Assigned Technician
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
                                                            {complaint.technicianDetails.designation} (ID: {complaint.technicianDetails.employeeId})
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

                                            {/* Feedback Section */}
                                            {(complaint.technicianFeedback || complaint.customerFeedback) && (
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
                                                        Feedback
                                                    </Typography>

                                                    {complaint.technicianFeedback && (
                                                        <Alert severity="info" sx={{ mb: 1, fontSize: '14px' }}>
                                                            <strong>Technician:</strong> {complaint.technicianFeedback}
                                                        </Alert>
                                                    )}

                                                    {complaint.customerFeedback && (
                                                        <Alert severity="success" sx={{ fontSize: '14px' }}>
                                                            <strong>Customer:</strong> {complaint.customerFeedback}
                                                        </Alert>
                                                    )}
                                                </Box>
                                            )}

                                            {/* Timeline */}
                                            <Box>
                                                <Typography variant="subtitle2" sx={{
                                                    fontWeight: 600,
                                                    color: '#495057',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    mb: 1
                                                }}>
                                                    <History sx={{ fontSize: '16px', color: '#6c757d' }} />
                                                    Timeline
                                                </Typography>
                                                <Box sx={{ fontSize: '12px', color: '#7f8c8d' }}>
                                                    <Box sx={{ mb: 0.5 }}>Created: {formatDate(complaint.createdAt)}</Box>
                                                    <Box sx={{ mb: 0.5 }}>Updated: {formatDate(complaint.updatedAt)}</Box>
                                                    {complaint.closedAt && (
                                                        <Box sx={{ mb: 0.5 }}>Closed: {formatDate(complaint.closedAt)}</Box>
                                                    )}
                                                    {complaint.reopenedAt && (
                                                        <Box>Reopened: {formatDate(complaint.reopenedAt)}</Box>
                                                    )}
                                                </Box>
                                            </Box>
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
                        Complaint Statistics
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid size={{xs:6, sm:3}}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{
                                    fontWeight: 800,
                                    color: '#4fc3f7',
                                    mb: 1
                                }}>
                                    {complaints?.length || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                    Total
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{xs:6, sm:3}}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{
                                    fontWeight: 800,
                                    color: '#f44336',
                                    mb: 1
                                }}>
                                    {complaints?.filter(c => c.status === 'PENDING').length || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                    Pending
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{xs:6, sm:3}}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{
                                    fontWeight: 800,
                                    color: '#ff9800',
                                    mb: 1
                                }}>
                                    {complaints?.filter(c => c.status === 'IN_PROGRESS').length || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                    In Progress
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{xs:6, sm:3}}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{
                                    fontWeight: 800,
                                    color: '#4caf50',
                                    mb: 1
                                }}>
                                    {complaints?.filter(c => c.status === 'RESOLVED').length || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                    Resolved
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
                        <strong>Service Update:</strong> Complaints are automatically updated in real-time.
                        For urgent issues, please contact our support team directly.
                        Use filters to quickly find specific complaints by status, product type, or search terms.
                    </Typography>
                </Alert>
            </Box>
        </Box>
    );
};

export default DisplayComplaints;