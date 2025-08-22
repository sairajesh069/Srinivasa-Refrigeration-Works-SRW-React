import React from "react";
import { Box, Typography, Container, Grid, Card, CardContent } from "@mui/material";
import { CheckCircle, Engineering, ThumbUp, Speed } from "@mui/icons-material";

const AboutUs = () => {
    const highlights = [
        {
            icon: <Engineering sx={{ fontSize: 40, color: '#4fc3f7' }} />,
            title: "Expert Technicians",
            description: "Certified professionals with extensive training"
        },
        {
            icon: <Speed sx={{ fontSize: 40, color: '#4fc3f7' }} />,
            title: "Quick Response",
            description: "Same-day service available for urgent repairs"
        },
        {
            icon: <CheckCircle sx={{ fontSize: 40, color: '#4fc3f7' }} />,
            title: "Quality Guaranteed",
            description: "All work backed by our satisfaction guarantee"
        },
        {
            icon: <ThumbUp sx={{ fontSize: 40, color: '#4fc3f7' }} />,
            title: "Trusted Service",
            description: "Serving Tuni community with integrity since 1998"
        }
    ];

    return (
        <Box
            id="about"
            sx={{
                backgroundColor: "#f8fafc",
                position: "relative",
                overflow: "hidden",
                minHeight: "100vh"
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `radial-gradient(circle at 20% 20%, rgba(79, 195, 247, 0.05) 0%, transparent 50%),
                                      radial-gradient(circle at 80% 80%, rgba(5, 17, 32, 0.05) 0%, transparent 50%)`,
                    zIndex: 0
                }}
            />

            <Container maxWidth="lg" sx={{ py: 5, position: "relative", zIndex: 1 }}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
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
                        About Our Company
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
                        Your Trusted Cooling Experts
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
                        Over 25 years of excellence in refrigeration services,
                        delivering reliable solutions to homes and businesses across Tuni.
                    </Typography>
                </Box>
                <Box sx={{
                    pr: { lg: 4 },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: "center"
                }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "#051120",
                            mb: 3,
                            fontSize: { xs: '1.8rem', md: '2.2rem' }
                        }}
                    >
                        Excellence in Every Service Call
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: "#475569",
                            lineHeight: 1.8,
                            fontSize: "1.1rem",
                            mb: 4
                        }}
                    >
                        <strong>Since 1998, Srinivasa Refrigeration Works</strong> has been the cornerstone
                        of refrigeration services in Tuni. Our journey began with a simple mission: to provide
                        reliable, professional, and affordable cooling solutions to every customer.
                        <br />
                        What sets us apart is our unwavering commitment to quality workmanship and customer
                        satisfaction. Our team of skilled technicians brings decades of combined experience
                        to every repair, installation, and maintenance service.
                        <br />
                        We believe in transparency, fair pricing, and building lasting relationships with our
                        community. When you choose us, you're not just getting a service provider – you're
                        partnering with cooling experts who truly care about your comfort and satisfaction.
                    </Typography>

                    <Grid container spacing={4}
                          sx={{
                              textAlign: "center",
                              justifyContent: "center"
                          }}
                    >
                        {highlights.map((highlight, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        backgroundColor: "rgba(79, 195, 247, 0.05)",
                                        border: "1px solid rgba(79, 195, 247, 0.2)",
                                        borderRadius: 2,
                                        transition: "all 0.3s ease",
                                        height: "100%",
                                        '&:hover': {
                                            transform: "translateY(-5px)",
                                            boxShadow: "0 10px 30px rgba(79, 195, 247, 0.2)"
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3, height: "100%" }}>
                                        <Box sx={{ mb: 2 }}>
                                            {highlight.icon}
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: "#051120",
                                                mb: 1
                                            }}
                                        >
                                            {highlight.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#64748b",
                                                lineHeight: 1.5
                                            }}
                                        >
                                            {highlight.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutUs;