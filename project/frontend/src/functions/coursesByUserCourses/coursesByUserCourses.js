export async function fetchCoursesByUserCourses(userId) {
    try {
        // Запрос на получение курсов пользователя
        const userCoursesResponse = await fetch('http://localhost:8000/api/user-courses');
        const userCourses = await userCoursesResponse.json();

        // Фильтруем курсы по user_id
        const filteredUserCourses = userCourses.filter(course => course.user_id === userId.toString());

        // Получаем id курсов
        const courseIds = filteredUserCourses.map(course => course.cource_id);

        // Запрос на получение всех курсов
        const allCoursesResponse = await fetch('http://localhost:8000/api/courses');
        const allCourses = await allCoursesResponse.json();

        // Фильтруем курсы по cource_id
        const filteredCourses = allCourses.filter(course => courseIds.includes(course.id.toString()));

        return filteredCourses;  // Возвращаем отфильтрованные курсы
    } catch (error) {
        console.error('Ошибка при получении курсов:', error);
        return [];  // Возвращаем пустой массив в случае ошибки
    }
}



