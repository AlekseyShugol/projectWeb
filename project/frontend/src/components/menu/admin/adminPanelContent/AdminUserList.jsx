import React, { useEffect, useState } from 'react';
import { fetchUsersData, updateUser, registerUser, deleteUser } from "../../../../functions/api/userApi.js";
import "../../../../styles/AdminUsersList.css";
import CustomConfirmationDialog from "../../../dialog/CustomConfirmationDialog.jsx";

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
    const [updatedRole, setUpdatedRole] = useState(1);
    const [newUserLogin, setNewUserLogin] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState(1);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedUserId, setSelectedUserId] = useState(null);
    //const [showDetailPanel, setShowDetailPanel] = useState(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await fetchUsersData();
                setUsers(data);
                setFilteredUsers(data); // Устанавливаем изначально отфильтрованных пользователей
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
                role_id: updatedRole
            };

            if (users.find(user => user.id === userId).role_id === 3) {
                updatedData.login = users.find(user => user.id === userId).login;
            } else {
                if (!updatedData.email) {
                    throw new Error('Email должен быть заполнен корректно.');
                }
                updatedData.login = updatedLogin.trim();
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

    // const handleDeleteCourse = async (selectedUserId, courseId, setCourses, setError) => {
    //     try {
    //         await deleteUserCourse(selectedUserId, courseId);
    //         setCourses(prevCourses => prevCourses.filter(course => course.course_id !== courseId));
    //     } catch (error) {
    //         console.error(error);
    //         setError('Ошибка при удалении курса');
    //     }
    // };

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
                    <select value={newUserRole} onChange={(e) => setNewUserRole(Number(e.target.value))} className="user-input">
                        <option value={1}>Студент</option>
                        <option value={2}>Преподаватель</option>
                        <option value={3}>Администратор</option>
                    </select>
                    <button onClick={handleAddUser} className="save-button">Сохранить пользователя</button>
                    <button onClick={() => setIsAddingUser(false)} className="cancel-button">Отмена</button>
                </div>
            )}

            <div className="table-container">
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
                                {editingUser === user.id ? (
                                    <div>
                                        <input
                                            className="edit-input"
                                            type="text"
                                            value={user.role_id === 3 ? user.login : updatedLogin}
                                            onChange={(e) => user.role_id !== 3 && setUpdatedLogin(e.target.value)}
                                            placeholder="Логин"
                                            disabled={user.role_id === 3}
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
                                        <button className="cancel-button" onClick={() => setEditingUser(null)}>Отмена</button>
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
                    message="Вы уверены, что хотите удалить этого пользователя?"
                    onConfirm={confirmDeleteUser}
                    onCancel={() => setShowConfirmationDialog(false)}
                />
            )}
        </div>
    );
};

export default AdminUsersList;