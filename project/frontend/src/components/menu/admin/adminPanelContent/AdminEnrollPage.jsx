import React, { useEffect, useState } from "react";
import { getUserFromToken } from "../../../../functions/tokenUtils/tokenUtils.js";
import { fetchCoursesData } from "../../../../functions/api/coursesApi.js";
import { fetchLessons } from "../../../../functions/api/lessonsApi.js";
import { fetchUserFromId } from "../../../../functions/api/userApi.js";
import { fetchSubscribers } from "../../../../functions/fetchSubscribers.js"; // Импорт функции
import "../../../../styles/AdminEnrollPage.css";

const AdminEnrollPage = () => {
    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [teachers, setTeachers] = useState({});

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

                // Вызов функции для получения подписчиков
                const subscribersPromises = lessonsData.map(lesson => {
                    console.log(`Запрос подписчиков для урока ID: ${lesson.course_id}`);
                    return fetchSubscribers(lesson.course_id);
                });

                const subscribersData = await Promise.all(subscribersPromises);
                console.log('Полученные подписчики для каждого урока:', subscribersData);

                lessonsData.forEach((lesson, index) => {
                    lesson.subscribers = subscribersData[index] || []; // Обеспечиваем, что это массив
                    console.log(`Подписчики для урока ${lesson.id}:`, lesson.subscribers);
                });

                // Логируем перед обновлением состояния
                console.log('Обновление уроков с подписчиками:', lessonsData);
                setLessons(lessonsData); // Обновляем состояние с уроками
            } else {
                setLessons([]);
                setTeachers({});
            }
        };

        loadLessons();
    }, [selectedCourse]);

    const getCourseInfo = (course) => {
        return {
            getId: () => course.id,
            getUserCourseId: () => course.user_cource_id,
            getPrice: () => course.price,
            getName: () => course.name,
        };
    };

    if (loading) return <p>Загрузка курсов...</p>;
    if (error) return <p>{error}</p>;

    const courseInfo = selectedCourse ? getCourseInfo(selectedCourse) : null;

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
                        <tr key={course.id} onClick={() => setSelectedCourse(course)} className="clickable-row">
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
                    <button className="close-enrollInfo-button" onClick={() => setSelectedCourse(null)}>Закрыть</button>
                    <button className="add-lesson-button">Добавить урок</button>
                    <h3>Уроки:</h3>
                    {lessons.length > 0 ? (
                        <ul>
                            {lessons.map((lesson) => (
                                <li key={lesson.id}>
                                    <details>
                                        <summary>Урок {lesson.id}</summary>
                                        <p><strong>Начало:</strong> {lesson.start_time}</p>
                                        <p><strong>Учитель:</strong> {teachers[lesson.teacher_id] ? teachers[lesson.teacher_id].login : 'Загрузка...'}</p>
                                        <p>Дополнительная информация...</p>

                                        {/* Отображение подписчиков */}
                                        <h4>Подписчики:</h4>
                                        {lesson.subscribers ? (
                                            <div>
                                                {console.log(`Подписчики для урока ${lesson.id}:`, lesson.subscribers)}
                                                {lesson.subscribers.length > 0 ? (
                                                    <ul>
                                                        {lesson.subscribers.map((user) => (
                                                            <>console.log(user.id)
                                                            <li key={user.id}>
                                                                {user.login} {/* Предполагается, что у пользователя есть поле login */}
                                                                <button className="rating-button">Оценка</button>
                                                            </li>
                                                            </>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>Нет подписчиков для этого урока.</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p>
                                                {console.log("Нет подписчиков для этого ")}
                                                Нет подписчиков для этого урока.</p>
                                        )}
                                    </details>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Нет уроков для этого курса.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminEnrollPage;