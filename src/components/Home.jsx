import { Handyman, Star, Phone, Schedule } from "@mui/icons-material";
import { Box, Typography, Button, Container, Grid, Card, CardContent } from "@mui/material";

const Home = () => {
    const features = [
        {
            icon: <Star sx={{ fontSize: 40, color: '#4fc3f7' }} />,
            title: "25+ Years",
            subtitle: "Trusted Experience"
        },
        {
            icon: <Schedule sx={{ fontSize: 40, color: '#4fc3f7' }} />,
            title: "Same Day",
            subtitle: "Service Available"
        },
        {
            icon: <Phone sx={{ fontSize: 40, color: '#4fc3f7' }} />,
            title: "24/7",
            subtitle: "Customer Support"
        }
    ];

    return (
        <Box id="home">
            <Box
                sx={{
                    position: 'relative',
                    backgroundImage: `linear-gradient(rgba(5, 17, 32, 0.7), rgba(5, 17, 32, 0.5)), url('/bg-image-01.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    overflow: 'hidden',
                    pt: { xs: 8, md: 10 }
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 20% 80%, rgba(79, 195, 247, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(79, 195, 247, 0.05) 0%, transparent 50%)',
                        animation: 'pulse 4s ease-in-out infinite alternate'
                    }}
                />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <Grid container spacing={4} alignItems="center" justifyContent="center">
                        <Grid item xs={12} lg={10} xl={8}>
                            <Box sx={{
                                textAlign: 'center',
                                px: { xs: 2, md: 4 },
                                py: { xs: 4, md: 6 }
                            }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: '#4fc3f7',
                                        fontWeight: 600,
                                        mb: 3,
                                        textTransform: 'uppercase',
                                        letterSpacing: 2,
                                        fontSize: { xs: '0.9rem', md: '1.1rem' }
                                    }}
                                >
                                    Professional Refrigeration Services
                                </Typography>

                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontWeight: 800,
                                        mb: 4,
                                        fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem', lg: '4.5rem' },
                                        lineHeight: { xs: 1.1, md: 1.2 },
                                        textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)",
                                        background: 'linear-gradient(45deg, #ffffff 30%, #4fc3f7 90%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        maxWidth: { xs: '100%', md: '900px' },
                                        mx: 'auto'
                                    }}
                                >
                                    Expert AC & Refrigerator Solutions
                                </Typography>

                                <Typography
                                    variant="h5"
                                    sx={{
                                        mb: 5,
                                        opacity: 0.9,
                                        fontWeight: 400,
                                        fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                                        maxWidth: { xs: '100%', md: '700px' },
                                        mx: 'auto',
                                        lineHeight: 1.4,
                                        px: { xs: 1, md: 0 }
                                    }}
                                >
                                    Professional repair, maintenance & installation services you can trust.
                                    Quick response, quality work, fair pricing.
                                </Typography>

                                <Box sx={{
                                    display: 'flex',
                                    gap: { xs: 2, md: 3 },
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    maxWidth: '600px',
                                    mx: 'auto'
                                }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        endIcon={<Phone />}
                                        href="#contact"
                                        sx={{
                                            backgroundColor: "#4fc3f7",
                                            color: "#051120",
                                            fontWeight: 700,
                                            fontSize: { xs: '1rem', md: '1.1rem' },
                                            px: { xs: 3, md: 4 },
                                            py: { xs: 1.5, md: 2 },
                                            borderRadius: 3,
                                            textTransform: "none",
                                            boxShadow: "0 8px 32px rgba(79, 195, 247, 0.3)",
                                            border: "2px solid transparent",
                                            transition: "all 0.3s ease",
                                            minWidth: { xs: '280px', sm: 'auto' },
                                            '&:hover': {
                                                backgroundColor: "transparent",
                                                color: "#4fc3f7",
                                                border: "2px solid #4fc3f7",
                                                transform: "translateY(-3px)",
                                                boxShadow: "0 12px 40px rgba(79, 195, 247, 0.4)"
                                            }
                                        }}
                                    >
                                        Call Now: +91 85559 76776
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        size="large"
                                        endIcon={<Handyman />}
                                        href="#about"
                                        sx={{
                                            color: "#ffffff",
                                            borderColor: "rgba(255, 255, 255, 0.5)",
                                            fontWeight: 600,
                                            fontSize: { xs: '1rem', md: '1.1rem' },
                                            px: { xs: 3, md: 4 },
                                            py: { xs: 1.5, md: 2 },
                                            borderRadius: 3,
                                            textTransform: "none",
                                            borderWidth: 2,
                                            transition: "all 0.3s ease",
                                            minWidth: { xs: '280px', sm: 'auto' },
                                            '&:hover': {
                                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                                borderColor: "#ffffff",
                                                transform: "translateY(-3px)"
                                            }
                                        }}
                                    >
                                        Learn More
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box
                sx={{
                    backgroundColor: "#051120",
                    py: { xs: 6, md: 8 },
                    position: 'relative',
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #4fc3f7, transparent)'
                    }
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                                        backdropFilter: "blur(10px)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        borderRadius: 3,
                                        transition: "all 0.3s ease",
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        '&:hover': {
                                            transform: "translateY(-10px)",
                                            backgroundColor: "rgba(79, 195, 247, 0.1)",
                                            border: "1px solid rgba(79, 195, 247, 0.3)",
                                            boxShadow: "0 20px 40px rgba(79, 195, 247, 0.2)"
                                        }
                                    }}
                                >
                                    <CardContent sx={{
                                        textAlign: 'center',
                                        py: { xs: 4, md: 5 },
                                        px: { xs: 3, md: 4 },
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Box sx={{
                                            mb: 3,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {feature.icon}
                                        </Box>
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                color: '#ffffff',
                                                fontWeight: 700,
                                                mb: 1.5,
                                                fontSize: { xs: '1.8rem', md: '2.125rem' }
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.8)',
                                                fontWeight: 500,
                                                fontSize: { xs: '0.95rem', md: '1rem' },
                                                lineHeight: 1.4
                                            }}
                                        >
                                            {feature.subtitle}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <style jsx>{`
                @keyframes pulse {
                    0% { opacity: 0.4; }
                    100% { opacity: 0.8; }
                }
            `}</style>
        </Box>
    );
};

export default Home;