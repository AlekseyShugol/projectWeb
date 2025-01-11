import React, { useEffect, useState } from 'react';
import { fetchCoursesData} from "../../../functions/api/coursesApi.js";
import { subscribeCourse, fetchUserCourses } from '../../../functions/api/userCoursesApi.js';
import '../../../styles/Courses.css';
import { getUserFromToken} from "../../../functions/tokenUtils/tokenUtils.js";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [userCourses, setUserCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const userData = getUserFromToken(token);
                console.log('User Data:', userData); // Логируем данные пользователя

                const coursesData = await fetchCoursesData(); // Получаем все курсы
                console.log('Courses Data:', coursesData); // Логируем курсы

                const userCoursesData = await fetchUserCourses(); // Получаем курсы пользователя
                console.log('User Courses Data:', userCoursesData); // Логируем курсы пользователя

                setCourses(coursesData);
                setUserCourses(userCoursesData); // Сохраняем курсы пользователя
            } catch (error) {
                setError('Ошибка загрузки курсов');
                console.error('Error fetching courses:', error); // Логируем ошибку
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
            alert('Вы успешно подписались на курс!');
        } catch (error) {
            console.error('Error subscribing to course:', error);
            alert('Ошибка при подписке на курс.');
        }
    };

    const isSubscribed = (courseId) => {
        const token = localStorage.getItem('token');
        const userId = getUserFromToken(token).id; // Получаем ID пользователя
        console.log('Checking subscription for Course ID:', courseId, 'User ID:', userId); // Логируем проверку

        const subscribed = userCourses.some(userCourse =>
            userCourse.cource_id === courseId && userCourse.user_id === userId
        );

        console.log('Is subscribed:', subscribed); // Логируем результат проверки
        return subscribed;
    };

    if (loading) return <p>Загрузка курсов...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="courses-container">
            {courses.map((course) => (
                <div className="course-card" key={course.id}>
                    <img src={course.image} alt={course.name} className="course-image" />
                    <h3>{course.name}</h3>
                    <p>Цена: {course.price} ₽</p>
                    <button
                        className="subscribe-button"
                        onClick={() => handleSubscribe(course)}
                        disabled={isSubscribed(course.id)} // Блокируем кнопку, если пользователь уже подписан
                    >
                        {isSubscribed(course.id) ? 'Подписаны' : 'Подписаться'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Courses;