import syllabusController from '../controllers/syllbus.js';
import express from 'express';
import Auth from "../helper/auth.js";

const routers = express.Router()
routers.post('/add-syllabus', Auth.authorization, Auth.adminGuard, syllabusController.addSyllabus)
routers.post('/get-all-syllabus', Auth.authorization, Auth.adminGuard, syllabusController.getAllSyllabus)
routers.post('/get-syllabus', syllabusController.getSyllabus)
routers.put('/edit-syllabus/:id', Auth.authorization, Auth.adminGuard, syllabusController.editSyllabus)
routers.post('/get-syllabus-by-id/:id', Auth.authorization, Auth.adminGuard, syllabusController.getSyllabusById)
routers.post('/get-syllabus-by-course-id/:id', syllabusController.getSyllabusByCourseId)
routers.delete('/del-syllabus/:id', Auth.authorization, Auth.adminGuard, syllabusController.delSyllabus)
export default routers