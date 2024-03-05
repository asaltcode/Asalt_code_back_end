import express from 'express'
import Auth from '../helper/auth.js'
import topicController from '../controllers/topic.js'
const routers = express.Router()



routers.post('/add-topic', Auth.authorization, Auth.adminGuard, topicController.addTopic)
routers.post('/get-topic-by-syllabus-id/:id', Auth.authorization, Auth.adminGuard, topicController.get_topic_by_syllabus_id)
routers.post('/get-topic-by-id/:id', Auth.authorization, Auth.adminGuard, topicController.getTopicById)
// routers.post('/get-all-syllabus', Auth.authorization, Auth.adminGuard, syllabusController.getAllSyllabus)
// routers.post('/get-syllabus', syllabusController.getSyllabus)
routers.put('/edit-topic/:id', Auth.authorization, Auth.adminGuard, topicController.editTopic)
// routers.delete('/del-syllabus/:id', Auth.authorization, Auth.adminGuard, syllabusController.delSyllabus)
export default routers