// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Authorization from './authorization/Authorization.jsx';
import Registration from './authorization/Registration.jsx';
import MainMenu from './menu/MainMenu.jsx';
import Courses from './menu/courses/Courses.jsx';
import Profile from "./menu/Profile/Profile.jsx";
import AdminCoursesList from "./menu/admin/adminPanelContent/AdminCoursesList.jsx";
import AdminPanel from "./menu/admin/AdminPanel.jsx";
import AdminUsersList from "./menu/admin/adminPanelContent/AdminUserList.jsx";
import AdminEnrollPage from "./menu/admin/adminPanelContent/AdminEnrollPage.jsx";
import UserCourses from "./menu/userCourses/UserCoursesList.jsx";
import CourseDetail from "./menu/userCourses/CourseDetail.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Authorization />} />
                <Route path="/registration" element={<Registration />} />

                <Route path="/*" element={<MainMenu />}>
                    <Route path="courses" element={<Courses />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="my-courses" element={<UserCourses />} />
                    <Route path="courses/:courseId" element={<CourseDetail />} />
                    <Route path="admin/*" element={<AdminPanel />}>
                        <Route path="adminCoursesView" element={<AdminCoursesList />} />
                        <Route path="adminUsersView" element={<AdminUsersList />} />
                        <Route path="inrollCourse" element={<AdminEnrollPage />} />
                        {/* Добавьте другие маршруты для администраторов здесь */}
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
};

export default App;