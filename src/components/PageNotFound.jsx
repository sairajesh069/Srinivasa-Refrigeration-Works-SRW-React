import React from "react";
import { Box, Typography, Button } from '@mui/material';
import {useNavigate} from "react-router-dom";

const PageNotFound = () => {

    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}
        >
            <Typography
                variant="h1"
                sx={{
                    fontSize: '4rem',
                    color: '#4fc3f7',
                    margin: 0
                }}
            >
                404
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontSize: '1.2rem',
                    color: '#7f8c8d',
                    margin: '1rem 0'
                }}
            >
                Page not found
            </Typography>
            <Button
                onClick={() => navigate(-1)}
                sx={{
                    padding: '12px 24px',
                    backgroundColor: '#4fc3f7',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': {
                        backgroundColor: '#29b6f6'
                    }
                }}
            >
                Go Back
            </Button>
        </Box>
    );
}

export default PageNotFound;