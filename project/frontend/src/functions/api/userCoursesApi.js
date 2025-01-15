// src/functions/api/userCoursesApi.js

export const subscribeCourse = async (userId, courseId, totalPrice) => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:8000/api/user-courses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
        },
        body: JSON.stringify({
            total_price: totalPrice,
            user_id: userId,
            cource_id: courseId,
        }),
    });

    if (!response.ok) {
        throw new Error('Ошибка при подписке на курс');
    }

    const data = await response.json();
    return data; // Возвращаем ответ от сервера
};

// src/functions/api/userCoursesApi.js

export const getUserCourses = async (userId) => {
    const token = localStorage.getItem('token');

    // Проверяем наличие токена
    if (!token) {
        throw new Error('Токен отсутствует. Пожалуйста, войдите в систему.');
    }

    const response = await fetch(`http://localhost:8000/api/user-courses/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при получении курсов пользователя');
    }

    const data = await response.json();
    return data; // Возвращаем ответ от сервера
};

export const deleteUserCourse = async (courseId, userId) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:8000/api/user-courses/${courseId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }), // Передаем user_id, если необходимо
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при удалении курса пользователя');
    }

    return response.json(); // Возвращаем ответ от сервера
};
