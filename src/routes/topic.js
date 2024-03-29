import express from 'express'
import Auth from '../helper/auth.js'
import topicController from '../controllers/topic.js'
import Authenticate from '../middleware/authenticate.js'
const routers = express.Router()
const admin = "admin"

routers.post('/admin/topic/new', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), topicController.addTopic)
routers.get('/admin/topic/syllabus/:id', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), topicController.get_topic_by_syllabus_id)

routers.put('/edit-topic/:id', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), topicController.editTopic)

routers.route("/admin/topic/:id")
                                .get(Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), topicController.getTopicById)
                                .put(Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), topicController.editTopic)
                                .delete(Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), topicController.deleteTopic)


// routers.post('/get-topic-by-syllabus-id/:id', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), topicController.get_topic_by_syllabus_id)
// routers.post('/get-topic-by-id/:id', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), topicController.getTopicById)
// routers.put('/edit-topic/:id', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), topicController.editTopic)




// routers.post('/get-all-syllabus', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), syllabusController.getAllSyllabus)
// routers.post('/get-syllabus', syllabusController.getSyllabus)
// routers.delete('/del-syllabus/:id', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), syllabusController.delSyllabus)
export default routers