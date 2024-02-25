import express from 'express'
import Auth from '../helper/auth.js'
import topicController from '../controllers/topic.js'
const routers = express.Router()



routers.post('/add-topic', Auth.authorization, Auth.adminGuard, topicController.addTopic)
// routers.post('/get-all-syllabus', Auth.authorization, Auth.adminGuard, syllabusController.getAllSyllabus)
// routers.post('/get-syllabus', syllabusController.getSyllabus)
// routers.put('/edit-syllabus/:id', Auth.authorization, Auth.adminGuard, syllabusController.editSyllabus)
// routers.post('/get-syllabus-by-id/:id', Auth.authorization, Auth.adminGuard, syllabusController.getSyllabusById)
// routers.delete('/del-syllabus/:id', Auth.authorization, Auth.adminGuard, syllabusController.delSyllabus)
export default routers