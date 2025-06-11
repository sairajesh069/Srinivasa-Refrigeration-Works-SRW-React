import {
    AppBar, Toolbar, Button, Box, IconButton,
    Drawer, List, ListItem, ListItemText
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Nav = () => {
    const [open, setOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const navItems = ["Home", "About", "Services", "Contact", "Login"];

    const toggleDrawer = state => () => {
        setOpen(state);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setShowNavbar(currentY < lastScrollY || currentY < 10);
            setLastScrollY(currentY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

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
                                    height: "85px",
                                    width: "275px",
                                    transition: 'transform 0.2s ease'
                                }}
                                onMouseOver={event => event.target.style.transform = 'scale(1.05)'}
                                onMouseOut={event => event.target.style.transform = 'scale(1)'}
                            />
                        </Link>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 3 }}>
                        {navItems.map((item) => (
                            <Button
                                key={item}
                                sx={{
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
                                }}
                            >
                                <Link
                                    to={item === "Login" ? "/login" : `/#${item.toLowerCase()}`}
                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                >
                                    {item}
                                </Link>
                            </Button>
                        ))}
                    </Box>

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
                            onClick={toggleDrawer(true)}
                            aria-label="Open navigation menu"
                            aria-expanded={open}
                            role="button"
                            tabIndex={0}
                        >
                            <Menu sx={{ fontSize: 24 }} />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={open}
                onClose={toggleDrawer(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: "#051120",
                        color: "#ffffff",
                        width: 280
                    }
                }}
            >
                <Box
                    sx={{ width: '100%', pt: 3 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List sx={{ px: 2 }}>
                        {navItems.map(text => (
                            <ListItem
                                button
                                component="a"
                                key={text}
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
                                <ListItemText
                                    primary={
                                        <Link
                                            to={text === "Login" ? "/login" : `/#${text.toLowerCase()}`}
                                            style={{
                                                fontWeight: 500,
                                                fontSize: '1.1rem',
                                                color: '#ffffff',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            {text}
                                        </Link>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Nav;