import React from 'react';
import { Phone, WhatsApp, Email, LocationOn, Schedule, Business, ArrowForward } from '@mui/icons-material';
import { Box, Typography, Card, CardContent, Container, Grid, Button, Chip, Divider, Paper, Stack } from "@mui/material";

const ContactUs = () => {
    const contactMethods = [
        {
            icon: <Phone sx={{ fontSize: 28 }} />,
            title: "Call Us",
            subtitle: "Immediate assistance",
            value: "+91 85559 76776",
            href: "tel:+918555976776",
            color: "#10b981",
            hoverColor: "#059669",
            gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
        },
        {
            icon: <WhatsApp sx={{ fontSize: 28 }} />,
            title: "WhatsApp",
            subtitle: "Quick messaging",
            value: "Chat with us",
            href: "https://wa.me/+918555976776",
            color: "#25D366",
            hoverColor: "#128C7E",
            gradient: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)"
        },
        {
            icon: <Email sx={{ fontSize: 28 }} />,
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
            icon: <Schedule sx={{ color: '#4fc3f7', fontSize: 40 }} />,
            title: "Business Hours",
            details: ["Sunday to Saturday", "9:00 AM – 8:30 PM"]
        },
        {
            icon: <LocationOn sx={{ color: '#4fc3f7', fontSize: 40 }} />,
            title: "Our Location",
            isEmbeddedMap: true,
            embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.8947567891234!2d82.54702971484!3d17.35071878088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39c7d6341c7c47%3A0x74dac1f2c0739f42!2sSrinivasa%20Refrigeration%20Works!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin",
            href: "https://www.google.com/maps/place/Srinivasa+Refrigeration+Works/@17.3507181,82.5470297,17z/data=!4m14!1m7!3m6!1s0x3a39c7d6341c7c47:0x74dac1f2c0739f42!2sSrinivasa+Refrigeration+Works!8m2!3d17.3507181!4d82.5496046!16s%2Fg%2F11f630f0hc!3m5!1s0x3a39c7d6341c7c47:0x74dac1f2c0739f42!8m2!3d17.3507181!4d82.5496046!16s%2Fg%2F11f630f0hc",
            details: ["Veeravara Peta, Opp. Fish Market", "Pentakota Road, Tuni – 533401"]
        },
        {
            icon: <Business sx={{ color: '#4fc3f7', fontSize: 40 }} />,
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
                overflow: "hidden",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center"
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
                maxWidth="lg"
                sx={{
                    py: { xs: 4, md: 6 },
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                    margin: "0 auto"
                }}
            >
                <Box sx={{ textAlign: "center", mb: 6 }}>
                    <Chip
                        label="Get In Touch"
                        sx={{
                            backgroundColor: 'rgba(79, 195, 247, 0.1)',
                            color: '#4fc3f7',
                            fontWeight: 600,
                            mb: 2,
                            fontSize: '0.9rem',
                            letterSpacing: 1,
                            border: '1px solid rgba(79, 195, 247, 0.3)',
                            py: 1
                        }}
                    />
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            mb: 3,
                            fontSize: { xs: '2rem', md: '3rem' },
                            background: 'linear-gradient(135deg, #ffffff 0%, #4fc3f7 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        Contact Our Expert Team
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            maxWidth: "600px",
                            mx: "auto",
                            lineHeight: 1.6,
                            fontWeight: 400
                        }}
                    >
                        Ready to solve your cooling problems? Reach out to us for professional service
                        and quick solutions.
                    </Typography>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(79, 195, 247, 0.2)",
                        borderRadius: 3,
                        p: { xs: 3, md: 4 },
                        mb: 6,
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
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
                            borderRadius: '3px 3px 0 0'
                        }}
                    />
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: '1.8rem', md: '2.5rem' },
                            background: 'linear-gradient(135deg, #4fc3f7 0%, #ffffff 50%, #4fc3f7 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1
                        }}
                    >
                        Srinivasa Refrigeration Works
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontStyle: 'italic',
                            fontSize: '1.1rem'
                        }}
                    >
                        Your Trusted Cooling Solution Partner
                    </Typography>
                </Paper>

                <Box sx={{ mb: 6 }}>
                    <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                            fontWeight: 600,
                            mb: 4,
                            textAlign: 'center',
                            color: '#4fc3f7',
                            fontSize: { xs: '1.5rem', md: '1.8rem' }
                        }}
                    >
                        Contact Methods
                    </Typography>

                    <Grid
                        container
                        spacing={3}
                        sx={{
                            justifyContent: 'center',
                            maxWidth: '1200px',
                            mx: 'auto'
                        }}
                    >
                        {contactMethods.map((method, index) => (
                            <Grid xs={12} sm={6} lg={4} key={index}>
                                <Card
                                    component="a"
                                    href={method.href}
                                    sx={{
                                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                                        backdropFilter: "blur(15px)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        borderRadius: 4,
                                        textDecoration: "none",
                                        color: "inherit",
                                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                        cursor: "pointer",
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        overflow: 'hidden',
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
                                            transform: "translateY(-12px)",
                                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                                            border: `1px solid ${method.color}40`,
                                            boxShadow: `0 25px 50px -12px ${method.color}30`,
                                            '&::before': {
                                                left: 0,
                                                opacity: 0.05
                                            }
                                        }
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            p: { xs: 3, sm: 4 },
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
                                                p: 2.5,
                                                borderRadius: '50%',
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: 80,
                                                height: 80,
                                                mb: 3,
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

                                        <Stack spacing={1.5} alignItems="center">
                                            <Typography
                                                variant="h6"
                                                component="h4"
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: '1.25rem',
                                                    color: '#ffffff'
                                                }}
                                            >
                                                {method.title}
                                            </Typography>

                                            <Chip
                                                label={method.subtitle}
                                                size="small"
                                                sx={{
                                                    backgroundColor: `${method.color}20`,
                                                    color: method.color,
                                                    fontSize: '0.8rem',
                                                    fontWeight: 500,
                                                    border: `1px solid ${method.color}40`
                                                }}
                                            />

                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: '1rem',
                                                    wordBreak: 'break-word',
                                                    textAlign: 'center',
                                                    lineHeight: 1.4,
                                                    color: 'rgba(255, 255, 255, 0.9)',
                                                    mt: 1
                                                }}
                                            >
                                                {method.value}
                                            </Typography>
                                        </Stack>

                                        <Button
                                            endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                                            sx={{
                                                mt: 2,
                                                color: method.color,
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                textTransform: 'none',
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
                        mb: 4,
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        '&::before, &::after': {
                            borderColor: 'rgba(79, 195, 247, 0.3)'
                        }
                    }}
                />
                    <Box sx={{ mb: 6 }}>
                        <Typography
                            variant="h5"
                            component="h3"
                            sx={{
                                fontWeight: 600,
                                mb: 4,
                                textAlign: 'center',
                                color: '#4fc3f7',
                                fontSize: { xs: '1.5rem', md: '1.8rem' }
                            }}
                        >
                        Business Info
                    </Typography>
                    <Grid
                        container
                        spacing={3}
                        sx={{
                            justifyContent: 'center',
                            maxWidth: '1200px',
                            mx: 'auto'
                        }}
                    >
                        {businessInfo.map((info, index) => (
                            <Grid xs={12} md={4} key={index}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        gap: 3,
                                        p: 4,
                                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                                        borderRadius: 3,
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        transition: "all 0.3s ease",
                                        height: '240px',
                                        justifyContent: 'center',
                                        '&:hover': {
                                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                                            border: "1px solid rgba(79, 195, 247, 0.2)",
                                            transform: "translateY(-4px)"
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: 'rgba(79, 195, 247, 0.1)',
                                            borderRadius: '50%',
                                            p: 2.5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 80,
                                            height: 80
                                        }}
                                    >
                                        {info.icon}
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 2,
                                                fontSize: '1.2rem'
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
                                                    lineHeight: 1.6,
                                                    mb: idx < info.details.length - 1 ? 0.5 : 0,
                                                    fontSize: '1rem'
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

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '1000px',
                            height: 300,
                            borderRadius: 2,
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

                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    {locationInfo && (
                        <Typography
                            component="a"
                            href={locationInfo.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: '#4fc3f7',
                                textDecoration: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                '&:hover': {
                                    textDecoration: 'underline',
                                    color: '#29b6f6'
                                }
                            }}
                        >
                            📍 View in Google Maps →
                        </Typography>
                    )}
                </Box>

                <Box
                    sx={{
                        pt: 3,
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                        textAlign: "center"
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            mb: 1.5,
                            lineHeight: 1.7,
                            fontSize: '1.1rem'
                        }}
                    >
                        Thank you for choosing{" "}
                        <Typography
                            component="span"
                            sx={{ color: "#4fc3f7", fontWeight: 600 }}
                        >
                            Srinivasa Refrigeration Works
                        </Typography>
                        .<br />
                        Your satisfaction is our commitment, and your comfort is our priority.
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "rgba(255, 255, 255, 0.6)",
                            fontSize: '0.95rem'
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