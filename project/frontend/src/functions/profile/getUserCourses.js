import { getUserFromToken } from "../tokenUtils/tokenUtils.js";
import { fetchUserCourses } from "../api/userCoursesApi.js";

export async function getUserCourses(token) {

    const userData = getUserFromToken(token);
    const userId = userData.id;

    const allCourses = await fetchUserCourses();

    return allCourses.filter(course => course.user_id === userId);
}