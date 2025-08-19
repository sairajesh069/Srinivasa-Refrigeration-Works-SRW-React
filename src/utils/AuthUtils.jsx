const AuthUtils = {
    // Storage operations
    getToken: () => localStorage.getItem('token'),
    setToken: token => {
        localStorage.setItem('token', token);
        AuthUtils.notifyAuthChange();
    },

    getUserData: () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },
    setUserData: userData => {
        localStorage.setItem('userData', JSON.stringify(userData));
        AuthUtils.notifyAuthChange();
    },

    // Token validation
    isTokenExpired: token => {
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            return true;
        }
    },

    isAuthenticated: () => {
        const token = AuthUtils.getToken();
        return token && !AuthUtils.isTokenExpired(token);
    },

    // Clear all auth data
    clearAuthData: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        AuthUtils.notifyAuthChange();
    },

    // Event system for reactive updates
    listeners: new Set(),

    subscribe: callback => {
        AuthUtils.listeners.add(callback);
        return () => AuthUtils.listeners.delete(callback); // Return unsubscribe function
    },

    notifyAuthChange: () => {
        AuthUtils.listeners.forEach(callback => {
            try {
                callback({
                    isAuthenticated: AuthUtils.isAuthenticated(),
                    user: AuthUtils.getUserData(),
                    token: AuthUtils.getToken()
                });
            } catch (error) {
                console.error('Auth listener error:', error);
            }
        });
    },

    // Get current auth state
    getAuthState: () => ({
        isAuthenticated: AuthUtils.isAuthenticated(),
        user: AuthUtils.getUserData(),
        token: AuthUtils.getToken()
    })
};

export default AuthUtils;