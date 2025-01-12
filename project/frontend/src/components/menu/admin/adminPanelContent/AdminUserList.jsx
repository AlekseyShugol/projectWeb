import React, { useEffect, useState } from 'react';
import { fetchUsersData, updateUser, registerUser, deleteUser, deleteUserCourse } from "../../../../functions/api/userApi.js";
import "../../../../styles/AdminUsersList.css";
import { fetchUserCourses } from "../../../../functions/api/userCoursesApi.js";

const roleMap = {
    1: 'Студент',
    2: 'Преподаватель',
    3: 'Администратор'
};

// Функции
const useFetchUsers = (setUsers, setLoading, setError) => {
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await fetchUsersData();
                setUsers(data);
            } catch (error) {
                setError('Ошибка загрузки пользователей');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [setUsers, setLoading, setError]);
};

const fetchCoursesByUserId = async (userId, setCourses, setSelectedUserId, setShowDetailPanel, setError) => {
    try {
        const coursesList = await fetchUserCourses(userId);
        setCourses(coursesList);
        setSelectedUserId(userId);
        setShowDetailPanel(true);
    } catch (error) {
        console.error(error);
        setError('Ошибка при загрузке курсов');
    }
};

const handleDeleteCourse = async (selectedUserId, courseId, setCourses, setError) => {
    try {
        await deleteUserCourse(selectedUserId, courseId);
        setCourses(prevCourses => prevCourses.filter(course => course.course_id !== courseId));
    } catch (error) {
        console.error(error);
        setError('Ошибка при удалении курса');
    }
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
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showDetailPanel, setShowDetailPanel] = useState(false);

    useFetchUsers(setUsers, setLoading, setError);

    useEffect(() => {
        if (selectedRole === 'all') {
            setFilteredUsers(users.sort((a, b) => a.login.localeCompare(b.login)));
        } else {
            const filtered = users.filter(user => roleMap[user.role_id].toLowerCase() === selectedRole);
            setFilteredUsers(filtered.sort((a, b) => a.login.localeCompare(b.login)));
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

    const handleCloseDetailPanel = () => {
        setShowDetailPanel(false);
        setSelectedUserId(null);
        setCourses([]);
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
                    <button onClick={() => setIsAddingUser(false)} className="cancel-button">Отмена</button>
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
                        <td>{user.login}</td>
                        <td>{user.email}</td>
                        <td>{roleMap[user.role_id]}</td>
                        <td>
                            {user.role_id === "3" ? null : ( // Убираем кнопки для администраторов
                                <>
                                    {editingUser === user.id ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={updatedLogin}
                                                onChange={(e) => setUpdatedLogin(e.target.value)}
                                                placeholder="Логин"
                                            />
                                            <input
                                                type="email"
                                                value={updatedEmail}
                                                onChange={(e) => setUpdatedEmail(e.target.value)}
                                                placeholder="Email"
                                            />
                                            <button onClick={() => handleUpdateUser(user.id)}>Сохранить</button>
                                            <button onClick={() => setEditingUser(null)}>Отмена</button>
                                        </div>
                                    ) : (
                                        <>
                                            <button className="edit-button" onClick={() => handleEditClick(user)}>Изменить</button>
                                            <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>Удалить</button>
                                        </>
                                    )}
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showDetailPanel && (
                <div className="courses-list">
                    <h3>Курсы пользователя:</h3>
                    <button onClick={handleCloseDetailPanel} className="close-button">Закрыть</button>
                    <table className="courses-table">
                        <thead>
                        <tr>
                            <th>Курс ID</th>
                            <th>Общая стоимость</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {courses.map(course => (
                            <tr key={course.course_id}>
                                <td>{course.course_id}</td>
                                <td>{course.total_price}</td>
                                <td>
                                    <button className="delete-button" onClick={() => handleDeleteCourse(selectedUserId, course.course_id, setCourses, setError)}>Удалить</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUsersList;