import express from "express";
import AddToCartController from '../controllers/addToCart.js'
import Authenticate from "../middleware/authenticate.js";

const routers = express.Router()
const user = "user"
routers.post('/cart/:id', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(user), AddToCartController.addCart)
routers.delete('/cart/:id', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(user), AddToCartController.delCart)
routers.delete('/carts', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(user), AddToCartController.delAllCart)
routers.get('/carts', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(user, "admin"), AddToCartController.getAllCart)
export default routers