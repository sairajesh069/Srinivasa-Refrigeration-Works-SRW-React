import {styled} from "@mui/material/styles";
import {Link} from "react-router-dom";

const StyledLink = styled(Link)({
    color: '#4fc3f7',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    padding: '4px 8px',
    borderRadius: '6px',
    display: 'inline-block',
    position: 'relative',
    '&:hover': {
        color: '#29b6f6',
        backgroundColor: 'rgba(79, 195, 247, 0.05)',
        transform: 'translateY(-1px)',
    },
    '&:active': {
        transform: 'translateY(0px)',
    },
});

export default StyledLink;