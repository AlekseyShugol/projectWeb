// UserCoursesList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCoursesByUserCourses } from "../../../functions/coursesByUserCourses/coursesByUserCourses.js";
import { getUserFromToken } from "../../../functions/tokenUtils/tokenUtils.js";
import '../../../styles/UserCourses.css'; // Подключаем стили

const UserCoursesList = () => {
    const [userCourses, setUserCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let userId = null;

    if (token) {
        try {
            const decodedToken = getUserFromToken(token);
            userId = decodedToken.id;
        } catch (error) {
            console.error('Ошибка декодирования токена:', error);
        }
    }

    useEffect(() => {
        const fetchUserCourses = async () => {
            if (userId) {
                try {
                    const courses = await fetchCoursesByUserCourses(userId);
                    setUserCourses(courses);
                } catch (error) {
                    setError('Ошибка загрузки курсов');
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserCourses();
    }, [userId]);

    const handleCourseClick = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    if (loading) return <p className="loading-message">Загрузка курсов...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="user-courses-grid">
            {userCourses.length > 0 ? (
                <div className="grid-container">
                    {userCourses.map(course => (
                        <div
                            key={course.id}
                            className="course-tile"
                            onClick={() => handleCourseClick(course.id)}
                        >
                            <h5>{course.name}</h5>
                            <p>ID: {course.id}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Курсы не найдены.</p>
            )}
        </div>
    );
};

export default UserCoursesList;