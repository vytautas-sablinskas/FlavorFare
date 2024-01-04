import React, { useContext } from 'react';

const UserContext = React.createContext({
    isAuthenticated: false,
    role: 'none',
    changeUserInformationToLoggedIn: () => {},
    changeUserInformationToLoggedOut: () => {},
});

export const useUser = () => {
    return useContext(UserContext);
}

export default UserContext;