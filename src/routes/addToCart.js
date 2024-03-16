import express from "express";
import AddToCartController from '../controllers/addToCart.js'
import Auth from "../helper/auth.js";

const routers = express.Router()
routers.post('/add-to-cart',Auth.authorization, Auth.userGuard, AddToCartController.addCart)
routers.delete('/del-cart',Auth.authorization, Auth.userGuard, AddToCartController.delCart)
routers.delete('/del-all-cart',Auth.authorization, Auth.userGuard, AddToCartController.delAllCart)
routers.get('/get-all-cart',Auth.authorization, Auth.userGuard, AddToCartController.getAllCart)

export default routers