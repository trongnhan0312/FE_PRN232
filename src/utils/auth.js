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
    localStorage.removeItem("user");
    localStorage.removeItem("roles");
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
        return Array.isArray(roles) ? roles.map((r) => r.toLowerCase()) : [];
    } catch (e) {
        return [];
    }
};

export const hasRole = (role) => {
    const roles = getUserRoles();
    return roles.includes(role.toLowerCase());
};

export const getCurrentUser = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user && typeof user === "object" ? user : null;
    } catch (e) {
        return null;
    }
};

/**
 * Kiểm tra user hiện tại có phải là chủ sở hữu của một resource không
 * @param {number|string} userId
 * @returns {boolean}
 */
export const isCurrentUser = (userId) => {
    const user = getCurrentUser();
    if (!user || !user.id) return false;
    return String(user.id) === String(userId);
};

/**
 * Lấy accessToken từ localStorage nếu cần (dự phòng cho các trường hợp đặc biệt)
 */
export const getAccessTokenFromLocalStorage = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.accessToken || null;
    } catch (e) {
        return null;
    }
};
