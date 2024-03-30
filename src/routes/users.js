import express from 'express';
import UserController from "../controllers/users.js"
import Auth from '../helper/auth.js';
import Authenticate from '../middleware/authenticate.js';
import multer from 'multer';
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';
import { upload } from '../controllers/uploadCloud.js';
import timeout from 'connect-timeout'


const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename);

const fileFilter = function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const uploads = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname,'..', 'uploads/user'))
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }    
}),
fileFilter: fileFilter,
limits: {
    fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
}
})

const routers = express.Router()
const admin = "admin"
// routers.post('/signup', UserController.signup)
routers.put('/re-send', UserController.reSendVerification)
routers.get('/verify', UserController.verify) //this is a signup token verification router
// routers.post('/login', UserController.login)
routers.post('/refresh', UserController.refreshToken)

// routers.post('/forgot', UserController.forgot)
routers.post('/otp-verify', UserController.verifyOTP)
// routers.post('/change-password', UserController.changePassword)

//Get Silgle Any User Role
// Admin and user producted routeing api endpoint
routers.post('/product',Auth.authorization,Auth.userProduct)
routers.post('/admin-product',Auth.authorization,Auth.adminProduct)

// Admin DashBard Routes

routers.post("/profile/update", Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin, "user"), timeout('10m'), upload("image").single("avatar"), UserController.profileUpdate)

routers.get('/user', Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin, "user"), UserController.getUser)
routers.get('/admin/users',Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), UserController.getAllUser)
routers.route("/admin/user/:id")
                         .get(Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), UserController.getUserById)
                         .delete(Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), UserController.deletetUserById)
                         .put( Authenticate.isAuthenticatedUser, Authenticate.authorizeRole(admin), UserController.editUser)
export default routers