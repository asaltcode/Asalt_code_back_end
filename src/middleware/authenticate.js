import Auth from "../helper/auth.js";
import UserModel from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";

const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Login first to handle this resource", 401))
    }
    const decoded = await Auth.decodeTokens(token)
    req.user = await UserModel.findById(decoded.id)
    next()
})

const authorizeRole = (...roles) =>{
   return (req, res, next) =>{
       if(!roles.includes(req.user.role)){
        return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 401))
       }
       next()
    }
}

export default {isAuthenticatedUser, authorizeRole}