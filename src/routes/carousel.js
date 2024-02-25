import carouselController from "../controllers/carousel.js";
import Auth from "../helper/auth.js";
import express from "express";

const routers = express.Router()
routers.post('/add-carousel', Auth.authorization, Auth.adminGuard, carouselController.addCrousel)
routers.get('/get-carousel', carouselController.getCrousel)
routers.put('/edit-carousel', carouselController.editCrousel)
routers.delete('/del-carousel', carouselController.delCrousel)

export default routers