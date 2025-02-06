import React, { createContext, useState, useEffect } from "react";
import { decodeToken, isTokenExpired } from "../utils/authUtils";
import { login, register, refreshToken } from "../services/authService";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [tokens, setTokens] = useState(() => {
        try {
            const storedTokens = localStorage.getItem("authTokens");
            return storedTokens ? JSON.parse(storedTokens) : null;
        } catch (error) {
            console.error("Failed to parse tokens from localStorage:", error);
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    const refreshAccessToken = async () => {
        if (!tokens || !tokens.refresh) {
            console.error("No refresh token available");
            logoutUser();
            return;
        }
        try {
            const data = await refreshToken(tokens.refresh);
            const updatedTokens = { ...tokens, access: data.access };
            setTokens(updatedTokens);
            localStorage.setItem("authTokens", JSON.stringify(updatedTokens));
        } catch (error) {
            console.error("Failed to refresh token:", error);
            logoutUser();
        }
    };

    useEffect(() => {
        if (tokens) {
            if (!isTokenExpired(tokens.access)) {
                setUser(decodeToken(tokens.access));
            } else {
                console.warn("Access token expired");
                refreshAccessToken();
            }
        }
        setLoading(false);
    }, [tokens]);

    const loginUser = async (username, password) => {
        const response = await login(username, password);
        const data = response.data;
        if (!isTokenExpired(data.access)) {
            setTokens(data);
            setUser(decodeToken(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
        } else {
            console.error("Received an expired access token");
        }
        return response;
    };

    const registerUser = async (username, email, password) => {
        const response = await register(username, email, password);
        const data = response.data;
        if (!isTokenExpired(data.access)) {
            setTokens(data);
            setUser(decodeToken(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
        } else {
            console.error("Received an expired access token");
        }
        return response;
    };

    const logoutUser = () => {
        setTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser }}>
            {!loading ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
