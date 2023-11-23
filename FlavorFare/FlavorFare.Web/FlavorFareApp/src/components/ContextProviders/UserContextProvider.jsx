import React, { useState, useCallback } from 'react';
import UserContext from '../Contexts/UserContext';

const UserContextProvider = ({ children }) => {
    // Initialize state using values from localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
    const [role, setRole] = useState(localStorage.getItem('role') || 'none');
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || 'none');
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || 'none');

    function decodeJWT(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64));
            return payload;
        } catch (error) {
            console.error("Failed to decode JWT:", error);
            return null;
        }
    }

    const changeUserInformationToLoggedIn = useCallback((newAccessToken, newRefreshToken) => {
        const payload = decodeJWT(newAccessToken);
        const userRole = payload ? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : 'none';

        setIsAuthenticated(true);
        setRole(userRole);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('role', userRole);
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
    }, []);

    const changeUserInformationToLoggedOut = useCallback(() => {
        setIsAuthenticated(false);
        setRole('none');
        setAccessToken('none');
        setRefreshToken('none');

        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }, []);

    return (
        <UserContext.Provider value={{ isAuthenticated, role, accessToken, refreshToken, changeUserInformationToLoggedIn, changeUserInformationToLoggedOut, decodeJWT }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;