import carouselController from "../controllers/carousel.js";
import express from "express";
import Authenticate from "../middleware/authenticate.js";

const routers = express.Router()
routers.get('/carousels', carouselController.getCarousel)

const admin = "admin"
// Admin Routers
routers.get('/admin/carousels',  Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), carouselController.getAllCarousel)
routers.post('/admin/carousel', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), carouselController.addCarousel)

routers.route("/admin/carousel/:id")
                                    .get(Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), carouselController.getCarouselById)
                                    .put(Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), carouselController.editCarousel)
                                    .delete(Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), carouselController.delCarousel)

export default routers