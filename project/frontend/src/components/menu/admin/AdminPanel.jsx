// AdminPanel.jsx
import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../../../styles/AdminPanel.css'; // Импорт стилей

const AdminPanel = () => {
    const location = useLocation(); // Получаем текущий путь
    const navigate = useNavigate(); // Получаем функцию навигации

    const handleBack = () => {
        navigate('/admin'); // Перенаправляем на главную страницу
    };

    return (
        <div className="admin-panel">
            <h1>Панель администратора</h1>
            <button className="back-button" onClick={handleBack}>Закрыть панель</button>
            <nav>
                <ul className="tabs">
                    <li>
                        <Link
                            to="adminCoursesView"
                            className={`tab-button ${location.pathname.includes('adminCoursesView') ? 'active' : ''}`}
                        >
                            Просмотр курсов
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="users"
                            className={`tab-button ${location.pathname.includes('users') ? 'active' : ''}`}
                        >
                            Просмотр пользователей
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminPanel;