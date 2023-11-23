import endpoints from './API';

export const login = async (username, password) => {
    const response = await fetch(endpoints.LOGIN, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: username, password })
    });

    return response;
};

export const register = async (userName, email, password) => {
    const response = await fetch(endpoints.REGISTER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: userName, email, password })
    });

    return response;
};

export const logout = async (refreshToken) => {
    try {
        await fetch(endpoints.LOGOUT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshToken })
        });
    } catch {
    }
};

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        const response = await fetch(endpoints.REFRESH_TOKEN, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshToken })
        });

        if (response.status === 400) {
            return { success: false, reason: 'Failed refreshing token' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) { 
        return { success: false, reason: 'Network or server error' };
    }
};