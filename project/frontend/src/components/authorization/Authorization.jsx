import React, { useState } from 'react';
import { loginRequest } from "../../functions/api/loginApi.js";
import { Link, useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import '../../styles/Authorization.css'; // Импортируем стили

const Authorization = () => {
    const navigate = useNavigate(); // Создаём навигатор
    const [isEmail, setIsEmail] = useState(false);
    const [loginOrEmail, setLoginOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        const payload = isEmail
            ? { email: loginOrEmail, password }
            : { login: loginOrEmail, password };

        const result = await loginRequest(payload);
        if (result.success) {
            setMessage('Вход выполнен успешно!');
            console.log('Ответ от сервера:', result.data);
            localStorage.setItem('token', result.data.token);
            navigate('/courses');
        } else {
            setMessage(`Ошибка при входе: ${result.error}`);
            console.log('Ошибка:', result.error);
        }
    };

    // Обработчик нажатия клавиши
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="auth-container">
            <h1>Авторизация</h1>
            <div className="auth-switch">
                <label className={`auth-label ${!isEmail ? 'active' : ''}`}>
                    <input
                        type="radio"
                        checked={!isEmail}
                        onChange={() => setIsEmail(false)}
                    />
                    Логин
                </label>
                <label className={`auth-label ${isEmail ? 'active' : ''}`}>
                    <input
                        type="radio"
                        checked={isEmail}
                        onChange={() => setIsEmail(true)}
                    />
                    Email
                </label>
            </div>
            <div className="auth-inputs">
                <input
                    type="text"
                    className="auth-input"
                    placeholder={isEmail ? 'Email' : 'Логин'}
                    value={loginOrEmail}
                    onChange={(e) => setLoginOrEmail(e.target.value)}
                    onKeyPress={handleKeyPress} // Добавляем обработчик
                />
                <input
                    type="password"
                    className="auth-input"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress} // Добавляем обработчик
                />
                <button className="auth-button" onClick={handleLogin}>Войти</button>
            </div>
            {message && <p className="auth-message">{message}</p>}
            <Link to="/registration" className="auth-registration-link">Регистрация</Link>
        </div>
    );
};

export default Authorization;