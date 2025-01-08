import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {getUserFromToken} from "../../functions/tokenUtils/tokenUtils.js";
import '../../styles/MainMenu.css'; // Импортируем стили

const MainMenu = () => {
    const location = useLocation(); // Получаем текущий путь
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    let isAdmin = false;

    if (token) {
        try {
            const decodedToken = getUserFromToken(token);
            console.log('Декодированный токен:', decodedToken); // Логируем декодированный токен
            isAdmin = decodedToken.role === '3'; // Проверяем, является ли роль администратора
        } catch (error) {
            console.error('Ошибка декодирования токена:', error);
        }
    }

    return (
        <div className="main-menu">
            <nav className="menu-tabs">
                <Link
                    to="/courses"
                    className={`menu-button ${location.pathname === '/courses' ? 'active' : ''}`}
                >
                    Все курсы
                </Link>
                <Link
                    to="/my-courses"
                    className={`menu-button ${location.pathname === '/my-courses' ? 'active' : ''}`}
                >
                    Мои курсы
                </Link>
                <Link
                    to="/profile"
                    className={`menu-button ${location.pathname === '/profile' ? 'active' : ''}`}
                >
                    Мой профиль
                </Link>
                {isAdmin && ( // Если пользователь администратор, показываем панель администратора
                    <Link
                        to="/admin"
                        className={`menu-button ${location.pathname === '/admin' ? 'active' : ''}`}
                    >
                        Панель администратора
                    </Link>
                )}
            </nav>
            <Outlet /> {/* Для рендеринга вложенных маршрутов */}
        </div>
    );
};

export default MainMenu;