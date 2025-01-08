// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Authorization from './authorization/Authorization.jsx';
import Registration from './authorization/Registration.jsx';
import MainMenu from './courses/MainMenu.jsx'; // Импортируем MainMenu
import Courses from './courses/Courses.jsx';
import Profile from "./Profile/Profile.jsx"; // Импортируем Courses
// Импортируйте другие необходимые компоненты, такие как MyCourses и Profile

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Authorization />} />
                <Route path="/registration" element={<Registration />} />

                {/* Добавляем маршруты для MainMenu */}
                <Route path="/*" element={<MainMenu />}>
                    <Route path="courses" element={<Courses />} />
                    {/*<Route path="my-courses" element={<MyCourses />} /> /!* Пример для "Мои курсы" *!/*/}
                    <Route path="profile" element={<Profile />} />
                </Route>


                {/* Другие маршруты */}
            </Routes>
        </Router>
    );
};

export default App;