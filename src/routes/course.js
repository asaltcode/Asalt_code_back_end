import courseController from "../controllers/course.js";
import express from 'express'
import Auth from "../helper/auth.js";
import  Authenticate from "../middleware/authenticate.js";

const routers = express.Router()
// routers.get('/courses', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole("admin", "user", "guest"), courseController.getCourse)
routers.get('/courses', courseController.getCourses)
routers.get("/my-courses", Authenticate.isAuthenticatedUser, courseController.myCourses)
routers.route("/course/:id")
.get(courseController.getCourseById)
.put(Authenticate.isAuthenticatedUser, Authenticate.authorizeRole("admin"), courseController.editCourse)
.delete(Authenticate.isAuthenticatedUser, Authenticate.authorizeRole("admin"), courseController.delCourse)
// Admin Routers
routers.post('admin/course/new', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole("admin"), courseController.addCourse)
routers.get('/admin/courses', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole("admin"), courseController.getAdminCourse)

export default routers