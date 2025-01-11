import axios from 'axios';

export const fetchUsersData = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/users', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Ошибка при получении пользователей');
    }
    const data = await response.json();
    console.log('Полученные пользователи:', data);
    return data;
};

export const fetchUserFromId = async (id) => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Токен не найден');
    }

    const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Ошибка при получении пользователя');
    }

    const data = await response.json();
    console.log('Полученный пользователь:', data);
    return data;
};

export const updateUser = async (id, userData) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error('Ошибка при обновлении пользователя');
    }

    const data = await response.json();
    console.log('Данные пользователя обновлены:', data);
    return data;
};

export const deleteUser = async (id) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Ошибка при удалении пользователя');
    }

    console.log(`Пользователь с ID ${id} удалён.`);
    return id; // Возвращаем ID удалённого пользователя для дальнейшего использования
};

export const registerUser = async (payload) => {
    const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Неизвестная ошибка при регистрации.');
    }

    return result;
};




const API_URL = 'http://localhost:8000/api/user-courses'; // URL вашего API

export const fetchCoursesByUserId = async (userId) => {
    try {
        const response = await axios.get(API_URL);
        const allCourses = response.data; // Предполагаем, что все курсы приходят в формате массива

        // Фильтруем курсы по user_id
        const userCourses = allCourses.filter(course => course.user_id === userId);
        return userCourses; // Возвращаем только курсы, соответствующие user_id
    } catch (error) {
        console.error('Ошибка при получении курсов:', error);
        throw new Error('Не удалось загрузить курсы. Попробуйте позже.');
    }
};