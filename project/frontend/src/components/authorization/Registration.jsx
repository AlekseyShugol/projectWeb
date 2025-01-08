import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import '../../styles/Registration.css'; // Импортируем стили

const Registration = () => {
    const navigate = useNavigate(); // Создаём навигатор
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegistration = async () => {
        // Проверка на пустые поля
        if (!login || !email || !phone || !password || !confirmPassword) {
            setMessage('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        // Проверка совпадения паролей
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
            const response = await fetch('http://localhost:8000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage('Регистрация прошла успешно!');
                console.log('Ответ от сервера:', result);
                // Перенаправление на главную страницу
                navigate('/'); // Замените '/' на нужный маршрут
            } else {
                setMessage(`Ошибка при регистрации: ${result.error}`);
                console.log('Ошибка:', result.error);
            }
        } catch (error) {
            setMessage(`Ошибка: ${error.message}`);
            console.log('Ошибка:', error);
        }
    };

    // Функция для выхода
    const handleLogout = () => {
        navigate('/'); // Переход на localhost:3000
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
            <button className="logout-button" onClick={handleLogout}>Выход</button> {/* Кнопка выхода */}
        </div>
    );
};

export default Registration;