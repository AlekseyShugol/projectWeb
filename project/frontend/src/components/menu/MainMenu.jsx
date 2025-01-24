import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getUserFromToken } from "../../functions/tokenUtils/tokenUtils.js";
import '../../styles/MainMenu.css'; // Импортируем стили

const MainMenu = () => {
    const location = useLocation(); // Получаем текущий путь
    const navigate = useNavigate(); // Создаем навигатор
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    let isAdmin = false;

    if (token) {
        try {
            const decodedToken = getUserFromToken(token);
            //console.log('Декодированный токен:', decodedToken);
            isAdmin = decodedToken.role === '3' || decodedToken.role === '2';
        } catch (error) {
            console.error('Ошибка декодирования токена:', error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token'); // Удаляем токен
        navigate('/'); // Перенаправляем на главную страницу
    };

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
                {isAdmin && (
                    <Link
                        to="/admin"
                        className={`menu-button ${location.pathname === '/admin' ? 'active' : ''}`}
                    >
                        Панель администратора
                    </Link>
                )}
                <button className="logout-button-mainMenu" onClick={handleLogout}>Выход</button>
            </nav>
            <Outlet /> {/* Для рендеринга вложенных маршрутов */}
        </div>
    );
};

export default MainMenu;