const StyledMenuProps = {
    PaperProps: {
        sx: {
            borderRadius: '12px',
            marginTop: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid #e9ecef',
            '& .MuiMenuItem-root': {
                color: '#2c3e50',
                fontSize: '16px',
                padding: '12px 16px',
                transition: 'all 0.2s ease',
                '&:hover': {
                    backgroundColor: '#f8f9fa',
                    color: '#4fc3f7',
                },
                '&.Mui-selected': {
                    backgroundColor: '#4fc3f7',
                    color: '#ffffff',
                    fontWeight: 500,
                    '&:hover': {
                        backgroundColor: '#29b6f6',
                    },
                },
            },
        },
    },
};

export default StyledMenuProps;