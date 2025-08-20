import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Lock } from '@mui/icons-material';

const Unauthorized = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            px: 3,
            gap: 3
        }}>
            <Lock sx={{
                fontSize: 80,
                color: '#f44336',
                mb: 2
            }} />

            <Typography variant="h3" component="h1" sx={{
                fontWeight: 'bold',
                color: '#333',
                mb: 1
            }}>
                403
            </Typography>

            <Typography variant="h5" component="h2" sx={{
                color: '#666',
                mb: 1
            }}>
                Access Denied
            </Typography>

            <Typography variant="body1" sx={{
                color: '#888',
                maxWidth: 500,
                mb: 3
            }}>
                You don't have permission to access this page.
                Please contact your administrator if you believe this is an error.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                    variant="contained"
                    onClick={handleGoHome}
                    sx={{
                        backgroundColor: '#4fc3f7',
                        '&:hover': {
                            backgroundColor: '#29b6f6'
                        }
                    }}
                >
                    Go Home
                </Button>

                <Button
                    variant="outlined"
                    onClick={handleGoBack}
                    sx={{
                        borderColor: '#4fc3f7',
                        color: '#4fc3f7',
                        '&:hover': {
                            borderColor: '#29b6f6',
                            backgroundColor: 'rgba(79, 195, 247, 0.04)'
                        }
                    }}
                >
                    Go Back
                </Button>
            </Box>
        </Box>
    );
};

export default Unauthorized;