import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PrivacyPolicy from '../components/PrivacyPolicy';

const PrivacyPolicyContext = createContext();

export const PrivacyPolicyProvider = ({ children }) => {
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === '/privacy-policy') {
            setShowPrivacyPolicy(true);
        }
    }, [location.pathname]);

    const handleClosePrivacyPolicy = () => {
        setShowPrivacyPolicy(false);
        if (location.pathname === '/privacy-policy') {
            navigate('/');
        }
    };

    const openPrivacyPolicy = () => {
        setShowPrivacyPolicy(true);
    };

    return (
        <PrivacyPolicyContext.Provider value={{ openPrivacyPolicy }}>
            {children}
            {showPrivacyPolicy && (
                <PrivacyPolicy onClose={handleClosePrivacyPolicy} />
            )}
        </PrivacyPolicyContext.Provider>
    );
};

export const usePrivacyPolicy = () => useContext(PrivacyPolicyContext);