// src/functions/api/coursesApi.js

export const fetchCoursesData = async () => {
    const response = await fetch('http://localhost:8000/api/courses');
    if (!response.ok) {
        throw new Error('Ошибка при получении курсов');
    }
    const data = await response.json();
    console.log('Полученные курсы:', data);
    return data;
};

export const fetchCourseFromId = async (id) => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Токен не найден');
    }

    const response = await fetch(`http://localhost:8000/api/courses/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Ошибка при получении курса');
    }

    const data = await response.json();
    console.log('Полученный курс:', data);
    return data;
};

export const updateCourseData = async (id, courseData) => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Токен не найден'); // Проверка на наличие токена
    }

    const response = await fetch(`http://localhost:8000/api/courses/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
    });

    // Логируем ответ сервера
    const responseData = await response.json();
    console.log('Ответ сервера:', responseData);

    if (!response.ok) {
        throw new Error(`Ошибка при обновлении курса: ${responseData.message || 'Неизвестная ошибка'}`);
    }

    console.log('Данные курса обновлены:', responseData);
    return responseData;
};

export const deleteCourseData = async (id) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:8000/api/courses/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Ошибка при удалении курса');
    }

    console.log(`Курс с ID ${id} удален`);
};

export const addCourseData = async (newCourseData) => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:8000/api/courses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newCourseData),
    });

    if (!response.ok) {
        throw new Error('Ошибка при добавлении курса');
    }

    const data = await response.json();
    console.log('Добавленный курс:', data);
    return data;
};