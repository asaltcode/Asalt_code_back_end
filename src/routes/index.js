import express from "express";
import IndexController from "../controllers/index.js"
import UserRoutes from './users.js'
import CarouselRoutes from './carousel.js'
import CourseRouters from "./course.js"
import SyllabusRouters from "./syllbus.js"
import TopicRouters from "./topic.js"
import uploadCloudRoutes from './uploadCloud.js'

const routers = express.Router()
routers.get('/', IndexController.homePage)
routers.use('/', UserRoutes)
routers.use('/', CarouselRoutes)
routers.use('/', CourseRouters)
routers.use('/', CourseRouters)
routers.use('/', SyllabusRouters)
routers.use('/', TopicRouters)
routers.use('/', uploadCloudRoutes)

export default routers
