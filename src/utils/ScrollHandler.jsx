import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollHandler = () => {
    const { hash, pathname } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [pathname]);

    useEffect(() => {
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [hash]);

    return null;
};

export default ScrollHandler;