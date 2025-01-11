// src/functions/api/userCoursesApi.js

export const fetchUserCourseFromId = async (id) => {
    const response = await fetch(`http://localhost:8000/api/user-courses/${id}`);
    if (!response.ok) {
        throw new Error('Ошибка при получении курса пользователя');
    }
    const data = await response.json();
    console.log('Полученный курс пользователя:', data); // Выводим результат в консоль
    return data;
};

export const fetchUserCourses = async (userId) => {
    const response = await fetch(`http://localhost:8000/api/user-courses?user_id=${userId}`);
    if (!response.ok) {
        throw new Error('Ошибка при получении курсов пользователя');
    }
    const data = await response.json();
    console.log('Полученные курсы пользователя:', data); // Выводим результат в консоль
    return data;
};

export const subscribeCourse = async (userId, courseId, totalPrice) => {
    const token = localStorage.getItem('token'); // Получаем токен из localStorage

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