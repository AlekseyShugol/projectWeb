// fetchLessons.js
export const fetchLessons = async (courseId) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/lessons', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Ошибка при получении уроков');
    }

    const lessons = await response.json();
    console.log('Полученные уроки:', lessons); // Логируем все уроки
    console.log('ID курса:', courseId); // Логируем ID выбранного курса

    // Фильтруем уроки по course_id
    const filteredLessons = lessons.filter(lesson => lesson.course_id === courseId.toString());
    console.log('Отфильтрованные уроки:', filteredLessons); // Логируем отфильтрованные уроки

    return filteredLessons; // Возвращаем отфильтрованные уроки
};