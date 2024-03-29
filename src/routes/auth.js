import express from "express";
import authcontroller from "../controllers/authcontroller.js";
import  Authenticate from "../middleware/authenticate.js";
const routers = express.Router()

routers.post("/signup", authcontroller.register)
routers.post("/login", authcontroller.signIn)
routers.get("/logout", authcontroller.logout)
routers.post("/password/forgot", authcontroller.forgotPassword)
routers.post("/password/reset/:token", authcontroller.resetPassword)

export default routers