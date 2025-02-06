// authUtils.js

export const decodeToken = (token) => {
    return token ? JSON.parse(atob(token.split('.')[1])) : null;
};

export const isTokenExpired = (token) => {
    try {
        const decoded = decodeToken(token);
        return decoded.exp * 1000 < Date.now();
    } catch (error) {
        return true; // Treat invalid tokens as expired
    }
};

export const isRefreshTokenExpired = (refreshToken) => {
    const decoded = decodeToken(refreshToken);
    return decoded ? decoded.exp * 1000 < Date.now() : true;
};
