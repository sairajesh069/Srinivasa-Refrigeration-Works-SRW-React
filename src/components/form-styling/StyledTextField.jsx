import {styled} from "@mui/material/styles";
import {TextField} from "@mui/material";

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: '24px',
    '& .MuiInputLabel-root': {
        color: '#7f8c8d',
        fontSize: '14px',
        fontWeight: 500,
        '&.Mui-focused': {
            color: '#4fc3f7',
        },
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#f8f9fa',
        transition: 'all 0.3s ease',
        '& fieldset': {
            borderColor: '#e9ecef',
            borderWidth: '1px',
        },
        '&:hover': {
            backgroundColor: '#ffffff',
            '& fieldset': {
                borderColor: '#4fc3f7',
            },
        },
        '&.Mui-focused': {
            backgroundColor: '#ffffff',
            boxShadow: '0 0 0 3px rgba(79, 195, 247, 0.1)',
            '& fieldset': {
                borderColor: '#4fc3f7',
                borderWidth: '2px',
            },
        },
    },
    '& .MuiInputBase-input': {
        color: '#2c3e50',
        fontSize: '16px',
        padding: '16px 14px',
        '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px #f8f9fa inset !important',
            WebkitTextFillColor: '#2c3e50 !important',
            borderRadius: '12px !important',
            transition: 'background-color 5000s ease-in-out 0s !important',
        },
        '&:-webkit-autofill:hover': {
            WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
            WebkitTextFillColor: '#2c3e50 !important',
        },
        '&:-webkit-autofill:focus': {
            WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
            WebkitTextFillColor: '#2c3e50 !important',
        },
        '&:-webkit-autofill:active': {
            WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
            WebkitTextFillColor: '#2c3e50 !important',
        }
    },
    '& .MuiFormHelperText-root': {
        color: '#e74c3c',
        fontSize: '12px',
        marginLeft: '4px',
        marginTop: '6px',
    },
}));

export default StyledTextField;