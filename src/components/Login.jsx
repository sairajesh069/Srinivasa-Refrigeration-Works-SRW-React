import {Box, Button, Typography, Paper, InputAdornment, IconButton} from "@mui/material";
import * as Yup from "yup";
import {Form, Formik} from "formik";
import { PersonOutline, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StyledLink from "./form-styling/StyledLink.jsx";
import StyledTextField from "./form-styling/StyledTextField.jsx";
import { useLoginMutation } from '../reducers/authApi.js';

const validationSchema = Yup.object().shape({
    username: Yup.string()
        .min(6, "Username must have minimum 6 characters")
        .required("Username is required"),
    password: Yup.string()
        .min(6, "Password must have minimum 6 characters")
        .required("Password is required")
});

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [login] = useLoginMutation();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const navigate = useNavigate();

    const handleLogin = async values => {
        try {
            const response = await login(values).unwrap();
            toast.success(response.message);
            navigate('/');
        } catch (error) {
            toast.error('Login failed');
        }
    }

    return (
        <Box sx={{
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            padding: '20px',
            paddingTop: '100px',
            position: 'relative'
        }}>
           <Paper elevation={0} sx={{
               padding: '48px 40px',
               borderRadius: '24px',
               background: 'rgba(255, 255, 255, 0.95)',
               backdropFilter: 'blur(10px)',
               border: '1px solid rgba(255, 255, 255, 0.2)',
               boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
               width: '100%',
               maxWidth: '420px',
               position: 'relative',
               zIndex: 1
           }}>
               <Box sx={{
                   textAlign: 'center',
                   marginBottom: '40px',
               }}>
                   <Box sx={{
                       width: '80px',
                       height: '80px',
                       background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
                       borderRadius: '20px',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       margin: '0 auto 20px',
                       boxShadow: '0 10px 30px rgba(79, 195, 247, 0.3)',
                   }}>
                       <Typography sx={{
                           color: 'white',
                           fontWeight: 800,
                           fontSize: '24px',
                           letterSpacing: '1px',
                       }}>
                           SRW
                       </Typography>
                   </Box>
                   <Typography sx={{
                       color: '#2c3e50',
                       fontWeight: 700,
                       fontSize: '28px',
                       marginBottom: '8px',
                   }}>
                       Welcome Back
                   </Typography>
                   <Typography sx={{
                       color: '#7f8c8d',
                       fontSize: '16px',
                       fontWeight: 400,
                   }}>
                       Sign in to your account
                   </Typography>
               </Box>
               <Formik
                   initialValues={{username: "", password: ""}}
                   validationSchema={validationSchema}
                   onSubmit={handleLogin}
                   validateOnChange={true}
                   validateOnBlur={true}
                   validateOnMount={true}
               >
                   {({ values, handleChange, errors, touched }) => (
                       <Form>
                           <StyledTextField
                               fullWidth
                               label="Username or Email"
                               name="username"
                               value={values.username}
                               onChange={handleChange}
                               error={Boolean((touched.username || values.username) && errors.username)}
                               helperText={(touched.username || values.username) && errors.username}
                               variant="outlined"
                               placeholder="Enter your username or email"
                               InputProps={{
                                   startAdornment: (
                                       <InputAdornment position="start">
                                           <PersonOutline sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                                       </InputAdornment>
                                   ),
                               }}
                           />
                           <StyledTextField
                               fullWidth
                               label="Password"
                               name="password"
                               type={showPassword ? 'text' : 'password'}
                               onChange={handleChange}
                               value={values.password}
                               error={Boolean((touched.password || values.password) && errors.password)}
                               helperText={(touched.password || values.password) && errors.password}
                               variant="outlined"
                               placeholder="Enter your password"
                               InputProps={{
                                   startAdornment: (
                                       <InputAdornment position="start">
                                           <LockOutlined sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                                       </InputAdornment>
                                   ),
                                   endAdornment: (
                                       <InputAdornment position="end">
                                           <IconButton
                                               onClick={togglePasswordVisibility}
                                               edge="end"
                                               sx={{ color: '#7f8c8d' }}
                                           >
                                               {showPassword ? <VisibilityOff /> : <Visibility />}
                                           </IconButton>
                                       </InputAdornment>
                                   ),
                               }}
                           />
                           <StyledLink
                               style={{
                                   float: 'left',
                                   marginBottom: '20px',
                                   fontSize: '13px',
                                   color: '#7f8c8d',
                                   '&:hover': {
                                       color: '#4fc3f7',
                                       backgroundColor: 'rgba(79, 195, 247, 0.05)',
                                   },
                               }}
                               to='/forgot-username'
                           >
                               Username Recovery
                           </StyledLink>
                           <StyledLink
                               style={{
                                   float: 'right',
                                   marginBottom: '20px',
                                   fontSize: '13px',
                                   color: '#7f8c8d',
                                   '&:hover': {
                                       color: '#4fc3f7',
                                       backgroundColor: 'rgba(79, 195, 247, 0.05)',
                                   },
                               }}
                               to='/forgot-password'
                           >
                               Reset Password
                           </StyledLink>
                           <Button
                               fullWidth
                               type="submit"
                               variant="contained"
                               size="large"
                               sx={{
                               marginTop: '8px',
                               padding: '16px 24px',
                               borderRadius: '12px',
                               background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
                               color: 'white',
                               fontWeight: 600,
                               fontSize: '16px',
                               textTransform: 'none',
                               boxShadow: '0 8px 24px rgba(79, 195, 247, 0.4)',
                               transition: 'all 0.3s ease',
                               '&:hover': {
                                   background: 'linear-gradient(135deg, #29b6f6 0%, #1976d2 100%)',
                                   boxShadow: '0 12px 32px rgba(79, 195, 247, 0.5)',
                                   transform: 'translateY(-2px)',
                               },
                               '&:active': {
                                   transform: 'translateY(0px)',
                               },
                           }}>
                               Sign In
                           </Button>
                           <StyledLink
                               style={{
                                   display: 'block',
                                   textAlign: 'center',
                                   marginTop: '24px',
                                   padding: '12px 16px',
                                   backgroundColor: 'rgba(79, 195, 247, 0.05)',
                                   border: '1px solid rgba(79, 195, 247, 0.2)',
                                   borderRadius: '12px',
                                   color: '#4fc3f7',
                                   fontSize: '15px',
                                   fontWeight: 500,
                                   '&:hover': {
                                       backgroundColor: 'rgba(79, 195, 247, 0.1)',
                                       borderColor: 'rgba(79, 195, 247, 0.3)',
                                       color: '#29b6f6',
                                       transform: 'translateY(-1px)',
                                       boxShadow: '0 4px 12px rgba(79, 195, 247, 0.15)'
                                   }
                               }}
                               to='/customer-register'
                           >
                               New User? Register
                           </StyledLink>
                       </Form>
                   )}
               </Formik>
           </Paper>
        </Box>
    );
}

export default Login;