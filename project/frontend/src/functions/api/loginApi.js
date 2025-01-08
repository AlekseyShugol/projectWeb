import axios from 'axios';

export const loginRequest = async (payload) => {
    try {
        const response = await axios.post('http://localhost:8000/api/auth/login', payload);
        return { success: true, data: response.data }; // Возвращаем успех и данные
    } catch (error) {
        console.error('Error during login:', error);
        return { success: false, error: error.response?.data?.message || error.message };
    }
};