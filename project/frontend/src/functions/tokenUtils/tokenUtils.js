import {jwtDecode} from "jwt-decode";

export const getUserFromToken = (token) => {
    if (!token) {
        throw new Error('Token is required');
    }

    try {
        const decoded = jwtDecode(token);
        //console.log('Decoded token:', decoded); // Логируем декодированный токен
        return { id: decoded.id, role: decoded.role }; // Возвращаем id и роль
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};