// src/functions/api/coursesApi.js

export const fetchUsersData = async () => {
    const response = await fetch('http://localhost:8000/api/users');
    if (!response.ok) {
        throw new Error('Ошибка при получении пользователей');
    }
    const data = await response.json();
    console.log('Полученные пользователи:', data); // Выводим результат в консоль
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