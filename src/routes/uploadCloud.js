import express from 'express'
import uploadCloudController, { upload } from '../controllers/uploadCloud.js'
import timeout from 'connect-timeout'

const routers = express.Router()

routers.post('/upload-video',timeout('20m'), upload("video").single("topic"), uploadCloudController.videoUpload)

export default routers