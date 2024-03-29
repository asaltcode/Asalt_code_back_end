import paymentController from '../controllers/payment.js'
import express from 'express'
import Auth from '../helper/auth.js'
import Authenticate from '../middleware/authenticate.js';
const routers = express.Router()

routers.post('/order',Authenticate.isAuthenticatedUser, Authenticate.authorizeRole("user"), paymentController.coursePurchase)
routers.post('/payment-capture',Authenticate.isAuthenticatedUser, paymentController.paymentCapture)
routers.post('/payment',Authenticate.isAuthenticatedUser, Authenticate.authorizeRole("user"), paymentController.paidStatus)
routers.post('/course-access', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole("user"), paymentController.courseAccess)


export default routers