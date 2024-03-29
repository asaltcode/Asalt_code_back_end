import syllabusController from '../controllers/syllbus.js';
import express from 'express';
import Authenticate from '../middleware/authenticate.js';

const routers = express.Router()
const admin = "admin"
routers.get('/get-syllabus-by-course-id-normal/:id', syllabusController.getSyllabusByCourseIdNormal)

//Get Syllabus with topics by Course ID
routers.get('/syllabus/course/:id', syllabusController.getSyllabusByCourseId)

// Admin Routers
routers.post('/admin/syllabus/new', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), syllabusController.addSyllabus)
routers.get('/admin/syllabus/course/:id',Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), syllabusController.getSyllabusByCourseIdAdmin)
routers.route('/admin/syllabus/:id')
                                    .put(Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), syllabusController.editSyllabus)
                                    .get(Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), syllabusController.getSyllabusById)
                                    .delete(Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), syllabusController.delSyllabus)

// payment Router
routers.get('/paid/syllabus/course/:id', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin, "user"), syllabusController.getPaidSyllabusByCourseId)



export default routers