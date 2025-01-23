import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../../../functions/tokenUtils/tokenUtils.js";
import { fetchCoursesData } from "../../../../functions/api/coursesApi.js";
import { fetchLessons } from "../../../../functions/api/lessonsApi.js";
import { fetchUserFromId } from "../../../../functions/api/userApi.js";
import { fetchSubscribers } from "../../../../functions/fetchSubscribers.js";
import "../../../../styles/AdminEnrollPage.css";

const Notification = ({ message, onClose, type }) => {
    const notificationStyles = {
        backgroundColor: type === 'success' ? '#4caf50' : type === 'error' ? '#dc3545' : '#786a02',
    };

    return (
        <div className="notification" style={notificationStyles}>
            <p>{message}</p>
            <button onClick={onClose}>Закрыть</button>
        </div>
    );
};

const AdminEnrollPage = () => {
    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [teachers, setTeachers] = useState({});
    const [subscribers, setSubscribers] = useState([]);
    const [newLesson, setNewLesson] = useState({ start_time: '', end_time: '', position: '' });
    const [showLessonForm, setShowLessonForm] = useState(false);
    const [rating, setRating] = useState('');
    const [ratingUserId, setRatingUserId] = useState(null);
    const [lessonNumber, setLessonNumber] = useState('');
    const [notification, setNotification] = useState('');
    const [notificationType, setNotificationType] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const userData = getUserFromToken(token);
                console.log('Получение курсов для пользователя:', userData);
                const data = await fetchCoursesData();
                console.log('Полученные курсы:', data);
                setCourses(data);
            } catch (error) {
                setError('Ошибка загрузки курсов');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        const loadLessons = async () => {
            if (selectedCourse) {
                console.log('Загрузка уроков для курса ID:', selectedCourse.id);
                const lessonsData = await fetchLessons(selectedCourse.id);
                console.log('Полученные уроки:', lessonsData);
                setLessons(lessonsData);

                const teacherPromises = lessonsData.map(async (lesson) => {
                    try {
                        console.log(`Получение информации о учителе ID: ${lesson.teacher_id}`);
                        const teacher = await fetchUserFromId(lesson.teacher_id);
                        console.log(`Учитель для урока ${lesson.id}:`, teacher);
                        return { id: lesson.teacher_id, login: teacher.login };
                    } catch (error) {
                        console.error(`Не удалось получить информацию о пользователе с ID ${lesson.teacher_id}: ${error.message}`);
                        return { id: lesson.teacher_id, login: 'Неизвестный учитель' };
                    }
                });

                const teachersData = await Promise.all(teacherPromises);
                const teachersMap = teachersData.reduce((acc, teacher) => {
                    acc[teacher.id] = teacher;
                    return acc;
                }, {});

                setTeachers(teachersMap);

                const allSubscribers = [];
                const subscribersPromises = lessonsData.map(async (lesson) => {
                    console.log(`Запрос подписчиков для урока ID: ${lesson.id}`);
                    const subscribers = await fetchSubscribers(lesson.course_id);
                    allSubscribers.push(...subscribers);
                });

                await Promise.all(subscribersPromises);
                const uniqueSubscribers = Array.from(new Map(allSubscribers.map(user => [user.id, user])).values());
                setSubscribers(uniqueSubscribers);
            } else {
                setLessons([]);
                setTeachers({});
                setSubscribers([]);
            }
        };

        loadLessons();
    }, [selectedCourse]);

    const handleRate = (userId) => {
        setRatingUserId(userId);
        setRating('');
        setLessonNumber('');
    };

    const handleSubmitRating = async () => {
        if (rating < 1 || rating > 10) {
            setNotification('Оценка должна быть от 1 до 10.');
            setNotificationType('warning');
            setTimeout(() => setNotification(''), 10000);
            return;
        }

        const token = localStorage.getItem('token');
        const userData = getUserFromToken(token);

        const ratingData = {
            student_id: ratingUserId,
            teacher_id: userData.id,
            mark_volume: rating,
            lesson_id: lessonNumber,
        };

        try {
            const response = await fetch('http://localhost:8000/api/marks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(ratingData),
            });

            if (response.ok) {
                setNotification("Оценка успешно отправлена!");
                setNotificationType('success');
                setTimeout(() => setNotification(''), 10000);
                setRatingUserId(null);
            } else {
                console.error('Ошибка при отправке оценки:', response.statusText);
                setNotification('Ошибка при отправке оценки.');
                setNotificationType('error');
                setTimeout(() => setNotification(''), 10000);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
            setNotification('Ошибка при отправке оценки.');
            setNotificationType('error');
            setTimeout(() => setNotification(''), 10000);
        }
    };

    const handleAddLesson = async () => {
        const token = localStorage.getItem('token');
        const userData = getUserFromToken(token);
        const lessonData = {
            course_id: selectedCourse.id,
            curriculum_id: "101",
            start_time: new Date().toISOString().split('T')[0] + ' ' + newLesson.start_time,
            end_time: newLesson.end_time,
            teacher_id: userData.id,
            position: newLesson.position,
        };

        try {
            const response = await fetch('http://localhost:8000/api/lessons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(lessonData),
            });
            if (response.ok) {
                const newLesson = await response.json();
                setLessons(prevLessons => [...prevLessons, newLesson]);
                setNewLesson({ start_time: '', end_time: '', position: '' });
                setShowLessonForm(false);
            } else {
                console.error('Ошибка при добавлении урока:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8000/api/lessons/${lessonId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setLessons(prevLessons => prevLessons.filter(lesson => lesson.id !== lessonId));
            } else {
                console.error('Ошибка при удалении урока:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    if (loading) return <p>Загрузка курсов...</p>;
    if (error) return <p>{error}</p>;

    const courseInfo = selectedCourse ? {
        getId: () => selectedCourse.id,
        getUserCourseId: () => selectedCourse.user_cource_id,
        getPrice: () => selectedCourse.price,
        getName: () => selectedCourse.name,
    } : null;

    return (
        <div className="admin-enroll-courses-container">
            <div className="table-container">
                <table className="admin-courses-table">
                    <thead>
                    <tr>
                        <th>Название курса</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map((course) => (
                        <tr
                            key={course.id}
                            onClick={() => setSelectedCourse(course)}
                            className="clickable-row"
                        >
                            <td>{course.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {selectedCourse && (
                <div className="course-info-panel">
                    <h2>Информация о курсе</h2>
                    <p><strong>ID курса:</strong> {courseInfo.getId()}</p>
                    <p><strong>Цена:</strong> {courseInfo.getPrice()}</p>
                    <p><strong>Название:</strong> {courseInfo.getName()}</p>
                    <button
                        className="button close-enrollInfo-button"
                        onClick={() => setSelectedCourse(null)}
                    >
                        Закрыть
                    </button>
                    <button className="button add-lesson-button" onClick={() => setShowLessonForm(!showLessonForm)}>
                        Добавить урок
                    </button>
                    {showLessonForm && (
                        <div className="lesson-form">
                            <h3>Добавить урок</h3>
                            <label>
                                Начальное время:
                                <input
                                    type="time"
                                    value={newLesson.start_time}
                                    onChange={(e) => setNewLesson({ ...newLesson, start_time: e.target.value })}
                                />
                            </label>
                            <label>
                                Время окончания (минуты):
                                <input
                                    type="number"
                                    value={newLesson.end_time}
                                    onChange={(e) => setNewLesson({ ...newLesson, end_time: e.target.value })}
                                />
                            </label>
                            <label>
                                Позиция:
                                <input
                                    type="text"
                                    value={newLesson.position}
                                    onChange={(e) => setNewLesson({ ...newLesson, position: e.target.value })}
                                />
                            </label>
                            <button className="save-lesson-button" onClick={handleAddLesson}>Сохранить урок</button>
                            <button className="cancel-lesson-button" onClick={() => setShowLessonForm(false)}>Отмена</button>
                        </div>
                    )}
                    <h3>Уроки:</h3>
                    {lessons.length > 0 ? (
                        <ul>
                            {lessons.map((lesson) => (
                                <li key={lesson.id}>
                                    <details>
                                        <summary>Урок {lesson.id}</summary>
                                        <p><strong>Начало:</strong> {lesson.start_time}</p>
                                        <p>
                                            <strong>Учитель:</strong>{" "}
                                            {teachers[lesson.teacher_id]
                                                ? teachers[lesson.teacher_id].login
                                                : "Загрузка..."}
                                        </p>
                                        <button className="delete-lesson-button" onClick={() => handleDeleteLesson(lesson.id)}>Удалить</button>
                                    </details>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Нет уроков для этого курса.</p>
                    )}
                    <h3>Подписчики:</h3>
                    {subscribers.length > 0 ? (
                        <ul>
                            {subscribers.map((user) => (
                                <li key={user.id} className="subscriber-item">
                                    ID: {user.id}, Логин: {user.login || "Логин отсутствует"}
                                    {ratingUserId !== user.id ? (
                                        <button className="rate-button" onClick={() => handleRate(user.id)}>Оценить</button>
                                    ) : (
                                        <div className="rating-container">
                                            <input
                                                type="number"
                                                value={rating}
                                                min="1"
                                                max="10"
                                                onChange={(e) => setRating(e.target.value)}
                                                placeholder="Оценка (1-10)"
                                                className="rating-input"
                                            />
                                            <input
                                                type="number"
                                                value={lessonNumber}
                                                onChange={(e) => setLessonNumber(e.target.value)}
                                                placeholder="Номер урока"
                                                className="lesson-number-input"
                                                style={{ width: '80px' }} // Align length with rating input
                                            />
                                            <button className="save-button-pan" onClick={handleSubmitRating}>Сохранить</button>
                                            <button className="cancel-button" onClick={() => setRatingUserId(null)}>Отмена</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Нет подписчиков для этого курса.</p>
                    )}
                </div>
            )}
            {notification && (
                <Notification message={notification} onClose={() => setNotification('')} type={notificationType} />
            )}
        </div>
    );
};

export default AdminEnrollPage;