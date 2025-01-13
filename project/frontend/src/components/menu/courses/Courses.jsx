import React, { useEffect, useState } from 'react';
import { fetchCoursesData } from "../../../functions/api/coursesApi.js";
import { subscribeCourse, fetchUserCourses } from '../../../functions/api/userCoursesApi.js';
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
    const [userCourses, setUserCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const userData = getUserFromToken(token);

                const coursesData = await fetchCoursesData();
                const userCoursesData = await fetchUserCourses();

                setCourses(coursesData);
                setUserCourses(userCoursesData);
            } catch (error) {
                setError('Ошибка загрузки курсов');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
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
                        disabled={isSubscribed(course.id)}
                    >
                        {isSubscribed(course.id) ? 'Подписаны' : 'Подписаться'}
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