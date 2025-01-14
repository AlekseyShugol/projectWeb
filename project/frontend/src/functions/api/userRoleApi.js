export const fetchUserRoleById = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Ошибка при получении пользователей');
    }
    const data = await response.json();
    console.log('Полученные пользователи:', data);
    return data.role;
};