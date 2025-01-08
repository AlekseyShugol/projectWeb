// src/functions/api/coursesApi.js

export const fetchCoursesData = async () => {
    const response = await fetch('http://localhost:8000/api/courses');
    if (!response.ok) {
        throw new Error('Ошибка при загрузке курсов');
    }
    const data = await response.json();
    console.log('Полученные курсы:', data); // Выводим результат в консоль
    return data;
};