import courseController from "../controllers/course.js";
import express from 'express'
import Auth from "../helper/auth.js";

const routers = express.Router()
routers.post('/add-course', Auth.authorization, Auth.adminGuard, courseController.addCourse)
routers.post('/get-all-course', Auth.authorization, Auth.adminGuard, courseController.getAllCourse)
routers.post('/get-course', courseController.getCourse)
routers.put('/edit-course/:id', Auth.authorization, Auth.adminGuard, courseController.editCourse)
routers.post('/get-course-by-id/:id', courseController.getCourseById)
routers.delete('/del-course/:id', Auth.authorization, Auth.adminGuard, courseController.delCourse)

export default routers