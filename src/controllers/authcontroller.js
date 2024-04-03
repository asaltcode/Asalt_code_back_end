import {catchAsyncError} from '../middleware/catchAsyncError.js'
import UserModel from '../models/userModel.js';
import ErrorHandler from '../utils/errorHandler.js';
import sendToken from '../utils/JWT.js';
import sendEmail from '../utils/email.js';
import crypto from "crypto"
//User Register function

const register = catchAsyncError(async (req, res, next) => {      //user Signup
    const token = crypto.randomBytes(25).toString("hex")     //Generet Hash and set ot verify Token
    const verifiToken = crypto.createHash("sha256").update(token).digest("hex")
    req.body.verificationToken = verifiToken   //Set verify token expire time
    req.body.verificationTokenExpire = Date.now() + (2 * 60 * 60 * 1000); // Add 2 hours

    const {name, email, password, verificationToken, verificationTokenExpire} = req.body

    const verifiUrl = `${req.get('origin')}/verify?token=${token}`;
    const message = `Hello ${name},\n
    Thank you for signing up with <b>Asalt code!</b> To complete the registration process, please verify your email address by clicking the link below:\n
    ${verifiUrl}\n\n
    If you didn't sign up for Asalt Code, please ignore this email.\n
    The link expires in 2 hours.\n
    Best Regards\n
    Asalt Code Private Limited Team`



    await sendEmail({email, subject: "Verify Your Account - Asalt Code", message})

     const user =  await UserModel.create({name, email, password, verificationToken, verificationTokenExpire})
     res.status(201).send({
        message: true,
        message: "Veriy Your Email",
        user
     })   
})

const verify = catchAsyncError(async (req, res, next) =>{
    const { token } = req.query;
    // Find user in the database using the token
    const verificationToken = crypto.createHash("sha256").update(token).digest('hex')
    const user = await UserModel.findOne({ verificationToken, verificationTokenExpire: { $gt: Date.now()} });
    if(!user || user.verified){
        return next(new ErrorHandler("Verify token is invalid or expired", 400))
    }

    user.verified = true;
    user.verificationToken = undefined; // Clear the verification token
    user.verificationTokenExpire = undefined;
    await user.save();
    await sendToken(user, 201, res, "Email Verified Successfully")
})

const signIn = catchAsyncError(async (req, res, next) => { //user Login
    
    const { email, password } = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please enter email & password", 400))
    }

    //finding the user database
    const user = await UserModel.findOne({ email}).select("+password");
    if(user && !user.verified){
        const {email} = user
        const token = crypto.randomBytes(25).toString("hex")     //Generet Hash and set ot verify Token
        const verifiToken = crypto.createHash("sha256").update(token).digest("hex")
        const verifiUrl = `${req.get('origin')}/verify?token=${token}`;
        const message = `Hello ${user.name},\n
        Thank you for signing up with <b>Asalt code!</b> To complete the registration process, please verify your email address by clicking the link below:\n
        ${verifiUrl}\n\n
        If you didn't sign up for Asalt Code, please ignore this email.\n
        The link expires in 2 hours.\n
        Best Regards\n
        Asalt Code Private Limited Team`
        
        user.verificationToken = verifiToken   //Set verify token expire time
        user.verificationTokenExpire = Date.now() + (2 * 60 * 60 * 1000); // Add 2 hours
        await user.save()
        await sendEmail({email, subject: "Verify Your Account - Asalt Code", message})
        return next(new ErrorHandler("Please verify your email", 400))
    }
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    if(!await user.isValidPassword(password)){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

   await sendToken(user, 201, res)
    
})

const logout = catchAsyncError(async (req, res, next) => {
    let cookieOptions = {
        expires: new Date(0),
        httpOnly: true
    };

    if (req.headers['x-forwarded-proto'] === 'https') {
        cookieOptions.secure = true;
    }

    res.clearCookie("token", cookieOptions)
        .status(200)
        .send({
            success: true,
            message: "Logged out"
        });
});


// const logout = catchAsyncError(async (req, res, next) =>{
//     res.cookie("token", null, {
//         expires: new Date(Date.now()),
//         httpOnly: true,
//         secure: true
//     }).status(200).send({
//         success: true,
//         message: "Loggedout"
//     })
    
// })

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

export default {register, verify, signIn, logout, forgotPassword, resetPassword}