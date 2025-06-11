import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollHandler = () => {
    const { hash, pathname } = useLocation();

    useEffect(() => {
        const handleClick = () => {
            if (pathname) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        window.addEventListener('click', handleClick);

        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [hash, pathname]);

    return null;
};

export default ScrollHandler;
