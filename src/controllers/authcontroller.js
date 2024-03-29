import {catchAsyncError} from '../middleware/catchAsyncError.js'
import UserModel from '../models/userModel.js';
import Auth from '../helper/auth.js';
import ErrorHandler from '../utils/errorHandler.js';
import sendToken from '../utils/JWT.js';
import sendEmail from '../utils/email.js';
import crypto from "crypto"
//User Register function
let generateVerificationToken = () => crypto.randomBytes(20).toString("hex"); //Generate a verifiction token

const register = catchAsyncError(async (req, res, next) => {      //user Signup
    // const findUser = await UserModel.findOne({ email: req.body.email });
    // if(findUser){
    //     return next(new ErrorHandler("Email already exists", 400))
    // }

    const {name, email, password} = req.body
    //   req.body.verificationToken = generateVerificationToken();//set verification token 
    //   signupVerification.signupVerify(name, email, req.body.verificationToken)//Verification mail send
     const user =  await UserModel.create({name, email, password})
    //  const token = await user.getJwtToken()
     sendToken(user, 200, res) 
   
})

const signIn = catchAsyncError(async (req, res, next) => { //user Login
    const { email, password } = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please enter email & password", 400))
    }

    //finding the user database
    const user = await UserModel.findOne({ email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    if(!await user.isValidPassword(password)){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

   await sendToken(user, 201, res)
    
})

const logout = catchAsyncError(async (req, res, next) =>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true
    }).status(200).send({
        success: true,
        message: "Loggedout"
    })
    
})

const forgotPassword = catchAsyncError(async (req, res, next) =>{
    const user = await UserModel.findOne({email: req.body.email})
    if(!user){
        return next(new ErrorHandler("User not found with this email", 404))
    }
    const resetToken = await user.getResetToken();
    await user.save({validateBeforeSave: false})

    //reset url
    // const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;
    const resetUrl = `${req.get('origin')}/password/reset/${resetToken}`;
    const message = `Your passwword reset url is as follows \n\n
    ${resetUrl} \n\n If you have not reqested this email, then ignor it.`;

    try {
       await sendEmail({
        email: user.email,
        subject: "Asalt Code Password Recovery",
        message
       })

       res.status(200).send({
        success: true,
        message: `Email send to ${user.email}`
       })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message, 500 ))
    }
})

const resetPassword = catchAsyncError(async (req, res, next) =>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest('hex')
    const user = await UserModel.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: {
            $gt: Date.now()
        }
    })

    if(!user){
        return next(new ErrorHandler("Password reset token is invalid or expired", 400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password dose not match", 400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({validateBeforeSave: false})

    sendToken(user, 201, res)
})

export default {register, signIn, logout, forgotPassword, resetPassword}