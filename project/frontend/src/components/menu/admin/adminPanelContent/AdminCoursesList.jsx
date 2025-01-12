import React, { useEffect, useState } from 'react';
import { fetchCoursesData, updateCourseData, deleteCourseData, addCourseData } from "../../../../functions/api/coursesApi.js";
import '../../../../styles/AdminCourses.css';
import { getUserFromToken } from "../../../../functions/tokenUtils/tokenUtils.js";

const AdminCoursesList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingCourse, setEditingCourse] = useState(null);
    const [updatedName, setUpdatedName] = useState('');
    const [updatedPrice, setUpdatedPrice] = useState('');
    const [newCourseName, setNewCourseName] = useState('');
    const [newCoursePrice, setNewCoursePrice] = useState('');
    const [isAddingCourse, setIsAddingCourse] = useState(false); // Состояние для управления отображением полей добавления курса

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const userData = getUserFromToken(token);
                console.log(userData);
                const data = await fetchCoursesData();
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

    const handleEditClick = (course) => {
        setEditingCourse(course.id);
        setUpdatedName(course.name);
        setUpdatedPrice(course.price);
    };

    const handleUpdateCourse = async (courseId) => {
        try {
            const updatedData = {
                user_cource_id: null, // Устанавливаем правильное поле
                price: updatedPrice.trim(),
                name: updatedName.trim(),
            };

            // Проверка на пустые поля
            if (!updatedData.name || !updatedData.price) {
                throw new Error('Имя и цена курса должны быть заполнены корректно.');
            }

            console.log('Отправляемые данные для обновления курса:', updatedData);

            await updateCourseData(courseId, updatedData);
            setCourses(courses.map(course => (course.id === courseId ? { ...course, ...updatedData } : course)));
            setEditingCourse(null);
        } catch (error) {
            console.error(error);
            setError('Ошибка при обновлении курса: ' + error.message);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        try {
            await deleteCourseData(courseId);
            setCourses(courses.filter(course => course.id !== courseId));
        } catch (error) {
            console.error(error);
            setError('Ошибка при удалении курса');
        }
    };

    const handleAddCourse = async () => {
        try {
            const newCourseData = {
                user_cource_id: null, // Устанавливаем правильное значение null
                name: newCourseName,
                price: parseFloat(newCoursePrice), // Преобразуем в число
            };

            // Проверка на пустые поля
            if (!newCourseData.name || !newCourseData.price) {
                throw new Error('Название и цена курса должны быть заполнены корректно.');
            }

            console.log('Отправляемые данные для добавления курса:', newCourseData);

            const addedCourse = await addCourseData(newCourseData);
            setCourses([...courses, addedCourse]);
            setNewCourseName('');
            setNewCoursePrice('');
            setIsAddingCourse(false); // Закрываем поля после добавления курса
        } catch (error) {
            console.error(error);
            setError('Ошибка при добавлении курса: ' + error.message);
        }
    };

    const handleCancelEdit = () => {
        setEditingCourse(null);
        setUpdatedName('');
        setUpdatedPrice('');
    };

    const handleCancelAdd = () => {
        setIsAddingCourse(false); // Закрываем поля добавления курса
        setNewCourseName('');
        setNewCoursePrice('');
    };

    if (loading) return <p>Загрузка курсов...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="admin-courses-container">
            <button className="admin-add-course-button" onClick={() => setIsAddingCourse(true)}>Добавить курс</button>
            {isAddingCourse && (
                <div className="new-course-form">
                    <input
                        type="text"
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                        placeholder="Название нового курса"
                        className="new-course-input"
                    />
                    <input
                        type="number"
                        value={newCoursePrice}
                        onChange={(e) => setNewCoursePrice(e.target.value)}
                        placeholder="Цена нового курса"
                        className="new-course-input"
                    />
                    <button onClick={handleAddCourse} className="admin-save-button">Сохранить курс</button>
                    <button onClick={handleCancelAdd} className="admin-cancel-button">Отмена</button>
                </div>
            )}
            <table className="admin-courses-table">
                <thead>
                <tr>
                    <th>Название курса</th>
                    <th>Цена</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {courses.map((course) => (
                    <tr key={course.id}>
                        <td>
                            {editingCourse === course.id ? (
                                <input
                                    type="text"
                                    value={updatedName}
                                    onChange={(e) => setUpdatedName(e.target.value)}
                                />
                            ) : (
                                course.name
                            )}
                        </td>
                        <td>
                            {editingCourse === course.id ? (
                                <input
                                    type="number"
                                    value={updatedPrice}
                                    onChange={(e) => setUpdatedPrice(e.target.value)}
                                />
                            ) : (
                                `${course.price} ₽`
                            )}
                        </td>
                        <td>
                            {editingCourse === course.id ? (
                                <>
                                    <button className="admin-save-button" onClick={() => handleUpdateCourse(course.id)}>Сохранить</button>
                                    <button className="admin-cancel-button" onClick={handleCancelEdit}>Назад</button>
                                </>
                            ) : (
                                <>
                                    <button className="admin-edit-button" onClick={() => handleEditClick(course)}>Изменить</button>
                                    <button className="admin-delete-button" onClick={() => handleDeleteCourse(course.id)}>Удалить</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminCoursesList;