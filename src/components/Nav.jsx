import React from "react";
import {AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Avatar, IconButton, Divider,
    Drawer, ListItemIcon, ListItemText, useMediaQuery, useTheme, Card, CardContent, Chip, Stack, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { ExitToApp, Menu as MenuIcon, Dashboard, Home, Info, Build, ContactMail, Close } from '@mui/icons-material';
import {Link, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from '../utils/useAuth.jsx';

const Nav = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const { isAuthenticated, user, isLoggingOut, logout } = useAuth();

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setShowNavbar(currentY < lastScrollY || currentY < 10);
            setLastScrollY(currentY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        if (!isMobile) {
            setDrawerOpen(false);
        }
    }, [isMobile]);

    const handleProfileMenuOpen = event => setAnchorEl(event.currentTarget);
    const handleProfileMenuClose = () => setAnchorEl(null);
    const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setProfileMenuOpen(false);
    };

    const handleNavigation = path => {
        handleProfileMenuClose();
        handleDrawerClose();
        navigate(path);
    };

    const handleLogoutClick = () => {
        setLogoutDialogOpen(true);
    };

    const handleLogoutConfirm = async () => {
        setLogoutDialogOpen(false);
        handleProfileMenuClose();
        handleDrawerClose();
        await logout();
    };

    const handleLogoutCancel = () => {
        setLogoutDialogOpen(false);
    };

    const getDisplayName = () => {
        if (user?.username) return user.username;
        if (user?.email) return user.email;
        return 'User';
    };

    const getUserInitials = () => {
        const name = getDisplayName();
        return name.slice(0, 2).toUpperCase();
    };

    const isMenuOpen = Boolean(anchorEl);

    const navigationItems = [
        { label: 'Home', path: '/#home', icon: <Home /> },
        { label: 'About', path: '/#about', icon: <Info /> },
        { label: 'Services', path: '/#services', icon: <Build /> },
        { label: 'Contact', path: '/#contact', icon: <ContactMail /> },
    ];

    const profileItems = [
        { label: 'Dashboard', path: '/dashboard', icon: <Dashboard />, color: '#4fc3f7' }
    ];

    const navButtonStyles = {
        color: "#ffffff",
        fontWeight: 500,
        textTransform: "capitalize",
        px: 3,
        py: 1,
        borderRadius: 2,
        transition: "all 0.3s ease",
        position: "relative",
        '&:hover': {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            transform: "translateY(-2px)"
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            width: 0,
            height: '2px',
            backgroundColor: '#4fc3f7',
            transition: 'all 0.3s ease',
            transform: 'translateX(-50%)'
        },
        '&:hover:before': {
            width: '80%'
        }
    };

    const modernDrawerStyles = {
        backgroundColor: "linear-gradient(135deg, #0f1419 0%, #1a2332 100%)",
        background: "linear-gradient(135deg, #0f1419 0%, #1a2332 100%)",
        color: "#ffffff",
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(79, 195, 247, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
            pointerEvents: 'none'
        }
    };

    const UserAvatar = ({ size = 32 }) => (
        <Avatar
            sx={{
                backgroundColor: 'rgba(79, 195, 247, 0.2)',
                color: 'white',
                width: size,
                height: size,
                fontSize: size === 24 ? '12px' : '14px',
                fontWeight: 600,
                border: '2px solid rgba(79, 195, 247, 0.3)',
                boxShadow: '0 4px 12px rgba(79, 195, 247, 0.2)',
            }}
        >
            {getUserInitials()}
        </Avatar>
    );

    const AuthButtons = ({ variant = 'desktop' }) => (
        <>
            {variant === 'desktop' ? (
                <>
                    <Button sx={navButtonStyles}>
                        <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                            Login
                        </Link>
                    </Button>
                    <Button sx={navButtonStyles}>
                        <Link to="/customer-register" style={{ color: 'inherit', textDecoration: 'none' }}>
                            Register
                        </Link>
                    </Button>
                </>
            ) : (
                <Box sx={{ px: 3, pb: 3 }}>
                    <Stack spacing={2}>
                        <Button
                            component={Link}
                            to="/login"
                            onClick={handleDrawerClose}
                            variant="outlined"
                            fullWidth
                            sx={{
                                py: 1.5,
                                borderColor: 'rgba(79, 195, 247, 0.5)',
                                color: '#4fc3f7',
                                borderRadius: 3,
                                fontWeight: 600,
                                fontSize: '1rem',
                                textTransform: 'none',
                                backdropFilter: 'blur(10px)',
                                background: 'rgba(79, 195, 247, 0.05)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: '#4fc3f7',
                                    background: 'rgba(79, 195, 247, 0.1)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(79, 195, 247, 0.2)'
                                }
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            component={Link}
                            to="/customer-register"
                            onClick={handleDrawerClose}
                            variant="contained"
                            fullWidth
                            sx={{
                                py: 1.5,
                                backgroundColor: '#4fc3f7',
                                color: '#0f1419',
                                borderRadius: 3,
                                fontWeight: 600,
                                fontSize: '1rem',
                                textTransform: 'none',
                                boxShadow: '0 4px 15px rgba(79, 195, 247, 0.3)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: '#29b6f6',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(79, 195, 247, 0.4)'
                                }
                            }}
                        >
                            Register
                        </Button>
                    </Stack>
                </Box>
            )}
        </>
    );

    const renderProfileMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            id="profile-menu"
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleProfileMenuClose}
            slotProps={{
                paper: {
                    sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backgroundColor: '#051120',
                        color: '#ffffff'
                    }
                }
            }}
        >
            <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#ffffff' }}>
                    {getDisplayName()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {user?.userType?.toLowerCase() || 'user'}
                </Typography>
            </Box>
            <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', my: 1 }} />

            {profileItems.map(item => (
                <MenuItem
                    key={item.label}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                        py: 1.5,
                        '&:hover': {
                            backgroundColor: `rgba(${item.color === '#4fc3f7' ? '79, 195, 247' : '255, 255, 255'}, 0.08)`
                        }
                    }}
                >
                    <ListItemIcon sx={{ fontSize: 20, color: item.color }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.label}
                        sx={{ fontSize: 20, color: item.color }}
                    />
                </MenuItem>
            ))}

            <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

            <MenuItem
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
                sx={{
                    py: 1.5,
                    color: '#e74c3c',
                    '&:hover': {
                        backgroundColor: 'rgba(231, 76, 60, 0.08)'
                    }
                }}
            >
                <ExitToApp sx={{ mr: 2, fontSize: 20 }} />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
            </MenuItem>
        </Menu>
    );

    const renderLogoutDialog = (
        <Dialog
            open={logoutDialogOpen}
            onClose={handleLogoutCancel}
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: '#051120',
                        borderRadius: 3,
                        border: '1px solid rgba(79, 195, 247, 0.2)',
                        minWidth: 320,
                        maxWidth: 400
                    }
                }
            }}
        >
            <DialogTitle sx={{
                color: '#ffffff',
                fontWeight: 600,
                borderBottom: '1px solid rgba(79, 195, 247, 0.1)',
                pb: 2
            }}>
                Confirm Logout
            </DialogTitle>
            <DialogContent sx={{
                pt: 2,
                '&:first-of-type': {
                    pt: 2
                }
            }}>
                <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Are you sure you want to logout? You will need to login again to access your account.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2.5, pt: 1 }}>
                <Button
                    onClick={handleLogoutCancel}
                    sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 3,
                        borderRadius: 2,
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleLogoutConfirm}
                    disabled={isLoggingOut}
                    variant="contained"
                    sx={{
                        backgroundColor: '#ef5350',
                        color: '#ffffff',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        borderRadius: 2,
                        '&:hover': {
                            backgroundColor: '#e53935'
                        },
                        '&:disabled': {
                            backgroundColor: 'rgba(239, 83, 80, 0.5)'
                        }
                    }}
                >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    backgroundColor: "rgba(5, 17, 32, 0.95)",
                    backdropFilter: "blur(10px)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease-in-out",
                    transform: showNavbar ? "translateY(0)" : "translateY(-100%)",
                    width: '100%'
                }}
            >
                <Toolbar sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    px: { xs: 2, sm: 3, md: 4 },
                    minHeight: { xs: 64, sm: 70 },
                    height: { xs: 64, sm: 70 }
                }}>
                    {/* Logo */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                        flexShrink: 0,
                        maxWidth: { xs: '250px', md: '275px' }
                    }}>
                        <Link to="/" style={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%'
                        }}>
                            <img
                                src="/srw-logo-2.png"
                                alt="SRW Logo"
                                style={{
                                    height: isMobile ? "60px" : "85px",
                                    width: isMobile ? "auto" : "275px",
                                    maxWidth: isMobile ? "250px" : "275px",
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={event => !isMobile && (event.target.style.transform = 'scale(1.05)')}
                                onMouseOut={event => !isMobile && (event.target.style.transform = 'scale(1)')}
                            />
                        </Link>
                    </Box>

                    {/* Desktop Navigation */}
                    <Box sx={{
                        display: { xs: 'none', md: 'flex' },
                        alignItems: 'center',
                        gap: 1,
                        flex: 1,
                        justifyContent: 'flex-end',
                        mr: 6
                    }}>
                        {/* Navigation Items */}
                        {navigationItems.map((item) => (
                            <Button key={item.label} sx={navButtonStyles}>
                                <Link
                                    to={item.path}
                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                >
                                    {item.label}
                                </Link>
                            </Button>
                        ))}

                        {/* Authentication Section */}
                        {!isAuthenticated ? (
                            <AuthButtons variant="desktop" />
                        ) : (
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls="profile-menu"
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    },
                                    mr: 1
                                }}
                            >
                                <UserAvatar />
                            </IconButton>
                        )}
                    </Box>

                    {/* Mobile Menu Button */}
                    <Box sx={{
                        display: { xs: 'flex', md: 'none' },
                        alignItems: 'center',
                        height: '100%',
                        minWidth: '60px',
                        mr: 3
                    }}>
                        <IconButton
                            sx={{
                                color: "#ffffff",
                                width: 44,
                                height: 44,
                                borderRadius: 2,
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                '&:hover': {
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    border: '2px solid rgba(79, 195, 247, 0.5)',
                                    transform: 'scale(1.05)'
                                },
                                '&:focus': {
                                    outline: '2px solid #4fc3f7',
                                    outlineOffset: '2px'
                                }
                            }}
                            onClick={handleDrawerToggle}
                            aria-label="Open navigation menu"
                            aria-expanded={drawerOpen}
                            role="button"
                            tabIndex={0}
                        >
                            <MenuIcon sx={{ fontSize: 24 }} />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerClose}
                slotProps={{
                    paper: {
                        sx: {
                            ...modernDrawerStyles,
                            width: 320,
                            maxWidth: '85vw',
                            borderLeft: '1px solid rgba(79, 195, 247, 0.2)',
                            boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.3)',
                            position: 'fixed',
                            right: 0,
                            left: 'auto',
                            transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
                            transition: 'transform 0.3s ease-in-out'
                        }
                    }
                }}
                sx={{
                    '& .MuiDrawer-paper': {
                        backgroundImage: 'linear-gradient(135deg, #0f1419 0%, #1a2332 100%)',
                        right: 0,
                        left: 'auto'
                    },
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }}
            >
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    position: 'relative'
                }}>
                    {/* Header with close button */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 3,
                        borderBottom: '1px solid rgba(79, 195, 247, 0.1)'
                    }}>
                        <Typography variant="h6" sx={{
                            color: '#4fc3f7',
                            fontWeight: 600,
                            fontSize: 14,
                            letterSpacing: '0.5px',
                            background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 50%, #03a9f4 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 2px 10px rgba(79, 195, 247, 0.3)',
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-2px',
                                left: 0,
                                right: 0,
                                height: '1px',
                                background: 'linear-gradient(90deg, transparent 0%, #4fc3f7 20%, #29b6f6 50%, #4fc3f7 80%, transparent 100%)',
                                opacity: 0.6
                            }
                        }}>
                            Srinivasa Refrigeration Works
                        </Typography>
                        <IconButton
                            onClick={handleDrawerClose}
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: '#4fc3f7'
                                }
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Box>

                    {/* User Profile Section (if authenticated) */}
                    {isAuthenticated && (
                        <Card sx={{
                            mx: 3,
                            mt: 3,
                            mb: 2,
                            backgroundColor: 'rgba(79, 195, 247, 0.05)',
                            border: '1px solid rgba(79, 195, 247, 0.2)',
                            borderRadius: 3,
                            backdropFilter: 'blur(10px)'
                        }}>
                            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <UserAvatar size={48} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" sx={{
                                            color: '#ffffff',
                                            fontWeight: 600,
                                            mb: 0.5
                                        }}>
                                            {getDisplayName()}
                                        </Typography>
                                        <Chip
                                            label={user?.userType?.toLowerCase() || 'user'}
                                            size="small"
                                            sx={{
                                                backgroundColor: 'rgba(79, 195, 247, 0.2)',
                                                color: '#4fc3f7',
                                                fontWeight: 500,
                                                fontSize: '0.75rem',
                                                height: 24
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {/* Navigation Items */}
                    <Box sx={{
                        px: 3,
                        pb: 2
                    }}>
                        <Typography variant="overline" sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontWeight: 600,
                            letterSpacing: '1px',
                            fontSize: '0.75rem',
                            mb: 2,
                            display: 'block'
                        }}>
                            MENU
                        </Typography>

                        <Stack spacing={1}>
                            {navigationItems.map((item) => (
                                <Button
                                    key={item.label}
                                    component={Link}
                                    to={item.path}
                                    onClick={handleDrawerClose}
                                    startIcon={item.icon}
                                    fullWidth
                                    sx={{
                                        justifyContent: 'flex-start',
                                        py: 1.5,
                                        px: 2.5,
                                        borderRadius: 2.5,
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        transition: 'all 0.3s ease',
                                        '& .MuiButton-startIcon': {
                                            color: 'rgba(79, 195, 247, 0.7)',
                                            marginRight: 2
                                        },
                                        '&:hover': {
                                            backgroundColor: 'rgba(79, 195, 247, 0.08)',
                                            border: '1px solid rgba(79, 195, 247, 0.2)',
                                            color: '#ffffff',
                                            transform: 'translateX(4px)',
                                            '& .MuiButton-startIcon': {
                                                color: '#4fc3f7'
                                            }
                                        }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Stack>
                    </Box>

                    {/* Profile Actions (if authenticated) */}
                    {isAuthenticated && (
                        <Box sx={{
                            px: 3,
                            pb: 2
                        }}>
                            <Typography variant="overline" sx={{
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontWeight: 600,
                                letterSpacing: '1px',
                                fontSize: '0.75rem',
                                mb: 2,
                                display: 'block'
                            }}>
                                ACCOUNT
                            </Typography>

                            <Stack spacing={1}>
                                {profileItems.map((item) => (
                                    <Button
                                        key={item.label}
                                        startIcon={item.icon}
                                        onClick={() => handleNavigation(item.path)}
                                        fullWidth
                                        sx={{
                                            justifyContent: 'flex-start',
                                            py: 1.5,
                                            px: 2.5,
                                            borderRadius: 2.5,
                                            color: item.color,
                                            backgroundColor: `rgba(79, 195, 247, 0.05)`,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            border: `1px solid rgba(79, 195, 247, 0.2)`,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: `rgba(79, 195, 247, 0.12)`,
                                                transform: 'translateX(4px)'
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}

                                <Button
                                    startIcon={<ExitToApp />}
                                    onClick={handleLogoutClick}
                                    disabled={isLoggingOut}
                                    fullWidth
                                    sx={{
                                        justifyContent: 'flex-start',
                                        py: 1.5,
                                        px: 2.5,
                                        borderRadius: 2.5,
                                        color: '#ef5350',
                                        backgroundColor: 'rgba(239, 83, 80, 0.05)',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        border: '1px solid rgba(239, 83, 80, 0.2)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(239, 83, 80, 0.12)',
                                            transform: 'translateX(4px)'
                                        },
                                        '&:disabled': {
                                            opacity: 0.6
                                        }
                                    }}
                                >
                                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                                </Button>
                            </Stack>
                        </Box>
                    )}

                    {/* Authentication Buttons (if not authenticated) */}
                    {!isAuthenticated && (
                        <Box sx={{
                            mt: 'auto',
                            pt: 2
                        }}>
                            <Divider sx={{ backgroundColor: 'rgba(79, 195, 247, 0.1)', mb: 3 }} />
                            <AuthButtons variant="mobile" />
                        </Box>
                    )}
                </Box>
            </Drawer>

            {renderProfileMenu}
            {renderLogoutDialog}
        </>
    );
};

export default Nav;