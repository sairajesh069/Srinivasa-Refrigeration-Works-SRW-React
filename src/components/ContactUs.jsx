import React from 'react';
import { Phone, WhatsApp, Email, LocationOn, Schedule, Business, ArrowForward } from '@mui/icons-material';
import { Box, Typography, Card, CardContent, Container, Grid, Button, Chip,
    Divider, Paper, Stack, useTheme, useMediaQuery } from "@mui/material";

const ContactUs = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const contactMethods = [
        {
            icon: <Phone sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />,
            title: "Call Us",
            subtitle: "Immediate assistance",
            value: "+91 85559 76776",
            href: "tel:+918555976776",
            color: "#10b981",
            hoverColor: "#059669",
            gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
        },
        {
            icon: <WhatsApp sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />,
            title: "WhatsApp",
            subtitle: "Quick messaging",
            value: "Chat with us",
            href: "https://wa.me/+918555976776",
            color: "#25D366",
            hoverColor: "#128C7E",
            gradient: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)"
        },
        {
            icon: <Email sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />,
            title: "Email",
            subtitle: "Send details",
            value: "srinivasraosuravarupu@gmail.com",
            href: "mailto:srinivasraosuravarupu@gmail.com",
            color: "#e11d48",
            hoverColor: "#be185d",
            gradient: "linear-gradient(135deg, #e11d48 0%, #be185d 100%)"
        }
    ];

    const businessInfo = [
        {
            icon: <Schedule sx={{ color: '#4fc3f7', fontSize: { xs: 28, sm: 34, md: 40 } }} />,
            title: "Business Hours",
            details: ["Sunday to Saturday", "9:00 AM – 8:30 PM"]
        },
        {
            icon: <LocationOn sx={{ color: '#4fc3f7', fontSize: { xs: 28, sm: 34, md: 40 } }} />,
            title: "Our Location",
            isEmbeddedMap: true,
            embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.8947567891234!2d82.54702971484!3d17.35071878088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39c7d6341c7c47%3A0x74dac1f2c0739f42!2sSrinivasa%20Refrigeration%20Works!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin",
            href: "https://www.google.com/maps/place/Srinivasa+Refrigeration+Works/@17.3507181,82.5470297,17z/data=!4m14!1m7!3m6!1s0x3a39c7d6341c7c47:0x74dac1f2c0739f42!2sSrinivasa+Refrigeration+Works!8m2!3d17.3507181!4d82.5496046!16s%2Fg%2F11f630f0hc!3m5!1s0x3a39c7d6341c7c47:0x74dac1f2c0739f42!8m2!3d17.3507181!4d82.5496046!16s%2Fg%2F11f630f0hc",
            details: ["Veeravara Peta, Opp. Fish Market", "Pentakota Road, Tuni – 533401"]
        },
        {
            icon: <Business sx={{ color: '#4fc3f7', fontSize: { xs: 28, sm: 34, md: 40 } }} />,
            title: "Service Area",
            details: ["Tuni & Surrounding Areas", "Emergency Service Available"]
        }
    ];

    const locationInfo = businessInfo.find(info => info.isEmbeddedMap);

    return (
        <Box
            id="contact"
            component="section"
            sx={{
                backgroundColor: "#051120",
                color: "#ffffff",
                position: "relative",
                overflow: "hidden"
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `
                        radial-gradient(circle at 20% 20%, rgba(79, 195, 247, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(79, 195, 247, 0.06) 0%, transparent 50%),
                        linear-gradient(45deg, transparent 49%, rgba(79, 195, 247, 0.02) 50%, transparent 51%)
                    `,
                    zIndex: 0
                }}
            />

            <Container
                maxWidth="xl"
                sx={{
                    py: { xs: 3, sm: 4, md: 6 },
                    px: { xs: 2, sm: 3, md: 4 },
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                    margin: "0 auto"
                }}
            >
                {/* Header Section */}
                <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 5, md: 8 }, maxWidth: '1400px', mx: 'auto' }}>
                    <Chip
                        label="Get In Touch"
                        sx={{
                            backgroundColor: 'rgba(79, 195, 247, 0.1)',
                            color: '#4fc3f7',
                            fontWeight: 600,
                            mb: { xs: 1.5, sm: 2 },
                            fontSize: { xs: '0.75rem', sm: '0.9rem', md: '1rem' },
                            letterSpacing: 1,
                            border: '1px solid rgba(79, 195, 247, 0.3)',
                            py: { xs: 0.5, sm: 0.75, md: 1 },
                            px: { xs: 2, sm: 2.5, md: 3 }
                        }}
                    />
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            mb: { xs: 2, sm: 2.5, md: 4 },
                            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.5rem' },
                            lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
                            background: 'linear-gradient(135deg, #ffffff 0%, #4fc3f7 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            px: { xs: 1, sm: 2, md: 0 }
                        }}
                    >
                        Contact Our Expert Team
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            maxWidth: { xs: "100%", sm: "600px", md: "800px" },
                            mx: "auto",
                            lineHeight: 1.6,
                            fontWeight: 400,
                            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                            px: { xs: 1, sm: 2, md: 0 }
                        }}
                    >
                        Ready to solve your cooling problems? Reach out to us for professional service
                        and quick solutions.
                    </Typography>
                </Box>

                {/* Business Title Card */}
                <Paper
                    elevation={0}
                    sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(79, 195, 247, 0.2)",
                        borderRadius: { xs: 2, sm: 2.5, md: 3 },
                        p: { xs: 2.5, sm: 3.5, md: 5 },
                        mb: { xs: 3, sm: 4, md: 6 },
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        maxWidth: '1400px',
                        mx: 'auto'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #10b981, #4fc3f7, #e11d48)',
                            borderRadius: { xs: '2px 2px 0 0', sm: '2.5px 2.5px 0 0', md: '3px 3px 0 0' }
                        }}
                    />
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: '1.5rem', sm: '2.2rem', md: '2.8rem' },
                            lineHeight: { xs: 1.3, sm: 1.4, md: 1.5 },
                            background: 'linear-gradient(135deg, #4fc3f7 0%, #ffffff 50%, #4fc3f7 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: { xs: 0.5, sm: 0.75, md: 1 }
                        }}
                    >
                        Srinivasa Refrigeration Works
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontStyle: 'italic',
                            fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.3rem' }
                        }}
                    >
                        Your Trusted Cooling Solution Partner
                    </Typography>
                </Paper>

                {/* Contact Methods */}
                <Box sx={{ mb: { xs: 4, sm: 5, md: 8 } }}>
                    <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                            fontWeight: 600,
                            mb: { xs: 3, sm: 3.5, md: 5 },
                            textAlign: 'center',
                            color: '#4fc3f7',
                            fontSize: { xs: '1.25rem', sm: '1.6rem', md: '2rem' }
                        }}
                    >
                        Contact Methods
                    </Typography>

                    <Grid
                        container
                        spacing={{ xs: 2, sm: 3, md: 4 }}
                        sx={{
                            justifyContent: 'center',
                            maxWidth: '1400px',
                            mx: 'auto'
                        }}
                    >
                        {contactMethods.map((method, index) => (
                            <Grid
                                size={{
                                    xs: 6,
                                    lg: 4
                                }}
                                key={index}
                            >
                                <Card
                                    component="a"
                                    href={method.href}
                                    sx={{
                                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                                        backdropFilter: "blur(15px)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        borderRadius: { xs: 3, sm: 3.5, md: 4 },
                                        textDecoration: "none",
                                        color: "inherit",
                                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                        cursor: "pointer",
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        height: { xs: '280px', sm: '320px', md: 'auto' }, // Fixed heights for smaller devices
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: '-100%',
                                            width: '100%',
                                            height: '100%',
                                            background: method.gradient,
                                            opacity: 0,
                                            transition: 'all 0.4s ease',
                                            zIndex: 0
                                        },
                                        '&:hover': {
                                            transform: { xs: "none", sm: "translateY(-8px)", md: "translateY(-12px)" },
                                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                                            border: `1px solid ${method.color}40`,
                                            boxShadow: {
                                                xs: `0 8px 25px -8px ${method.color}30`,
                                                sm: `0 20px 40px -12px ${method.color}30`,
                                                md: `0 25px 50px -12px ${method.color}30`
                                            },
                                            '&::before': {
                                                left: 0,
                                                opacity: 0.05
                                            }
                                        },
                                        '&:active': {
                                            transform: { xs: "scale(0.98)", sm: "translateY(-4px) scale(0.98)" }
                                        }
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            p: { xs: 2, sm: 3, md: 4.5 },
                                            textAlign: 'center',
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'relative',
                                            zIndex: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                background: method.gradient,
                                                color: "#fff",
                                                p: { xs: 1.5, sm: 2, md: 3 },
                                                borderRadius: '50%',
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: { xs: 50, sm: 70, md: 90 },
                                                height: { xs: 50, sm: 70, md: 90 },
                                                mb: { xs: 1.5, sm: 2, md: 3 },
                                                boxShadow: `0 8px 32px ${method.color}40`,
                                                position: 'relative',
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    inset: -2,
                                                    borderRadius: '50%',
                                                    background: method.gradient,
                                                    zIndex: -1,
                                                    filter: 'blur(8px)',
                                                    opacity: 0.3
                                                }
                                            }}
                                        >
                                            {method.icon}
                                        </Box>

                                        <Stack
                                            spacing={{ xs: 1, sm: 1.5, md: 2 }}
                                            alignItems="center"
                                            sx={{ width: '100%' }}
                                        >
                                            <Typography
                                                variant="h6"
                                                component="h4"
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                                                    color: '#ffffff'
                                                }}
                                            >
                                                {method.title}
                                            </Typography>

                                            <Chip
                                                label={method.subtitle}
                                                size={isSmallMobile ? "small" : "medium"}
                                                sx={{
                                                    backgroundColor: `${method.color}20`,
                                                    color: method.color,
                                                    fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
                                                    fontWeight: 500,
                                                    border: `1px solid ${method.color}40`,
                                                    height: { xs: '20px', sm: '24px', md: '32px' }
                                                }}
                                            />

                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.1rem' },
                                                    wordBreak: 'break-word',
                                                    textAlign: 'center',
                                                    lineHeight: 1.4,
                                                    color: 'rgba(255, 255, 255, 0.9)',
                                                    mt: { xs: 0.5, sm: 0.75, md: 1 },
                                                    px: { xs: 0.5, sm: 0.5 }
                                                }}
                                            >
                                                {method.value}
                                            </Typography>
                                        </Stack>

                                        <Button
                                            endIcon={<ArrowForward sx={{ fontSize: { xs: 12, sm: 14, md: 18 } }} />}
                                            sx={{
                                                mt: { xs: 1, sm: 1.5, md: 2.5 },
                                                color: method.color,
                                                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.95rem' },
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                minHeight: { xs: '32px', sm: '36px', md: '44px' },
                                                px: { xs: 1.5, sm: 2, md: 3 },
                                                '&:hover': {
                                                    backgroundColor: `${method.color}10`
                                                }
                                            }}
                                        >
                                            Connect Now
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Divider
                    sx={{
                        mb: { xs: 3, sm: 3.5, md: 6 },
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        '&::before, &::after': {
                            borderColor: 'rgba(79, 195, 247, 0.3)'
                        }
                    }}
                />

                {/* Business Info */}
                <Box sx={{ mb: { xs: 4, sm: 5, md: 8 } }}>
                    <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                            fontWeight: 600,
                            mb: { xs: 3, sm: 3.5, md: 5 },
                            textAlign: 'center',
                            color: '#4fc3f7',
                            fontSize: { xs: '1.25rem', sm: '1.6rem', md: '2rem' }
                        }}
                    >
                        Business Info
                    </Typography>
                    <Grid
                        container
                        spacing={{ xs: 2, sm: 3, md: 4 }}
                        sx={{
                            justifyContent: 'center',
                            maxWidth: '1400px',
                            mx: 'auto'
                        }}
                    >
                        {businessInfo.map((info, index) => (
                            <Grid
                                size={{
                                    xs: 6,
                                    md: 4
                                }}
                                key={index}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        gap: { xs: 1.5, sm: 2, md: 3 },
                                        p: { xs: 2, sm: 3, md: 5 },
                                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                                        borderRadius: { xs: 2, sm: 2.5, md: 3 },
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        transition: "all 0.3s ease",
                                        height: { xs: '220px', sm: '240px', md: '260px' }, // Fixed heights for consistency
                                        justifyContent: 'center',
                                        '&:hover': {
                                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                                            border: "1px solid rgba(79, 195, 247, 0.2)",
                                            transform: { xs: "none", sm: "translateY(-2px)", md: "translateY(-4px)" }
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: 'rgba(79, 195, 247, 0.1)',
                                            borderRadius: '50%',
                                            p: { xs: 1.5, sm: 2, md: 3 },
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: { xs: 50, sm: 70, md: 90 },
                                            height: { xs: 50, sm: 70, md: 90 }
                                        }}
                                    >
                                        {info.icon}
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                mb: { xs: 1, sm: 1.5, md: 2.5 },
                                                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.4rem' }
                                            }}
                                        >
                                            {info.title}
                                        </Typography>
                                        {info.details.map((detail, idx) => (
                                            <Typography
                                                key={idx}
                                                variant="body1"
                                                sx={{
                                                    color: "rgba(255, 255, 255, 0.8)",
                                                    lineHeight: 1.4,
                                                    mb: idx < info.details.length - 1 ? 0.25 : 0,
                                                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.1rem' }
                                                }}
                                            >
                                                {detail}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Map Section */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '1200px',
                            height: { xs: 250, sm: 300, md: 350 },
                            borderRadius: { xs: 1.5, sm: 2, md: 2 },
                            overflow: 'hidden',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                            border: '2px solid rgba(79, 195, 247, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                border: '2px solid rgba(79, 195, 247, 0.4)',
                                boxShadow: '0 12px 40px rgba(79, 195, 247, 0.2)'
                            }
                        }}
                    >
                        {locationInfo && (
                            <iframe
                                src={locationInfo.embedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Srinivasa Refrigeration Works Location"
                            />
                        )}
                    </Box>
                </Box>

                {/* Google Maps Link */}
                <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 3.5, md: 4 } }}>
                    {locationInfo && (
                        <Typography
                            component="a"
                            href={locationInfo.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: '#4fc3f7',
                                textDecoration: 'none',
                                fontSize: { xs: '0.95rem', sm: '1rem', md: '1rem' },
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                p: { xs: 1, sm: 1.5 },
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    textDecoration: 'underline',
                                    color: '#29b6f6',
                                    backgroundColor: 'rgba(79, 195, 247, 0.05)'
                                }
                            }}
                        >
                            View in Google Maps →
                        </Typography>
                    )}
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        pt: { xs: 2.5, sm: 3, md: 3 },
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                        textAlign: "center"
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            mb: { xs: 1, sm: 1.25, md: 1.5 },
                            lineHeight: 1.7,
                            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                            px: { xs: 1, sm: 2, md: 0 }
                        }}
                    >
                        Thank you for choosing{" "}
                        <Typography
                            component="span"
                            sx={{ color: "#4fc3f7", fontWeight: 600 }}
                        >
                            Srinivasa Refrigeration Works
                        </Typography>
                        . Your satisfaction is our commitment, and your comfort is our priority.
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "rgba(255, 255, 255, 0.6)",
                            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' }
                        }}
                    >
                        © 2024 Srinivasa Refrigeration Works. Serving Tuni with excellence since 1998.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default ContactUs;