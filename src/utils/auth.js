import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "accessToken";

export const setToken = (token) => {
    Cookies.set(TOKEN_KEY, token, { expires: 7 });
};

export const getToken = () => {
    return Cookies.get(TOKEN_KEY);
};

export const clearToken = () => {
    Cookies.remove(TOKEN_KEY);
};

export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        return decoded.exp > now;
    } catch (e) {
        return false;
    }
};

export const getUserRoles = () => {
    try {
        const roles = JSON.parse(localStorage.getItem("roles")) || [];
        // ép tất cả về lowercase
        return roles.map((r) => r.toLowerCase());
    } catch (e) {
        return [];
    }
};

export const hasRole = (role) => {
    const roles = getUserRoles();
    return roles.includes(role);
};

export const getCurrentUser = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user || null;
    } catch (e) {
        return null;
    }
};
