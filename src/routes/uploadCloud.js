import express from 'express'
import uploadCloudController from '../controllers/uploadCloud.js'
import timeout from 'connect-timeout'

const routers = express.Router()

routers.post('/upload-video',timeout('1m'), uploadCloudController.videoUpload)

export default routers