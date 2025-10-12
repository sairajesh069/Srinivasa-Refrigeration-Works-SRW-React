import React, { useState, useEffect, useRef } from 'react';
import { Box, InputAdornment, Link, CircularProgress } from '@mui/material';
import { VerifiedUser } from '@mui/icons-material';
import { toast } from 'react-toastify';
import StyledTextField from './StyledTextField.jsx';
import { useSendOtpMutation } from '../../reducers/otpApi.js';

const OTPField = ({
                      label = "OTP",
                      name,
                      value,
                      onChange,
                      error,
                      helperText,
                      disabled = false,
                      phoneNumber = '',
                      email = '',
                      verificationType,
                      customMarginBottom = '',
                      sx = {},
                      onOtpResponse
                  }) => {
    const [otpSent, setOtpSent] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [sendOtp, { isLoading }] = useSendOtpMutation();

    const isPhoneOTP = verificationType.toLowerCase() === 'phone';
    const identifier = isPhoneOTP ? phoneNumber : email;
    const prevIdentifierRef = useRef(identifier);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (prevIdentifierRef.current && prevIdentifierRef.current !== identifier) {

            const syntheticEvent = {
                target: { name, value: '' }
            };
            onChange(syntheticEvent);

            setOtpSent(false);
            setCooldown(0);

            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        prevIdentifierRef.current = identifier;
    }, [identifier, name, onChange]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleSendOTP = async () => {
        if (cooldown > 0 || isLoading) return;

        try {
            const response = await sendOtp(isPhoneOTP ? phoneNumber : email).unwrap();

            if (onOtpResponse) {
                onOtpResponse({
                    success: true,
                    data: response,
                    identifier: isPhoneOTP ? phoneNumber : email,
                    type: isPhoneOTP ? 'phone' : 'email'
                });
            }

            toast.success(`OTP sent successfully to your ${isPhoneOTP ? 'phone number' : 'email'}!`);
            setOtpSent(true);
            setCooldown(60);

            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            intervalRef.current = setInterval(() => {
                setCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        catch (error) {
            const errorMessage = error?.data?.message || 'Failed to send OTP. Please try again.';

            if (onOtpResponse) {
                onOtpResponse({
                    success: false,
                    error: error,
                    errorMessage: errorMessage,
                    identifier: isPhoneOTP ? phoneNumber : email,
                    type: isPhoneOTP ? 'phone' : 'email'
                });
            }
        }
    };

    const isPhoneOrEmailValid = isPhoneOTP
        ? /^\d{10}$/.test(phoneNumber)
        : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', ...sx }}>
            <StyledTextField
                fullWidth
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                error={error}
                helperText={helperText}
                variant="outlined"
                placeholder="Enter 6-digit OTP"
                disabled={disabled || !isPhoneOrEmailValid}
                autoComplete="off"
                sx={{ flex: 3, marginBottom: customMarginBottom && customMarginBottom }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <VerifiedUser sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                        </InputAdornment>
                    ),
                }}
            />
            <Box sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '56px',
                backgroundColor: isPhoneOrEmailValid && !isLoading && cooldown === 0
                    ? 'rgba(79, 195, 247, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)',
                border: '1px solid',
                borderColor: isPhoneOrEmailValid && !isLoading && cooldown === 0
                    ? 'rgba(79, 195, 247, 0.3)'
                    : 'rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                '&:hover': isPhoneOrEmailValid && !isLoading && cooldown === 0 ? {
                    backgroundColor: 'rgba(79, 195, 247, 0.1)',
                    borderColor: 'rgba(79, 195, 247, 0.5)',
                } : {}
            }}>
                {isLoading ? (
                    <CircularProgress size={20} sx={{ color: '#4fc3f7' }} />
                ) : (
                    <Link
                        component="button"
                        type="button"
                        onClick={handleSendOTP}
                        disabled={!isPhoneOrEmailValid || cooldown > 0}
                        sx={{
                            color: isPhoneOrEmailValid && cooldown === 0 ? '#4fc3f7' : '#7f8c8d',
                            fontWeight: 600,
                            fontSize: '13px',
                            textDecoration: 'none',
                            cursor: isPhoneOrEmailValid && cooldown === 0 ? 'pointer' : 'not-allowed',
                            pointerEvents: isPhoneOrEmailValid && cooldown === 0 ? 'auto' : 'none',
                            opacity: isPhoneOrEmailValid && cooldown === 0 ? 1 : 0.5,
                            textAlign: 'center',
                            padding: '0 8px',
                            '&:hover': {
                                color: '#29b6f6',
                                textDecoration: isPhoneOrEmailValid && cooldown === 0 ? 'underline' : 'none',
                            }
                        }}
                    >
                        {cooldown > 0 ? `Resend (${cooldown}s)` : otpSent ? 'Resend OTP' : 'Send OTP'}
                    </Link>
                )}
            </Box>
        </Box>
    );
};

export default OTPField;