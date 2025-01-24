import React, { useEffect, useState } from 'react';
import { fetchUsersData, updateUser, registerUser, deleteUser } from "../../../../functions/api/userApi.js";
import { fetchCoursesByUserCourses } from "../../../../functions/coursesByUserCourses/coursesByUserCourses.js";
import "../../../../styles/AdminUsersList.css";
import CustomConfirmationDialog from "../../../dialog/CustomConfirmationDialog.jsx";
import { deleteUserCourseByCourse } from "../../../../functions/api/userCoursesApi.js";

const roleMap = {
    1: 'Студент',
    2: 'Преподаватель',
    3: 'Администратор'
};

const AdminUsersList = () => {
    // Состояния
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [updatedLogin, setUpdatedLogin] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [updatedRole, setUpdatedRole] = useState(1);
    const [newUserLogin, setNewUserLogin] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState(1);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [showSidePanel, setShowSidePanel] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userCourses, setUserCourses] = useState([]);
    const [courseToDelete, setCourseToDelete] = useState(null); // Новое состояние для курса

    // Пагинация
    const [currentPage, setCurrentPage] = useState(1);
    const [coursesPerPage] = useState(5); // Количество курсов на странице

    // Эффекты
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
            const filtered = users.filter(user => roleMap[user.role_id].toLowerCase() === selectedRole.toLowerCase());
            setFilteredUsers(filtered);
        }
    }, [selectedRole, users]);

    // Обработчики
    const handleUserClick = async (user) => {
        setSelectedUser(user);
        setShowSidePanel(true);

        const courses = await fetchCoursesByUserCourses(user.id);
        setUserCourses(courses);
        setCurrentPage(1); // Сброс страницы при смене пользователя
    };

    const handleEditClick = (user) => {
        setEditingUser(user.id);
        setUpdatedLogin(user.login);
        setUpdatedEmail(user.email);
        setUpdatedRole(user.role_id);
    };

    const handleUpdateUser = async (userId) => {
        try {
            const updatedData = {
                email: updatedEmail.trim(),
                role_id: updatedRole,
                login: updatedLogin.trim(),
            };

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
                role_id: newUserRole
            };
            const addedUser = await registerUser(newUserData);
            setUsers([...users, addedUser]);
            setNewUserLogin('');
            setNewUserEmail('');
            setNewUserRole(1);
            setIsAddingUser(false);
        } catch (error) {
            console.error(error);
            setError('Ошибка при добавлении пользователя');
        }
    };

    const confirmDeleteUser = async () => {
        if (selectedUserId) {
            try {
                await deleteUser(selectedUserId);
                setUsers(users.filter(user => user.id !== selectedUserId));
                setFilteredUsers(filteredUsers.filter(user => user.id !== selectedUserId));
            } catch (error) {
                console.error(error);
                setError('Ошибка при удалении пользователя');
            } finally {
                setShowConfirmationDialog(false);
                setSelectedUserId(null);
            }
        }
    };

    const handleDeleteUser = (userId) => {
        setSelectedUserId(userId);
        setShowConfirmationDialog(true);
    };

    const toggleSidePanel = () => {
        setShowSidePanel(!showSidePanel);
    };

    const handleRemoveCourse = (courseId) => {
        setCourseToDelete(courseId); // Устанавливаем курс для удаления
        setShowConfirmationDialog(true); // Показываем диалог подтверждения
    };

    const confirmDeleteCourse = async () => {
        if (courseToDelete && selectedUser) {
            const userId = selectedUser.id; // Получаем ID выбранного пользователя
            try {
                await deleteUserCourseByCourse(courseToDelete, userId); // Вызываем функцию удаления юзеркурса
                setUserCourses(userCourses.filter(course => course.id !== courseToDelete)); // Обновляем список курсов
                console.log(`Курс с ID ${courseToDelete} успешно удалён для пользователя с ID ${userId}`);
            } catch (error) {
                console.error('Ошибка при удалении курса:', error);
            } finally {
                setShowConfirmationDialog(false);
                setCourseToDelete(null); // Сбрасываем курс
            }
        }
    };

    // Логика пагинации
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = userCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(userCourses.length / coursesPerPage);

    if (loading) return <p className="loading-message">Загрузка пользователей...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="admin-users-list">
            {showSidePanel && (
                <div className={`side-panel ${showSidePanel ? '' : 'hidden'}`}>
                    <h3>Информация о пользователе</h3>
                    {selectedUser && (
                        <>
                            <p><strong>ID:</strong> {selectedUser.id}</p>
                            <p><strong>Роль: </strong> {roleMap[parseInt(selectedUser.role_id)]}</p>
                            <p><strong>Логин:</strong> {selectedUser.login}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <h4>Курсы пользователя:</h4>
                            {currentCourses.length > 0 ? (
                                <ul className="user-courses-list">
                                    {currentCourses.map(course => (
                                        <li key={course.id}>
                                            {course.name} - ID: {course.id}
                                            <button className="remove-course-button" onClick={() => handleRemoveCourse(course.id)}>Удалить</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Курсы не найдены.</p>
                            )}
                            <div className="pagination">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => paginate(index + 1)}
                                        className={currentPage === index + 1 ? 'active' : ''}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                    <button onClick={toggleSidePanel} className="close-button">Закрыть</button>
                </div>
            )}

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
                    <select value={newUserRole} onChange={(e) => setNewUserRole(Number(e.target.value))} className="user-input">
                        <option value={1}>Студент</option>
                        <option value={2}>Преподаватель</option>
                        <option value={3}>Администратор</option>
                    </select>
                    <button onClick={handleAddUser} className="save-button">Сохранить пользователя</button>
                    <button onClick={() => setIsAddingUser(false)} className="admin-courses-cancel-button">Отмена</button>
                </div>
            )}

            <div className="table-container">
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>Логин</th>
                        <th>Email</th>
                        <th>Роль</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td>
                                    <span
                                        className="clickable-login"
                                        onClick={() => handleUserClick(user)}
                                    >
                                        {user.login}
                                    </span>
                            </td>
                            <td>{user.email}</td>
                            <td>{roleMap[user.role_id]}</td>
                            <td>
                                {editingUser === user.id ? (
                                    <div>
                                        <input
                                            className="edit-input"
                                            type="text"
                                            value={updatedLogin}
                                            onChange={(e) => setUpdatedLogin(e.target.value)}
                                            placeholder="Логин"
                                        />
                                        <input
                                            className="edit-input"
                                            type="email"
                                            value={updatedEmail}
                                            onChange={(e) => setUpdatedEmail(e.target.value)}
                                            placeholder="Email"
                                        />
                                        <select value={updatedRole} onChange={(e) => setUpdatedRole(Number(e.target.value))} className="edit-input">
                                            <option value={1}>Студент</option>
                                            <option value={2}>Преподаватель</option>
                                            <option value={3}>Администратор</option>
                                        </select>
                                        <button className="save-button" onClick={() => handleUpdateUser(user.id)}>Сохранить</button>
                                        <button className="admin-courses-cancel-button" onClick={() => setEditingUser(null)}>Отмена</button>
                                    </div>
                                ) : (
                                    <>
                                        <button className="edit-button" onClick={() => handleEditClick(user)}>Изменить</button>
                                        <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>Удалить</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {showConfirmationDialog && (
                <CustomConfirmationDialog
                    message={courseToDelete ? "Вы уверены, что хотите удалить этот курс?" : "Вы уверены, что хотите удалить этого пользователя?"}
                    onConfirm={courseToDelete ? confirmDeleteCourse : confirmDeleteUser}
                    onCancel={() => {
                        setShowConfirmationDialog(false);
                        setCourseToDelete(null); // Сбрасываем курс
                    }}
                />
            )}
        </div>
    );
};

export default AdminUsersList;