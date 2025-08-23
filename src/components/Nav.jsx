import React from "react";
import {
    AppBar, Toolbar, Typography, Button, Box,
    Menu, MenuItem, Avatar, IconButton, Divider,
    Drawer, List, ListItem, ListItemIcon, ListItemText,
    useMediaQuery, useTheme, Collapse
} from '@mui/material';
import {
    ExitToApp, Menu as MenuIcon, Dashboard,
    Home, Info, Build, ContactMail, ExpandLess, ExpandMore
} from '@mui/icons-material';
import {Link, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from '../utils/useAuth.jsx';

const Nav = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

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

    // Consolidated menu handlers
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

    const handleLogout = async () => {
        handleProfileMenuClose();
        handleDrawerClose();
        await logout();
    };

    // User display helpers
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

    // Shared styles
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

    const listItemHoverStyles = {
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }
    };

    const drawerPaperStyles = {
        backgroundColor: "#051120",
        color: "#ffffff"
    };

    // Reusable components
    const UserAvatar = ({ size = 32 }) => (
        <Avatar
            sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                width: size,
                height: size,
                fontSize: size === 24 ? '12px' : '14px',
                fontWeight: 600
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
                <List sx={{ px: 2 }}>
                    <ListItem
                        button
                        component={Link}
                        to="/login"
                        onClick={handleDrawerClose}
                        sx={{ py: 1.5, mb: 1, borderRadius: 2, ...listItemHoverStyles }}
                    >
                        <ListItemText
                            primary="Login"
                            sx={{
                                textAlign: 'center',
                                color: 'rgba(255, 255, 255, 0.7)',
                                '& .MuiListItemText-primary': {
                                    fontWeight: 500,
                                    fontSize: '1.1rem'
                                }
                            }}
                        />
                    </ListItem>
                    <ListItem
                        button
                        component={Link}
                        to="/customer-register"
                        onClick={handleDrawerClose}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.3)'
                            }
                        }}
                    >
                        <ListItemText
                            primary="Register"
                            sx={{
                                textAlign: 'center',
                                color: 'rgba(255, 255, 255, 0.7)',
                                '& .MuiListItemText-primary': {
                                    fontWeight: 500,
                                    fontSize: '1.1rem'
                                }
                            }}
                        />
                    </ListItem>
                </List>
            )}
        </>
    );

    // Desktop Profile Menu
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
                onClick={handleLogout}
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
                    transform: showNavbar ? "translateY(0)" : "translateY(-100%)"
                }}
            >
                <Toolbar sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '1200px',
                    width: '100%',
                    mx: 'auto',
                    px: { xs: 2, md: 3 },
                    minHeight: { xs: 64, sm: 70 },
                    height: { xs: 64, sm: 70 }
                }}>
                    {/* Logo */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%'
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
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, mr: 3 }}>
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
                                    mr: 3,
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
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
                        height: '100%'
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
                                },
                                mr: 3
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
                            ...drawerPaperStyles,
                            width: 280
                        }
                    }
                }}
            >
                <Box sx={{ width: '100%', pt: 3 }} role="presentation">
                    {/* Navigation Items */}
                    <List sx={{ px: 2 }}>
                        {navigationItems.map((item) => (
                            <ListItem
                                button
                                component={Link}
                                to={item.path}
                                key={item.label}
                                onClick={handleDrawerClose}
                                sx={{
                                    py: 2.5,
                                    px: 3,
                                    mb: 1,
                                    borderRadius: 3,
                                    transition: "all 0.2s ease",
                                    '&:hover': {
                                        backgroundColor: "rgba(79, 195, 247, 0.1)",
                                        transform: 'translateX(5px)'
                                    },
                                    '&:focus': {
                                        outline: '2px solid #4fc3f7',
                                        outlineOffset: '2px'
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            fontWeight: 500,
                                            fontSize: '1.1rem',
                                            color: 'rgba(255, 255, 255, 0.7)'
                                        }
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>

                    <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', my: 1 }} />

                    {/* Authentication Section */}
                    {isAuthenticated ? (
                        <Box>
                            <ListItem
                                button
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                sx={{
                                    py: 1.5,
                                    mx: 2,
                                    borderRadius: 2,
                                    ...listItemHoverStyles
                                }}
                            >
                                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                                    <UserAvatar size={24} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={getDisplayName()}
                                    secondary={user?.userType?.toLowerCase() || 'user'}
                                    slotProps={{
                                        secondary: {
                                            sx: {color: 'rgba(255, 255, 255, 0.7)'}
                                        }
                                    }}
                                />
                                {profileMenuOpen ? <ExpandLess sx={{ mr: 3 }}/> : <ExpandMore sx={{ mr: 3 }}/>}
                            </ListItem>

                            <Collapse in={profileMenuOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem
                                        button
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        sx={{
                                            pl: 4,
                                            py: 1,
                                            mx: 2,
                                            borderRadius: 2,
                                            color: '#e74c3c',
                                            '&:hover': {
                                                backgroundColor: 'rgba(231, 76, 60, 0.1)'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: '#e74c3c', minWidth: 40 }}>
                                            <ExitToApp />
                                        </ListItemIcon>
                                        <ListItemText primary={isLoggingOut ? 'Logging out...' : 'Logout'} />
                                    </ListItem>
                                </List>
                            </Collapse>
                        </Box>
                    ) : (
                        <AuthButtons variant="mobile" />
                    )}
                </Box>
            </Drawer>

            {renderProfileMenu}
        </>
    );
};

export default Nav;