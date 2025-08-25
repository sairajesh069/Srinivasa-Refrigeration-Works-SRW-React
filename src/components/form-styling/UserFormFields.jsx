import React from 'react';
import { Grid, InputAdornment, MenuItem } from '@mui/material';
import { Person, Phone, Email, LocationOn, Wc, CalendarToday, Badge, WorkOutline, CurrencyRupee, Male, Female, Transgender } from '@mui/icons-material';
import StyledTextField from "../form-styling/StyledTextField.jsx";
import StyledMenuProps from "../form-styling/StyledSelectMenu.jsx";

const UserFormFields = {
    BasicInfoFields: ({ values, handleChange, touched, errors, userType }) => (
        <>
            <Grid xs={12} sm={6}>
                <StyledTextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    error={Boolean((touched.firstName || values.firstName) && errors.firstName)}
                    helperText={(touched.firstName || values.firstName) && errors.firstName}
                    variant="outlined"
                    placeholder="Enter your first name"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Person sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid xs={12} sm={6}>
                <StyledTextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    error={Boolean((touched.lastName || values.lastName) && errors.lastName)}
                    helperText={(touched.lastName || values.lastName) && errors.lastName}
                    variant="outlined"
                    placeholder="Enter your last name"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Person sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid xs={12} sm={6}>
                <StyledTextField
                    fullWidth
                    select
                    label="Gender"
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    error={Boolean((touched.gender || values.gender) && errors.gender)}
                    helperText={(touched.gender || values.gender) && errors.gender}
                    variant="outlined"
                    SelectProps={{
                        displayEmpty: true,
                        MenuProps: StyledMenuProps
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Wc sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                            </InputAdornment>
                        ),
                    }}
                >
                    <MenuItem value="">--select--</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                </StyledTextField>
            </Grid>

            {/* Date of Birth for Owner/Employee */}
            {(userType === 'OWNER' || userType === 'EMPLOYEE') && (
                <Grid xs={12} sm={6}>
                    <StyledTextField
                        fullWidth
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={values.dateOfBirth ? (typeof values.dateOfBirth === 'string' ? values.dateOfBirth.split('T')[0] : new Date(values.dateOfBirth).toISOString().split('T')[0]) : ''}
                        onChange={handleChange}
                        error={Boolean((touched.dateOfBirth || values.dateOfBirth) && errors.dateOfBirth)}
                        helperText={(touched.dateOfBirth || values.dateOfBirth) && errors.dateOfBirth}
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CalendarToday sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            )}

            {/* National ID for Owner/Employee */}
            {(userType === 'OWNER' || userType === 'EMPLOYEE') && (
                <Grid xs={12} sm={6}>
                    <StyledTextField
                        fullWidth
                        label="Aadhar or PAN Number"
                        name="nationalIdNumber"
                        value={values.nationalIdNumber}
                        onChange={handleChange}
                        error={Boolean((touched.nationalIdNumber || values.nationalIdNumber) && errors.nationalIdNumber)}
                        helperText={(touched.nationalIdNumber || values.nationalIdNumber) && errors.nationalIdNumber}
                        variant="outlined"
                        placeholder="Enter your Aadhar or PAN number"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Badge sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            )}
        </>
    ),

    ContactInfoFields: ({ values, handleChange, touched, errors }) => (
        <>
            <Grid xs={12} sm={6}>
                <StyledTextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    error={Boolean((touched.phoneNumber || values.phoneNumber) && errors.phoneNumber)}
                    helperText={(touched.phoneNumber || values.phoneNumber) && errors.phoneNumber}
                    variant="outlined"
                    placeholder="Enter your phone number"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Phone sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid xs={12} sm={6}>
                <StyledTextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    error={Boolean((touched.email || values.email) && errors.email)}
                    helperText={(touched.email || values.email) && errors.email}
                    variant="outlined"
                    placeholder="Enter your email"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid xs={12}>
                <StyledTextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    error={Boolean((touched.address || values.address) && errors.address)}
                    helperText={(touched.address || values.address) && errors.address}
                    variant="outlined"
                    multiline
                    rows={3}
                    placeholder="Enter your full address"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', marginTop: '12px' }}>
                                <LocationOn sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
        </>
    ),

    EmploymentFields: ({ values, handleChange, touched, errors }) => (
        <>
            <Grid xs={12} sm={6}>
                <StyledTextField
                    fullWidth
                    label="Designation"
                    name="designation"
                    value={values.designation}
                    onChange={handleChange}
                    error={Boolean((touched.designation || values.designation) && errors.designation)}
                    helperText={(touched.designation || values.designation) && errors.designation}
                    variant="outlined"
                    placeholder="Enter designation"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <WorkOutline sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid xs={12} sm={6}>
                <StyledTextField
                    fullWidth
                    label="Salary"
                    name="salary"
                    value={values.salary}
                    onChange={handleChange}
                    error={Boolean((touched.salary || values.salary) && errors.salary)}
                    helperText={(touched.salary || values.salary) && errors.salary}
                    variant="outlined"
                    placeholder="Enter salary"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <CurrencyRupee sx={{ color: '#7f8c8d', fontSize: '20px' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
        </>
    )
};

export default UserFormFields;