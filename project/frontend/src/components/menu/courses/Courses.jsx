import React, { useEffect, useState } from 'react';
import { fetchCoursesData } from "../../../functions/api/coursesApi.js";
import { subscribeCourse } from '../../../functions/api/userCoursesApi.js';
import '../../../styles/Courses.css';
import { getUserFromToken } from "../../../functions/tokenUtils/tokenUtils.js";

const Notification = ({ message, onClose }) => {
    return (
        <div className="notification">
            <p>{message}</p>
            <button onClick={onClose}>Закрыть</button>
        </div>
    );
};

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [userCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserDataAndCourses = async () => {
            try {
                // Получение информации о пользователе из токена
                const token = localStorage.getItem('token');
                if (token) {
                    const userData = getUserFromToken(token);
                    setUserRole(userData.role); // Устанавливаем роль пользователя
                }

                const coursesData = await fetchCoursesData();
                setCourses(coursesData);
            } catch (error) {
                setError('Ошибка загрузки курсов');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDataAndCourses();
    }, []);

    const handleSubscribe = async (course) => {
        const token = localStorage.getItem('token');
        const userData = getUserFromToken(token);

        try {
            await subscribeCourse(userData.id, course.id, course.price);
            setNotification('Вы успешно подписались на курс!');

            // Убираем уведомление через 10 секунд
            setTimeout(() => {
                setNotification('');
            }, 10000);
        } catch (error) {
            console.error('Error subscribing to course:', error);
            setNotification('Ошибка при подписке на курс.');

            // Убираем уведомление через 10 секунд
            setTimeout(() => {
                setNotification('');
            }, 10000);
        }
    };

    const isSubscribed = (courseId) => {
        const token = localStorage.getItem('token');
        const userId = getUserFromToken(token).id;

        return userCourses.some(userCourse =>
            userCourse.cource_id === courseId && userCourse.user_id === userId
        );
    };

    const closeNotification = () => {
        setNotification('');
    };

    if (loading) return <p>Загрузка курсов...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="courses-container">
            {courses.map((course) => (
                <div className="course-card" key={course.id}>
                    <h3>{course.name}</h3>
                    <p>Цена: {course.price} ₽</p>
                    <button
                        className="subscribe-button"
                        onClick={() => handleSubscribe(course)}
                        disabled={
                            isSubscribed(course.id) || userRole === '2' || userRole === '3'
                        }
                    >
                        {isSubscribed(course.id)
                            ? 'Подписаны'
                            : userRole === '2' || userRole === '3'
                                ? 'Недоступно'
                                : 'Подписаться'}
                    </button>
                </div>
            ))}
            {notification && (
                <Notification message={notification} onClose={closeNotification} />
            )}
        </div>
    );
};

export default Courses;
