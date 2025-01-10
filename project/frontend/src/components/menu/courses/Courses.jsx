
import React, { useEffect, useState } from 'react';
import { fetchCoursesData } from '../../../functions/api/coursesApi.js';
import '../../../styles/Courses.css';
import {getUserFromToken} from "../../../functions/tokenUtils/tokenUtils.js";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {

                const token = localStorage.getItem('token');
                // console.log('Текущий токен:', token);
                const userData = getUserFromToken(token);
                // console.log(`user role: ${getUserFromToken(token).role}`)
                console.log(`COURSE RESPONSE:\n
                TOKEN: ${token}
                ID: ${userData.id}
                ROLE_ID: ${userData.role}`);
                const data = await fetchCoursesData(); // Используем внешнюю функцию
                setCourses(data);
            } catch (error) {
                setError('Ошибка загрузки курсов');
                console.error(error); // Выводим ошибку в консоль
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) return <p>Загрузка курсов...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="courses-container">
            {courses.map((course) => (
                <div className="course-card" key={course.id}>
                    <img src={course.image} alt={course.name} className="course-image" />
                    <h3>{course.name}</h3> {/* Вывод имени курса */}
                    <p>Цена: {course.price} ₽</p>
                    <button className="subscribe-button">Подписаться</button>
                </div>
            ))}
        </div>
    );
};

export default Courses;