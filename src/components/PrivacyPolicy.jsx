import { Box, Typography, IconButton, Paper, Divider } from "@mui/material";
import { Close } from '@mui/icons-material';
import { useState, useEffect } from 'react';

const PrivacyPolicy = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 10);
        setTimeout(() => setContentVisible(true), 300);
    }, []);

    return (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            overflow: 'auto',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
        }}>
            <Paper elevation={24} sx={{
                maxWidth: '850px',
                width: '100%',
                maxHeight: '85vh',
                overflow: 'auto',
                borderRadius: '20px',
                position: 'relative',
                padding: '48px 40px',
                backgroundColor: 'white',
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#4fc3f7',
                    borderRadius: '10px',
                    '&:hover': {
                        background: '#29b6f6',
                    }
                },
            }}>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 20,
                        top: 20,
                        color: '#7f8c8d',
                        zIndex: 10,
                        backgroundColor: 'rgba(0, 0, 0, 0.03)',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                            color: '#2c3e50',
                            transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Close />
                </IconButton>

                <Box sx={{
                    textAlign: 'center',
                    marginBottom: '40px',
                }}>
                    <Typography sx={{
                        fontSize: '36px',
                        fontWeight: 800,
                        letterSpacing: '-0.5px',
                        marginBottom: '12px',
                        background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 50%, #1976d2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        opacity: contentVisible ? 1 : 0,
                        transform: contentVisible ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s'
                    }}>
                        Terms and Conditions
                    </Typography>
                </Box>

                <Typography sx={{
                    fontSize: '13px',
                    color: '#95a5a6',
                    marginBottom: '36px',
                    textAlign: 'center',
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    opacity: contentVisible ? 1 : 0,
                    transform: contentVisible ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'opacity 0.6s ease-out 0.15s, transform 0.6s ease-out 0.15s'
                }}>
                    Last Updated: October 2, 2025
                </Typography>

                <Divider sx={{
                    marginBottom: '32px',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #4fc3f7, transparent)',
                    border: 'none',
                    opacity: contentVisible ? 1 : 0,
                    transition: 'opacity 0.6s ease-out 0.2s'
                }} />

                <Box sx={{ '& > *': { marginBottom: '32px' } }}>
                    {[
                        {
                            num: 1,
                            title: 'Acceptance of Terms',
                            content: "By creating an account and using SRW's air conditioner and refrigerator repair and maintenance services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services."
                        },
                        {
                            num: 2,
                            title: 'Service Description',
                            content: 'SRW provides professional repair, maintenance, and servicing of air conditioning units and refrigerators. Our services include diagnostic assessments, parts replacement, preventive maintenance, and emergency repairs. Service availability may vary by location.'
                        },
                        {
                            num: 3,
                            title: 'User Responsibilities',
                            content: 'As a user of our platform, you agree to:',
                            list: [
                                'Provide accurate and current information during registration',
                                'Maintain the confidentiality of your account credentials',
                                'Provide safe and accessible working conditions for our technicians',
                                'Be present or designate an authorized representative during service appointments',
                                'Notify us of any hazardous conditions or special requirements before service',
                                'Use the platform in compliance with all applicable laws and regulations'
                            ]
                        },
                        {
                            num: 4,
                            title: 'Service Appointments and Cancellations',
                            content: 'Service appointments must be scheduled through our platform. Cancellations must be made at least 24 hours in advance to avoid cancellation fees. We reserve the right to reschedule appointments due to emergencies, weather conditions, or other unforeseen circumstances.'
                        },
                        {
                            num: 5,
                            title: 'Pricing and Payment',
                            content: 'All service fees will be provided upfront or estimated before work begins. Payment is due upon completion of service unless otherwise agreed. We accept various payment methods as displayed on our platform. Additional charges may apply for emergency services, after-hours appointments, or parts replacement.'
                        },
                        {
                            num: 6,
                            title: 'Warranty and Liability',
                            content: 'We provide a warranty on our workmanship for 3 days from the date of service. Parts replacement warranties are subject to manufacturer terms. SRW is not liable for pre-existing conditions, damage resulting from customer negligence, or issues arising from equipment that is beyond economical repair. Our liability is limited to the amount paid for the specific service rendered.'
                        },
                        {
                            num: 7,
                            title: 'Privacy and Data Protection',
                            content: 'We collect and process personal information in accordance with applicable data protection laws. Your information is used solely for providing services, improving our platform, and communication purposes. We do not sell or share your personal information with third parties except as necessary to provide our services or as required by law.'
                        },
                        {
                            num: 8,
                            title: 'Safety and Compliance',
                            content: 'All services are performed by certified technicians following industry safety standards. We comply with all applicable electrical, environmental, and refrigerant handling regulations. Customers must inform us of any specific safety concerns or requirements before service begins.'
                        },
                        {
                            num: 9,
                            title: 'Service Limitations',
                            content: 'SRW reserves the right to refuse service if equipment is deemed unsafe, if working conditions are hazardous, or if the customer fails to comply with these terms. We may decline repairs on equipment that is obsolete or where parts are no longer available.'
                        },
                        {
                            num: 10,
                            title: 'Intellectual Property',
                            content: 'All content on the SRW platform, including logos, text, graphics, and software, is the property of SRW and protected by intellectual property laws. Users may not reproduce, distribute, or create derivative works without express written permission.'
                        },
                        {
                            num: 11,
                            title: 'Dispute Resolution',
                            content: 'Any disputes arising from these terms or our services shall be resolved through good faith negotiation. If resolution cannot be reached, disputes will be subject to arbitration in accordance with local laws and regulations.'
                        },
                        {
                            num: 12,
                            title: 'Changes to Terms',
                            content: 'SRW reserves the right to modify these Terms and Conditions at any time. Users will be notified of significant changes through email or platform notifications. Continued use of our services after changes constitutes acceptance of the modified terms.'
                        },
                        {
                            num: 13,
                            title: 'Contact Information',
                            content: 'For questions or concerns regarding these Terms and Conditions, please contact us through our customer support channels available on the platform.'
                        }
                    ].map((section, index) => (
                        <Box key={section.num} sx={{
                            padding: '24px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, rgba(79, 195, 247, 0.03) 0%, rgba(41, 182, 246, 0.05) 100%)',
                            border: '1px solid rgba(79, 195, 247, 0.1)',
                            transition: 'all 0.3s ease',
                            opacity: contentVisible ? 1 : 0,
                            transform: contentVisible ? 'translateY(0)' : 'translateY(15px)',
                            transitionDelay: `${0.3 + index * 0.05}s`,
                            '&:hover': {
                                boxShadow: '0 8px 24px rgba(79, 195, 247, 0.15)',
                                transform: 'translateY(-2px)',
                                borderColor: 'rgba(79, 195, 247, 0.3)'
                            }
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '16px'
                            }}>
                                <Box sx={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 800,
                                    fontSize: '14px',
                                    boxShadow: '0 4px 12px rgba(79, 195, 247, 0.3)',
                                    flexShrink: 0
                                }}>
                                    {section.num}
                                </Box>
                                <Typography sx={{
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    color: '#2c3e50',
                                    margin: 0
                                }}>
                                    {section.title}
                                </Typography>
                            </Box>
                            <Typography sx={{
                                fontSize: '15px',
                                color: '#4a5568',
                                lineHeight: 1.8,
                                fontWeight: 400,
                                marginBottom: section.list ? '12px' : 0
                            }}>
                                {section.content}
                            </Typography>
                            {section.list && (
                                <Box component="ul" sx={{
                                    fontSize: '15px',
                                    color: '#4a5568',
                                    lineHeight: 1.8,
                                    paddingLeft: '24px',
                                    margin: 0,
                                    '& li': {
                                        marginBottom: '8px',
                                        fontWeight: 400,
                                        '&::marker': {
                                            color: '#4fc3f7'
                                        }
                                    }
                                }}>
                                    {section.list.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    ))}

                    <Box sx={{
                        background: 'linear-gradient(135deg, rgba(79, 195, 247, 0.08) 0%, rgba(41, 182, 246, 0.12) 100%)',
                        padding: '24px',
                        borderRadius: '12px',
                        borderLeft: '4px solid #4fc3f7',
                        boxShadow: '0 4px 16px rgba(79, 195, 247, 0.1)',
                        border: '1px solid rgba(79, 195, 247, 0.2)',
                        opacity: contentVisible ? 1 : 0,
                        transform: contentVisible ? 'translateY(0)' : 'translateY(15px)',
                        transition: 'opacity 0.5s ease-out 0.95s, transform 0.5s ease-out 0.95s'
                    }}>
                        <Typography sx={{
                            fontSize: '15px',
                            color: '#2c3e50',
                            fontWeight: 600,
                            lineHeight: 1.8
                        }}>
                            By clicking "I agree to the terms and conditions" during registration, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default PrivacyPolicy;