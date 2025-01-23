export const fetchSubscribers = async (courseId) => {
    const token = localStorage.getItem('token');
    console.log('Получение подписчиков для курса с ID:', courseId);

    try {
        // Запрос на получение всех записей из user-courses
        const userCoursesResponse = await fetch('http://localhost:8000/api/user-courses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!userCoursesResponse.ok) {
            throw new Error('ОШИБКА: НЕ УДАЛОСЬ ЗАГРУЗИТЬ user-courses');
        }

        const userCourses = await userCoursesResponse.json();
        console.log('Полученные записи user-courses:', JSON.stringify(userCourses, null, 2));

        // Фильтрация по courseId
        const filteredSubscriptions = userCourses.filter(sub => sub.cource_id === courseId);
        console.log(`Фильтрованные подписки для courseId ${courseId}:`, JSON.stringify(filteredSubscriptions, null, 2));

        // Получение всех пользователей
        const usersResponse = await fetch('http://localhost:8000/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!usersResponse.ok) {
            throw new Error('ОШИБКА: НЕ УДАЛОСЬ ЗАГРУЗИТЬ users');
        }

        const allUsers = await usersResponse.json();
        console.log('Полученные пользователи:', JSON.stringify(allUsers, null, 2));

        // Получение уникальных ID пользователей из подписок
        const userIds = new Set(filteredSubscriptions.map(sub => sub.user_id));
        console.log('Уникальные ID пользователей из подписок:', Array.from(userIds));

        // Добавление пользователей с совпадающими ID
        const matchedUsers = allUsers.filter(user => userIds.has(String(user.id))); // Приведение к строке
        console.log('Совпадающие пользователи:', JSON.stringify(matchedUsers, null, 2));

        return matchedUsers;
    } catch (error) {
        console.error('ОШИБКА ПРИ ЗАГРУЗКЕ ПОДПИСКОВ:', error);
        return [];
    }
};