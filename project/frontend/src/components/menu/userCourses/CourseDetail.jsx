import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../styles/CourseDetail.css'; // Подключаем стили
import Notification from './Notification'; // Импортируем компонент уведомлений
import CustomConfirmationDialog from "../../dialog/CustomConfirmationDialog.jsx"; // Импортируем компонент диалога подтверждения

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [marks, setMarks] = useState({});
    const [teachers, setTeachers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userCourses, setUserCourses] = useState([]);
    const [notification, setNotification] = useState('');
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [courseToUnsubscribe, setCourseToUnsubscribe] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const loadData = async () => {
            try {
                // Запрос уроков
                const lessonResponse = await fetch('http://localhost:8000/api/lessons', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const lessonsData = await lessonResponse.json();
                const filteredLessons = lessonsData.filter(lesson => lesson.course_id === courseId);
                setLessons(filteredLessons);

                // Запрос оценок
                const marksResponse = await fetch('http://localhost:8000/api/marks', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const marksData = await marksResponse.json();
                const marksByLesson = {};
                for (const mark of marksData) {
                    if (!marksByLesson[mark.lesson_id]) {
                        marksByLesson[mark.lesson_id] = [];
                    }
                    marksByLesson[mark.lesson_id].push(mark);
                }
                setMarks(marksByLesson);

                // Запрос информации о преподавателях
                const teacherPromises = marksData.map(async mark => {
                    if (mark.teacher_id) {
                        const teacherResponse = await fetch(`http://localhost:8000/api/users/${mark.teacher_id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        const teacherInfo = await teacherResponse.json();
                        setTeachers(prev => ({
                            ...prev,
                            [mark.teacher_id]: {
                                login: teacherInfo.login,
                                email: teacherInfo.email
                            }
                        }));
                    }
                });
                await Promise.all(teacherPromises);

                // Запрос курсов пользователя
                const userCoursesResponse = await fetch('http://localhost:8000/api/user-courses', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const userCoursesData = await userCoursesResponse.json();
                setUserCourses(userCoursesData);

                setLoading(false);
            } catch (error) {
                setError('Ошибка загрузки данных');
                console.error(error);
            }
        };

        loadData();
    }, [courseId, token]);

    const handleUnsubscribe = async () => {
        try {
            console.log('Текущий courseId:', courseId); // Логируем текущий courseId
            console.log('Все курсы пользователя:', userCourses); // Логируем все курсы пользователя

            // Фильтрация курсов пользователя по cource_id
            const coursesToUnsubscribe = userCourses.filter(userCourse => userCourse.cource_id === courseId);
            console.log('Курсы для удаления:', coursesToUnsubscribe); // Логируем курсы для удаления

            // Удаление каждого найденного userCourse
            const responses = [];
            for (const userCourse of coursesToUnsubscribe) {
                const response = await fetch(`http://localhost:8000/api/user-courses/${userCourse.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Проверка статуса ответа
                if (response.ok) {
                    responses.push({ message: `Курс ${userCourse.id} успешно удален.` });
                    // Обновление состояния после удаления
                    setUserCourses(prev => prev.filter(course => course.id !== userCourse.id));
                } else {
                    const errorData = await response.json();
                    responses.push({ message: `Ошибка при удалении курса ${userCourse.id}: ${errorData.message || 'Неизвестная ошибка'}` });
                }
            }

            // Проверка состояния после удаления
            console.log('Состояние userCourses после удаления:', userCourses);

            // Вывод ответа от сервера в кастомное уведомление
            setNotification('Ответы сервера: ' + responses.map(res => res.message).join(', '));
            console.log('Ответы сервера:', responses);
            navigate('/my-courses'); // Перенаправление на страницу курсов
        } catch (error) {
            console.error('Ошибка при отписке:', error);
            setNotification('Ошибка при отписке от курса');
        }
    };

    const handleOpenConfirmationDialog = (course) => {
        setCourseToUnsubscribe(course);
        setShowConfirmationDialog(true);
    };

    if (loading) return <p className="loading-message">Загрузка информации...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="course-detail">
            <h2>Детали курса</h2>
            <p>ID курса: {courseId}</p>
            <button className="back-button" onClick={() => navigate(-1)}>Назад</button>
            <button className="unsubscribe-button" onClick={() => handleOpenConfirmationDialog({ id: courseId })}>Отписаться от курса</button>
            <h3>Уроки</h3>
            <ul>
                {lessons.map(lesson => (
                    <li key={lesson.id}>
                        <details>
                            <summary>Урок {lesson.id}</summary>
                            <p>Время: {lesson.start_time}</p>
                            <h4>Преподаватель: {teachers[lesson.teacher_id]?.login || 'Неизвестен'} ({teachers[lesson.teacher_id]?.email || 'Неизвестен'})</h4>
                            <h4>Оценки:</h4>
                            <ul>
                                {marks[lesson.id] && marks[lesson.id].map(mark => (
                                    <li key={mark.id}>
                                        Оценка: {mark.mark_volume}, Преподаватель: {teachers[mark.teacher_id]?.login || 'Неизвестен'} ({teachers[mark.teacher_id]?.email || 'Неизвестен'})
                                    </li>
                                ))}
                            </ul>
                        </details>
                    </li>
                ))}
            </ul>

            {notification && <Notification message={notification} onClose={() => setNotification('')} />}
            {showConfirmationDialog && (
                <CustomConfirmationDialog
                    message="Вы уверены, что хотите отписаться от этого курса?"
                    onConfirm={handleUnsubscribe}
                    onCancel={() => setShowConfirmationDialog(false)}
                />
            )}
        </div>
    );
};

export default CourseDetail;