import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserModel from '../models/userModel.js';
import CourseModel from '../models/courseModel.js';
import paymentModel from '../models/paymentModel.js';
const saltRound = 10;

//Create hash
const createHash = async (data)=>{
    let salt = await bcrypt.genSalt(saltRound);
    let hash = await bcrypt.hash(data, salt);
    return hash
}

//Comparing hashed passwords
const compareHash = async(data, hash) => await bcrypt.compare(data, hash)

//Create new Tokens
const createToken = async(payload)=>{
    let token = await jwt.sign(payload, process.env.JWT_SECRET,{
       expiresIn : process.env.JWT_EXPIRY
    })
    return token
}
//Decode token
const decodeToken = async(token)=> await jwt.decode(token)

//moddleware
const authorization = async(req, res, next)=>{
    const token = req?.headers?.authorization?.split(" ")[1]
    if(token){
    const payload = await decodeToken(token)
    const currentDate = Math.floor(+new Date()/1000)
    if (currentDate < payload?.exp) {
       
        next()        
    } else {
        res.status(402).send({
            message: "Session expired"
        })
    }

    }else{
        res.status(402).send({
            message: "Unauthorised access"
        })
    }    
}
//admin role based authentication
const adminGuard = async(req, res, next)=>{
    const token = req?.headers?.authorization?.split(" ")[1]
    if(token){
        const payload = await decodeToken(token)
        const user = await UserModel.findOne({ email: payload?.email});
    const currentDate = Math.floor(+new Date()/1000)
    if (payload.role === "admin" && user.role === "admin") {
        next()        
    } else {
        res.status(402).send({
            message: "Only Admins are allowed"
        })
    }
    }else{
        res.status(402).send({
            message: "Unauthorised access"
        })
    }    
}
//user role based authentication
const userGuard = async(req, res, next)=>{
    const token = req?.headers?.authorization?.split(" ")[1]
    if(token){
    const payload = await decodeToken(token)
    const currentDate = Math.floor(+new Date()/1000)
    const user = await UserModel.findOne({ email: payload?.email});
    if (payload.role === "user" && user.role === "user") {       
        next()        
    } else {
        res.status(401).send({
            message: "Only Users are allowed"
        })
    }

    }else{
        res.status(401).send({
            message: "Unauthorized access"
        })
    }
    
}

const userProduct = async(req, res, next) =>{
    const token = req?.headers?.authorization?.split(" ")[1]
    if(token){
    const payload = await decodeToken(token)
    const currentDate = Math.floor(+new Date()/1000)
    const user = await UserModel.findOne({ email: payload?.email});
    if (payload.role === "user" && user.role === "user") {
        res.status(200).send({message: "isValide"})
        next()        
    } else {
        res.status(401).send({
            message: "Only Users are allowed"
        })
    }
    }else{
        res.status(401).send({
            message: "Unauthorised access"
        })
    }
}
const adminProduct = async(req, res, next) =>{
    const token = req?.headers?.authorization?.split(" ")[1]
    if(token){
    const payload = await decodeToken(token)
    const currentDate = Math.floor(+new Date()/1000)
    const user = await UserModel.findOne({ email: payload?.email});
    if (payload.role === "admin" && user.role === "admin") {
        res.status(200).send({message: "isValide"})    
    } else {
        res.status(401).send({
            message: "Only admins are allowed"
        })
    }

    }else{
        res.status(401).send({
            message: "Unauthorised access"
        })
    }
}

const userPayment = async(req, res, next) =>{
    const token = req?.headers?.authorization?.split(" ")[1]
    if(token){
        const payload = await decodeToken(token)
        const currentDate = Math.floor(+new Date()/1000)
        const user = await UserModel.findOne({ _id: payload?.id});
        if (payload?.role === "user" && user?.role === "user") {
            const course = await CourseModel.findOne({_id: req.params.id})
            const payment = await paymentModel.findOne({$and: [{course_id: course._id}, {access: true}, {user_id: payload.id}]})
           
            if(payment){
                if(currentDate < payload.exp){
                next()
                }else{
                   res.status(402).send({
                    message: "Session expired"
                   })
                }            
            }
        else{
            res.status(402).send({
                message: "You have not paid for this"
            })
        }     
    } else {
        res.status(401).send({
            message: "Only Users are allowed"
        })
    }
    }else{
        res.status(401).send({
            message: "Unauthorised access"
        })
    }
}

export default {
    createHash, 
    compareHash,
    createToken,
    decodeToken,
    authorization,
    adminGuard,
    userGuard,
    userProduct,
    adminProduct,
    userPayment
}