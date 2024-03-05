import paymentController from '../controllers/payment.js'
import express from 'express'
import Auth from '../helper/auth.js'
const routers = express.Router()

routers.post('/order',Auth.userGuard, paymentController.coursePurchase)
routers.post('/payment-capture', paymentController.paymentCapture)
routers.post('/payment-paid-status',Auth.userGuard, paymentController.paidStatus)
routers.post('/course-access', Auth.userGuard, paymentController.courseAccess)


export default routers