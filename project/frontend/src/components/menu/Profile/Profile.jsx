import React, { useEffect, useState } from 'react';
import { getUserFromToken } from '../../../functions/tokenUtils/tokenUtils.js';
import { fetchUserFromId, updateUser } from '../../../functions/api/userApi.js';
import '../../../styles/Profile.css';

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
    const [notificationVisible, setNotificationVisible] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const userData = getUserFromToken(token);
            loadUserProfile(userData.id);
        } else {
            setError('Токен не найден');
            setLoading(false);
        }
    }, []);

    const loadUserProfile = async (userId) => {
        try {
            const userProfile = await fetchUserFromId(userId);
            setUser(userProfile);
            setFormData(userProfile);
        } catch (error) {
            setError('Ошибка загрузки профиля');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleEdit = async () => {
        const token = localStorage.getItem('token');
        const userId = getUserFromToken(token).id;

        if (!validateForm()) return;

        try {
            await updateUser(userId, formData);
            setUser(formData);
            setEditing(false);
            setSuccessMessage('Данные успешно обновлены.');
            setNotificationVisible(true);
            setTimeout(() => setNotificationVisible(false), 10000);
        } catch (error) {
            setError('Ошибка при обновлении данных.');
            console.error(error);
        }
    };

    const validateForm = () => {
        if (!formData.login || !formData.email || !formData.phone) {
            setFieldError('Все поля обязательны для заполнения.');
            return false;
        }

        if (formData.password && formData.password !== confirmPassword) {
            setPasswordError('Пароли не совпадают.');
            return false;
        }

        setFieldError('');
        setPasswordError('');
        return true;
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setFormData(user);
        resetErrors();
    };

    const resetErrors = () => {
        setPasswordError('');
        setFieldError('');
        setConfirmPassword('');
    };

    if (loading) return <p>Загрузка профиля...</p>;
    if (error) return <p>{error}</p>;

    const isSaveButtonDisabled = !formData.login || !formData.email || !formData.phone ||
        (formData.password && !confirmPassword) || (!formData.password && confirmPassword);

    return (
        <div className="profile-container">
            {user && (
                <>
                    <h1 className="profile-title">Профиль пользователя</h1>
                    <div className="profile-info">
                        {renderProfileItem("Логин:", "login")}
                        {renderProfileItem("Email:", "email", "email")}
                        {renderProfileItem("Телефон:", "phone")}
                        {renderPasswordInput()}
                        {fieldError && <p className="error-message">{fieldError}</p>}
                    </div>
                    <div className="profile-buttons">
                        {editing ? renderEditingButtons() : renderEditButton()}
                    </div>
                    {notificationVisible && renderNotification()}
                </>
            )}
        </div>
    );

    function renderProfileItem(label, name, type = "text") {
        return (
            <div className="profile-item">
                <span className="profile-label">{label}</span>
                {editing ? (
                    <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="profile-input"
                    />
                ) : (
                    <span className="profile-value">{user[name]}</span>
                )}
            </div>
        );
    }

    function renderPasswordInput() {
        return (
            <div className="password-input">
                <div className="profile-item">
                    <span className="profile-label">Пароль:</span>
                    {editing ? (
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Новый пароль"
                            onChange={handleChange}
                            className="profile-input"
                        />
                    ) : (
                        <span className="profile-value">********</span>
                    )}
                </div>
                {editing && (
                    <div className="profile-item">
                        <span className="profile-label">Подтверждение пароля:</span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="profile-input"
                            placeholder="Подтверждение пароля"
                        />
                    </div>
                )}
                {editing && (
                    <div className="toggle-password-container">
                    <span
                        className="toggle-password-text"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                    </span>
                    </div>
                )}
                {passwordError && <p className="error-message">{passwordError}</p>}
            </div>
        );
    }

    function renderEditingButtons() {
        return (
            <>
                <button
                    className="save-button"
                    onClick={handleEdit}
                    disabled={isSaveButtonDisabled}
                >
                    Сохранить
                </button>
                <button className="cancel-button" onClick={handleCancelEdit}>Отмена</button>
            </>
        );
    }

    function renderEditButton() {
        return (
            <div className="centered-button">
                <button className="edit-button-user-profile" onClick={() => setEditing(true)}>Редактировать</button>
            </div>
        );
    }

    function renderNotification() {
        return (
            <div className={`notification slide-out`}>
                {successMessage}
                <button onClick={() => setNotificationVisible(false)}>×</button>
            </div>
        );
    }
};

export default Profile;