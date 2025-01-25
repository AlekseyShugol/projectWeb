import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getUserFromToken} from "../../../functions/tokenUtils/tokenUtils.js";
import '../../../styles/AdminPanel.css'; // Импорт стилей

const AdminPanel = () => {
    const location = useLocation(); // Получаем текущий путь
    const navigate = useNavigate(); // Получаем функцию навигации
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    let userRole = null;

    if (token) {
        try {
            const decodedToken = getUserFromToken(token);
            //console.log('Декодированный токен:', decodedToken);
            userRole = decodedToken.role; // Получаем роль пользователя
        } catch (error) {
            console.error('Ошибка декодирования токена:', error);
        }
    }

    const handleBack = () => {
        navigate('/admin'); // Перенаправляем на главную страницу
    };

    return (
        <div className="admin-panel">
            <h1>Панель управления</h1>
            <button className="back-button" onClick={handleBack}>Закрыть панель</button>
            <nav>
                <ul className="tabs">
                    {userRole === '2' ? (
                        <li>
                            <Link
                                to="inrollCourse"
                                className={`tab-button ${location.pathname.includes('inrollCourse') ? 'active' : ''}`}
                            >
                                Управление занятиями
                            </Link>
                        </li>
                    ) : (
                        <>
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
                                    to="adminUsersView"
                                    className={`tab-button ${location.pathname.includes('adminUsersView') ? 'active' : ''}`}
                                >
                                    Просмотр пользователей
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="inrollCourse"
                                    className={`tab-button ${location.pathname.includes('inrollCourse') ? 'active' : ''}`}
                                >
                                    Зачисление преподавателей
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminPanel;