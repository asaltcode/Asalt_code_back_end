import express from 'express';
import UserController from "../controllers/users.js"
import Auth from '../helper/auth.js';

const routers = express.Router()

routers.post('/signup', UserController.signup)
routers.put('/re-send', UserController.reSendVerification)
routers.get('/verify', UserController.verify) //this is a signup token verification router
routers.post('/login', UserController.login)
routers.post('/refresh', UserController.refreshToken)

routers.post('/forgot', UserController.forgot)
routers.post('/otp-verify', UserController.verifyOTP)
routers.post('/change-password', UserController.changePassword)
routers.get('/get-all-user',Auth.authorization, Auth.adminGuard, UserController.getAllUser)
routers.get('/get-user-by-id/:id', Auth.authorization, Auth.adminGuard, UserController.getUserById)


routers.get('/get-user/:id', Auth.authorization, Auth.userGuard, UserController.getUser)

routers.delete('/delete-user-by-id/:id', Auth.authorization, Auth.adminGuard, UserController.deletetUserById)
routers.put('/edit-user/:id', Auth.authorization, Auth.adminGuard, UserController.editUser)
// Admin and user producted routeing api endpoint
routers.post('/product',Auth.authorization,Auth.userProduct)
routers.post('/admin-product',Auth.authorization,Auth.adminProduct)

// Admin DashBard Routes
// routers.get('get-all-users', UserController.getAllUser)


export default routers