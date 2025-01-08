export const fetchUserCourseFromId = async (id) => {
    const response = await fetch(`http://localhost:8000/api/user-courses/${id}`);
    if (!response.ok) {
        throw new Error('Ошибка при получении курса пользователя');
    }
    const data = await response.json();
    console.log('Полученный курс пользователя:', data); // Выводим результат в консоль
    return data;
};

export const fetchUserCourses = async () => {
    const response = await fetch(`http://localhost:8000/api/user-courses`);
    if (!response.ok) {
        throw new Error('Ошибка при получении курса пользователя');
    }
    const data = await response.json();
    console.log('Полученный пользователь:', data); // Выводим результат в консоль
    return data;
};