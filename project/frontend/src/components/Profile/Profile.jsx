import React, { useEffect, useState } from 'react';
import { getUserFromToken } from '../../functions/tokenUtils/tokenUtils.js';
import { fetchUserFromId, updateUser } from '../../functions/api/userApi.js';
import '../../styles/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [fieldError, setFieldError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const userData = getUserFromToken(token);
            const userId = userData.id;

            const loadUserProfile = async () => {
                try {
                    const userProfile = await fetchUserFromId(userId);
                    setUser(userProfile);
                    setFormData(userProfile); // Инициализируем данные формы
                } catch (error) {
                    setError('Ошибка загрузки профиля');
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };

            loadUserProfile();
        } else {
            setError('Токен не найден');
            setLoading(false);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = async () => {
        const token = localStorage.getItem('token');
        const userData = getUserFromToken(token);
        const userId = userData.id;

        // Проверка на заполнение всех полей
        if (!formData.login || !formData.email || !formData.phone || (formData.password && !confirmPassword)) {
            setFieldError('Все поля обязательны для заполнения.');
            return;
        } else {
            setFieldError(''); // Сбрасываем ошибку, если все поля заполнены
        }

        // Проверка совпадения паролей
        if (formData.password && formData.password !== confirmPassword) {
            setPasswordError('Пароли не совпадают.');
            return;
        } else {
            setPasswordError(''); // Сбрасываем ошибку, если пароли совпадают
        }

        try {
            await updateUser(userId, formData); // Обновляем данные пользователя
            setUser(formData); // Обновляем состояние пользователя
            setEditing(false); // Выход из режима редактирования
            setSuccessMessage('Данные успешно обновлены.'); // Устанавливаем сообщение успеха

            // Удаляем сообщение через 5 секунд
            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
        } catch (error) {
            setError('Ошибка при обновлении данных.');
            console.error(error);
        }
    };

    if (loading) return <p>Загрузка профиля...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="profile-container">
            {user && (
                <>
                    <h1>Профиль пользователя</h1>
                    <label>
                        <strong>Логин: </strong>
                        {editing ? (
                            <input
                                type="text"
                                name="login"
                                value={formData.login}
                                onChange={handleChange}
                            />
                        ) : (
                            <span>{user.login}</span>
                        )}
                    </label>
                    <label>
                        <strong>Email: </strong>
                        {editing ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        ) : (
                            <span>{user.email}</span>
                        )}
                    </label>
                    <label>
                        <strong>Телефон: </strong>
                        {editing ? (
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        ) : (
                            <span>{user.phone}</span>
                        )}
                    </label>
                    <label>
                        <strong>Пароль: </strong>
                        {editing ? (
                            <div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Новый пароль"
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="toggle-password-button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'Скрыть' : 'Показать'}
                                </button>
                            </div>
                        ) : (
                            <span>********</span>
                        )}
                    </label>
                    {editing && (
                        <label>
                            <strong>Подтверждение пароля: </strong>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {passwordError && (
                                <p className="error-message">{passwordError}</p>
                            )}
                        </label>
                    )}
                    {fieldError && (
                        <p className="error-message">{fieldError}</p>
                    )}
                    <div className="profile-buttons">
                        {editing ? (
                            <button className="save-button" onClick={handleEdit}>Сохранить</button>
                        ) : (
                            <button className="edit-button" onClick={() => setEditing(true)}>Редактировать</button>
                        )}
                    </div>
                    {successMessage && (
                        <p className="success-message fade-out">{successMessage}</p>
                    )}
                </>
            )}
        </div>
    );
};

export default Profile;