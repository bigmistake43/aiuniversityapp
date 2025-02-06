import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Attach Authorization header with JWT token for every request
axiosInstance.interceptors.request.use(
    (config) => {
        const authTokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
        if (authTokens.access) {
            config.headers['Authorization'] = `Bearer ${authTokens.access}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercept response to handle token refresh and other errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            const { status } = error.response;

            // Handle expired token (401)
            if (status === 401) {
                const authTokens = JSON.parse(localStorage.getItem("authTokens") || "{}");
                const refreshToken = authTokens?.refresh;

                if (refreshToken) {
                    try {
                        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                            refresh: refreshToken,
                        });
                        const newTokens = response.data;
                        localStorage.setItem("authTokens", JSON.stringify(newTokens));
                        error.config.headers["Authorization"] = `Bearer ${newTokens.access}`;
                        return axiosInstance.request(error.config);
                    } catch (refreshError) {
                        console.error("Failed to refresh token:", refreshError.response?.data || refreshError.message);
                        localStorage.removeItem("authTokens");
                        window.location.href = "/login";
                    }
                } else {
                    localStorage.removeItem("authTokens");
                    window.location.href = "/login";
                }
            } else if (status === 404) {
                window.location.href = "/404";
            }
        }

        return Promise.reject(error);
    }
);

// Login function to authenticate user and get JWT tokens
export const login = async (username, password) => {
    try {
        const response = await axiosInstance.post("/token/", { username, password });
        return response;
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error;  // Propagate error to the caller
    }
};

// Register function to create a new user (you may want to trigger login here)
export const register = async (username, email, password) => {
    try {
        const response = await axiosInstance.post("/register/", { username, email, password });

        // Optionally, log the user in immediately after registration
        return response;
    } catch (error) {
        console.error("Registration failed:", error.response?.data || error.message);
        throw error;  // Propagate error to the caller
    }
};

// Refresh the JWT token using the refresh token
export const refreshToken = async (refresh) => {
    const response = await axiosInstance.post("/token/refresh/", { refresh });
    return response.data;
};

export default axiosInstance;
