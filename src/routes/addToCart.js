import express from "express";
import AddToCartController from '../controllers/addToCart.js'
import Auth from "../helper/auth.js";

const routers = express.Router()
routers.post('/add-to-cart', Auth.userGuard, AddToCartController.addCart)
routers.delete('/del-cart', Auth.userGuard, AddToCartController.delCart)
routers.delete('/del-all-cart', Auth.userGuard, AddToCartController.delAllCart)
routers.post('/get-all-cart', Auth.userGuard, AddToCartController.getAllCart)

export default routers