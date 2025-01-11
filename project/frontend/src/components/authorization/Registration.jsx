import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser} from "../../functions/api/userApi.js";
import '../../styles/Registration.css';

const Registration = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegistration = async () => {
        if (!login || !email || !phone || !password || !confirmPassword) {
            setMessage('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Пароли не совпадают.');
            return;
        }

        const payload = {
            login,
            email,
            phone,
            password,
            role_id: "1"
        };

        try {
            const result = await registerUser(payload);
            setMessage('Регистрация прошла успешно!');
            console.log('Ответ от сервера:', result);
            navigate('/'); // Перенаправление на главную страницу
        } catch (error) {
            setMessage(`Ошибка при регистрации: ${error.message}`);
            console.log('Ошибка:', error);
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="registration-container">
            <h2>Регистрация</h2>
            <input
                type="text"
                className="registration-input"
                placeholder="Логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
            />
            <input
                type="email"
                className="registration-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                className="registration-input"
                placeholder="Телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <input
                type="password"
                className="registration-input"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                className="registration-input"
                placeholder="Подтверждение пароля"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="registration-button" onClick={handleRegistration}>Зарегистрироваться</button>
            {message && <p className="registration-message">{message}</p>}
            <button className="logout-button" onClick={handleLogout}>Выход</button>
        </div>
    );
};

export default Registration;