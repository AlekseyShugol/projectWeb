// functions/fetchSubscribers.js

export const fetchSubscribers = async (courseId) => {
    try {
        const response = await fetch('http://localhost:8000/api/user-courses');
        const subscriptions = await response.json();
        const courseSubscriptions = subscriptions.filter(sub => sub.cource_id === courseId);

        const userPromises = courseSubscriptions.map(async (sub) => {
            const userResponse = await fetch(`http://localhost:8000/api/users/${sub.user_id}`);
            return await userResponse.json();
        });

        const usersData = await Promise.all(userPromises);
        const uniqueUsers = Array.from(new Set(usersData.map(user => user.id)))
            .map(id => usersData.find(user => user.id === id));

        return uniqueUsers;
    } catch (error) {
        console.error('Ошибка при загрузке подписчиков:', error);
        return [];
    }
};