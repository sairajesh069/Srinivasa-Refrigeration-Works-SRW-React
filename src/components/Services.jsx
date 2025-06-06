import React from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    Button
} from "@mui/material";
import {
    CheckCircle,
    Phone
} from "@mui/icons-material";

const Services = () => {
    const services = [
        {
            id: 1,
            title: "Refrigerator Repair",
            subtitle: "All Brands Serviced",
            image: "/refrigerator-repair-img.jpg",
            description: "Expert repair services for all refrigerator brands including Samsung, LG, Whirlpool, Godrej, and more. From cooling issues to compressor problems, we handle it all.",
            features: [
                "Cooling system repairs",
                "Compressor replacement",
                "Thermostat calibration",
                "Ice maker repairs"
            ]
        },
        {
            id: 2,
            title: "Air Conditioner Service",
            subtitle: "All Brands Serviced",
            image: "/ac-repair-img.jpg",
            description: "Complete AC repair and maintenance for all brands including Voltas, Blue Star, Daikin, Carrier, and others. Installation, repair, and regular servicing available.",
            features: [
                "AC installation & uninstallation",
                "Gas filling & leak detection",
                "Compressor repairs",
                "Regular maintenance"
            ]
        }
    ];

    return (
        <Box
            id="services"
            sx={{
                backgroundColor: "#ffffff",
                position: "relative",
                overflow: "hidden",
                minHeight: "100vh",
                py: 8
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `radial-gradient(circle at 20% 20%, rgba(79, 195, 247, 0.03) 0%, transparent 50%),
                                      radial-gradient(circle at 80% 80%, rgba(5, 17, 32, 0.03) 0%, transparent 50%)`,
                    zIndex: 0
                }}
            />

            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                <Box sx={{ textAlign: "center", mb: 8 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#4fc3f7',
                            fontWeight: 600,
                            mb: 2,
                            textTransform: 'uppercase',
                            letterSpacing: 2
                        }}
                    >
                        Our Services
                    </Typography>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            color: "#051120",
                            mb: 3,
                            fontSize: { xs: '2rem', md: '3rem' }
                        }}
                    >
                        Professional Cooling Solutions
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#64748b",
                            maxWidth: "600px",
                            mx: "auto",
                            lineHeight: 1.6
                        }}
                    >
                        Comprehensive repair and maintenance services for all your
                        refrigeration and air conditioning needs.
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
                    <Grid
                        container
                        spacing={4}
                        sx={{
                            maxWidth: '1200px',
                            justifyContent: 'center',
                            alignItems: 'stretch'
                        }}
                    >
                        {services.map((service) => (
                            <Grid item xs={12} md={6} lg={5} key={service.id}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        backgroundColor: "#ffffff",
                                        border: "1px solid rgba(79, 195, 247, 0.2)",
                                        borderRadius: 4,
                                        overflow: "hidden",
                                        transition: "all 0.3s ease",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        maxWidth: '500px',
                                        mx: 'auto',
                                        '&:hover': {
                                            transform: "translateY(-8px)",
                                            boxShadow: "0 20px 60px rgba(79, 195, 247, 0.15)",
                                            border: "1px solid rgba(79, 195, 247, 0.4)"
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: "relative",
                                            width: "100%",
                                            height: 450,
                                            backgroundImage: `url(${service.image})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            backgroundRepeat: "no-repeat",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            '&::before': {
                                                content: '""',
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: "linear-gradient(135deg, rgba(5, 17, 32, 0.7) 0%, rgba(79, 195, 247, 0.3) 100%)",
                                                zIndex: 1
                                            }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: "relative",
                                                zIndex: 2,
                                                textAlign: "center",
                                                color: "white",
                                                px: 4
                                            }}
                                        >
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    fontWeight: 800,
                                                    mb: 1,
                                                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                                                    fontSize: { xs: '1.8rem', md: '2.2rem' }
                                                }}
                                            >
                                                {service.title}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: "#4fc3f7",
                                                    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                                                    mb: 2
                                                }}
                                            >
                                                {service.subtitle}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    maxWidth: "400px",
                                                    mx: "auto",
                                                    lineHeight: 1.6,
                                                    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                                                    fontSize: { xs: '0.9rem', md: '1rem' }
                                                }}
                                            >
                                                {service.description}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <CardContent sx={{ p: 4, flex: 1, display: "flex", flexDirection: "column" }}>
                                        <Box sx={{ mb: 3, flex: 1 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "#051120",
                                                    mb: 3,
                                                    textAlign: "center"
                                                }}
                                            >
                                                What We Offer:
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {service.features.map((feature, index) => (
                                                    <Grid item xs={12} sm={6} key={index}>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "space-evenly",
                                                                gap: 1.5,
                                                                p: 1.5,
                                                                backgroundColor: "rgba(79, 195, 247, 0.05)",
                                                                borderRadius: 2,
                                                                border: "1px solid rgba(79, 195, 247, 0.1)",
                                                                transition: "all 0.3s ease",
                                                                '&:hover': {
                                                                    backgroundColor: "rgba(79, 195, 247, 0.1)",
                                                                    transform: "translateX(5px)"
                                                                }
                                                            }}
                                                        >
                                                            <CheckCircle
                                                                sx={{
                                                                    fontSize: 20,
                                                                    color: "#4fc3f7",
                                                                    flexShrink: 0
                                                                }}
                                                            />
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: "#64748b",
                                                                    fontWeight: 450
                                                                }}
                                                            >
                                                                {feature}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>

                                        <Box sx={{ textAlign: "center" }}>
                                            <Button
                                                variant="contained"
                                                size="large"
                                                endIcon={<Phone />}
                                                href="#contact"
                                                sx={{
                                                    backgroundColor: "#4fc3f7",
                                                    color: "#051120",
                                                    fontWeight: 700,
                                                    px: 4,
                                                    py: 2,
                                                    borderRadius: 3,
                                                    textTransform: "none",
                                                    fontSize: "1.1rem",
                                                    boxShadow: "0 8px 32px rgba(79, 195, 247, 0.3)",
                                                    transition: "all 0.3s ease",
                                                    '&:hover': {
                                                        backgroundColor: "#051120",
                                                        color: "#4fc3f7",
                                                        transform: "translateY(-3px)",
                                                        boxShadow: "0 12px 40px rgba(79, 195, 247, 0.4)"
                                                    }
                                                }}
                                            >
                                                Get Service Now
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ textAlign: "center", mt: 8 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600,
                            color: "#051120",
                            mb: 3
                        }}
                    >
                        Need Emergency Repair Service?
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#64748b",
                            mb: 4,
                            maxWidth: "500px",
                            mx: "auto"
                        }}
                    >
                        Don't let a broken appliance disrupt your day. Contact us now for
                        fast, reliable service you can trust.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<Phone />}
                        href="tel:+918555976776"
                        sx={{
                            backgroundColor: "#4fc3f7",
                            color: "#051120",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            px: 4,
                            py: 2,
                            borderRadius: 3,
                            textTransform: "none",
                            boxShadow: "0 8px 32px rgba(79, 195, 247, 0.3)",
                            transition: "all 0.3s ease",
                            '&:hover': {
                                backgroundColor: "#051120",
                                color: "#4fc3f7",
                                transform: "translateY(-3px)",
                                boxShadow: "0 12px 40px rgba(79, 195, 247, 0.4)"
                            }
                        }}
                    >
                        Call Now: +91 85559 76776
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default Services;