import React, { useEffect, useState } from 'react';
import { fetchUsersData, updateUser, deleteUser, registerUser, fetchCoursesByUserId } from "../../../../functions/api/userApi.js";
import "../../../../styles/AdminUsersList.css"; // Не забудьте импортировать стили

const roleMap = {
    1: 'Студент',
    2: 'Преподаватель',
    3: 'Администратор'
};

const AdminUsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [updatedLogin, setUpdatedLogin] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [newUserLogin, setNewUserLogin] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState('all');
    const [courses, setCourses] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null); // Для хранения выбранного студента

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await fetchUsersData();
                setUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                setError('Ошибка загрузки пользователей');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedRole === 'all') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user => roleMap[user.role_id].toLowerCase() === selectedRole);
            setFilteredUsers(filtered);
        }
    }, [selectedRole, users]);

    const handleEditClick = (user) => {
        if (user.role_id === 3) return; // Не разрешаем редактировать администраторов
        setEditingUser(user.id);
        setUpdatedLogin(user.login);
        setUpdatedEmail(user.email);
    };

    const handleUpdateUser = async (userId) => {
        try {
            const updatedData = {
                login: updatedLogin.trim(),
                email: updatedEmail.trim(),
            };

            if (!updatedData.login || !updatedData.email) {
                throw new Error('Логин и email должны быть заполнены корректно.');
            }

            await updateUser(userId, updatedData);
            setUsers(users.map(user => (user.id === userId ? { ...user, ...updatedData } : user)));
            setEditingUser(null);
        } catch (error) {
            console.error(error);
            setError('Ошибка при обновлении пользователя: ' + error.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error(error);
            setError('Ошибка при удалении пользователя');
        }
    };

    const handleAddUser = async () => {
        try {
            const newUserData = {
                login: newUserLogin,
                email: newUserEmail,
            };
            const addedUser = await registerUser(newUserData);
            setUsers([...users, addedUser]);
            setNewUserLogin('');
            setNewUserEmail('');
            setIsAddingUser(false);
        } catch (error) {
            console.error(error);
            setError('Ошибка при добавлении пользователя');
        }
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setUpdatedLogin('');
        setUpdatedEmail('');
    };

    const handleCancelAdd = () => {
        setIsAddingUser(false);
        setNewUserLogin('');
        setNewUserEmail('');
    };

    const handleViewCourses = async (userId) => {
        try {
            const coursesList = await fetchCoursesByUserId(userId);
            setCourses(coursesList);
            setSelectedUserId(userId); // Сохраняем выбранного студента
        } catch (error) {
            console.error(error);
            setError('Ошибка при загрузке курсов');
        }
    };

    if (loading) return <p className="loading-message">Загрузка пользователей...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="admin-users-list">
            <div className="role-filter">
                <button onClick={() => setSelectedRole('all')} className={selectedRole === 'all' ? 'active' : ''}>Все</button>
                <button onClick={() => setSelectedRole('студент')} className={selectedRole === 'студент' ? 'active' : ''}>Студенты</button>
                <button onClick={() => setSelectedRole('преподаватель')} className={selectedRole === 'преподаватель' ? 'active' : ''}>Преподаватели</button>
                <button onClick={() => setSelectedRole('администратор')} className={selectedRole === 'администратор' ? 'active' : ''}>Администраторы</button>
            </div>

            {isAddingUser && (
                <div className="user-form">
                    <input
                        type="text"
                        value={newUserLogin}
                        onChange={(e) => setNewUserLogin(e.target.value)}
                        placeholder="Логин нового пользователя"
                        className="user-input"
                    />
                    <input
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="Email нового пользователя"
                        className="user-input"
                    />
                    <button onClick={handleAddUser} className="save-button">Сохранить пользователя</button>
                    <button onClick={handleCancelAdd} className="cancel-button">Отмена</button>
                </div>
            )}

            <table className="users-table">
                <thead>
                <tr>
                    <th>Логин</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.map((user) => (
                    <tr key={user.id}>
                        <td onClick={() => user.role_id === 1 ? handleViewCourses(user.id) : null} className="clickable">
                            {user.login}
                        </td>
                        <td>
                            {user.email}
                        </td>
                        <td>
                            {roleMap[user.role_id]}
                        </td>
                        <td>
                            {editingUser === user.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={updatedLogin}
                                        onChange={(e) => setUpdatedLogin(e.target.value)}
                                        placeholder="Обновите логин"
                                        className="user-input"
                                    />
                                    <input
                                        type="email"
                                        value={updatedEmail}
                                        onChange={(e) => setUpdatedEmail(e.target.value)}
                                        placeholder="Обновите email"
                                        className="user-input"
                                    />
                                    <button className="save-button" onClick={() => handleUpdateUser(user.id)}>Сохранить</button>
                                    <button className="cancel-button" onClick={handleCancelEdit}>Назад</button>
                                </>
                            ) : (
                                <>
                                    <button className="edit-button" onClick={() => handleEditClick(user)} disabled={user.role_id === 3}>Изменить</button>
                                    <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>Удалить</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {courses.length > 0 && selectedUserId && (
                <div className="courses-list">
                    <h3>Курсы студента:</h3>
                    <ul>
                        {courses.map(course => (
                            <li key={course.id}>{course.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AdminUsersList;