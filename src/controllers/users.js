import UserModel from "../models/userModel.js";
import Auth from "../helper/auth.js";
import nodemailer from "nodemailer";
import crypto from 'crypto'
import signupVerification from '../helper/signupVerification.js'
import OtpVerify from "../helper/OtpVerify.js";
import jwt from 'jsonwebtoken'

let generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString() //Otp Gereator
let generateVerificationToken = () => crypto.randomBytes(20).toString('hex'); //Generate a verifiction token

const signup = async (req, res) => {      //user Signup
  try {
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        //Hash the password
        const {name, email, password} = req.body
        
        req.body.password = await Auth.createHash(password);
        req.body.verificationToken = generateVerificationToken();//set verification token 
        signupVerification.signupVerify(name, email, req.body.verificationToken)//Verification mail send
        const newUser = await UserModel.create(req.body);       
        res.status(200).send({
          message: "Check your email !",
        });
      } else {
        res.status(400).send({
          message: `This email already exists`,
        });
      }
    } catch (error) {
      res.status(500).send({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const verify = async(req, res)=>{ // signup verify conformation
  const { token } = req.query;
  try {
    // Find user in the database using the token
    const user = await UserModel.findOne({ verificationToken: token });

    if (!user || user.verified) {
        // Token not found or user already verified
        return res.status(404).send({message:'Invalid or expired verification link.'});
      }      
      // Update user status to "verified"
      const Auth_token = await Auth.createToken({
        email: user.email,
        hash : user.password,
        role: user.role,
      });
       res.status(200).send({message: 'Email Verified Successfully.', token: Auth_token});
      user.verified = true;
      user.verificationToken = undefined; // Clear the verification token
      await user.save();
    // Redirect or render a success page
  } catch (error) {
    res.status(500).send({message:'Internal Server Error',error: error.message});
  }
}

const reSendVerification = async (req, res)=>{
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if(user){
      if (user && !user.verified) {
        const {name, email} = req.body
        user.verificationToken = generateVerificationToken();//set verification token 
        signupVerification.signupVerify(name, email, user.verificationToken)//Verification mail send    
        await user.save();
        res.status(200).send({
          message: "Email has been re-sent",
        });
      } else {
        res.status(400).send({
          message: `This email has already been verified`,
        });
      }
    }else{
      res.status(400).send({
        message: `This email not exist`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

const login = async (req, res) => { //user Login
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      //compare the input password and hash
      if (user.verified) {
                if (await Auth.compareHash(password, user.password)) {

                  const details = {
                    email: user.email,
                    hash : user.password,
                    role: user.role,
                    id: user._id
                  }
                  const token = await Auth.createToken(details);
                  const refreshToken = await Auth.createToken(details)
                  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' }).header('Authorization', token)
                  .send({
                    message: "Login successfully",
                    token,
                    name: user.name, 
                    role: user.role, 
                    id: user._id
                  })
                } else {
                  res.status(400).send({
                    message: `Incorrect Password`,
                    field: "password"
                  });
                }
        } else {
          res.status(400).send({
            message: `Please verify the link in your email to proceed`,
          });
        }

    } else {
      res.status(400).send({
        message: `This user does not exist, please register and continue`,
        field: "email"
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const refreshToken = async (req, res)=>{
  // const refreshToken = req.cookies['refreshToken'];
  // if (!refreshToken) {
  //   return res.status(401).send('Access Denied. No refresh token provided.');
  // }
console.log('Cookies', req.cookies['refreshToken'])
  try {
    const decoded = jwt.verify(refreshToken, 'ldjfuLKjhusdWEfiyhxcvkLKyh');
    const accessToken = jwt.sign({ user: decoded.user }, 'ldjfuLKjhusdWEfiyhxcvkLKyh', { expiresIn: '1h' });
    res
      .header('Authorization', accessToken)
      .send(decoded.user);
  } catch (error) {
    return res.status(400).send('Invalid refresh token.');
  }
}

const forgot = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email: email });

    if (user) {
      const OTP = generateOTP();
      const hashOTP = await Auth.createHash(OTP);
      // await UserModel.findOneAndUpdate({ email: user.email }, { otp: hashOTP });
      user.otp = hashOTP
      user.save()
      setTimeout(async () => {user.otp = null ; user.save()} , 70000);
      console.log(OTP);
      // OtpVerify.OTPverification(user.name, user.email, OTP)
      res.status(200).send({
        message: "OTP has been send",
      });
    } else {
      res.status(400).send({
        message: `User not found`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await UserModel.findOne({ email: email });

    if (user) {
      if (await Auth.compareHash(otp, user.otp)) { //Otp compare
        res.status(200).send({ message: "otp successfully" });
        user.otp = null
        user.save()
      } else {
        res.status(400).send({
          message: 'Incorrect OTP',
        });
      }
    } else {
      res.status(400).send({
        message: `User with '${req.body.email}' dose not exists`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error"
    });
  }
};

const changePassword = async (req, res) =>{
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (user) {
        //Hash the password
       const hashPassword = await Auth.createHash(req.body.password);
        await UserModel.findOneAndUpdate({ email: user.email }, { password: hashPassword});
        res.status(200).send({
          message: "Password Changed successfully!",
        });
      } else {
        res.status(400).send({
          message: `Unable to change password`,
        });
      }
    } catch (error) {
      res.status(500).send({
        message: "Internal Server Error",
        error: error.message,
      });
    }
};

const getAllUser = async (req, res) =>{
  try {
    const users = await UserModel.find({},{password: 0, otp: 0});
    res.status(200).send({
      message: "Get Users fetched successfully!",
      users,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id },{password: 0, status: 0, otp: 0, verified: 0, createdAt: 0});
    if(user){
      res.status(200).send({
        message: "User fetched successfully!",
        user,
      });
    }else{
      res.status(400).send({
        message: "Not found",
        user,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const getUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id },{password: 0, status: 0, otp: 0, verified: 0, createdAt: 0});
    if(user){
      res.status(200).send({
        message: "User fetched successfully!",
        user,
      });
    }else{
      res.status(400).send({
        message: "Not found",
        user,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deletetUserById = async (req, res) => {
  try {
    const user = await UserModel.findById({ _id: req.params.id });
    if (user) {
      await UserModel.deleteOne({ _id: req.params.id });
      res.status(200).send({
        message: "User Deleted Successfully",
      });
    } else {
      res.status(400).send({
        message: `Invalid User Id`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const editUser = async (req, res) =>{
  try {
    const {name, lastName, email, role, gender, dob} = req.body
    const user = await UserModel.findOne({ _id: req.params.id });
    const BodyEmail = await UserModel.findOne({email: req.body.email})
    if(!user){
      return res.status(404).send({
        message: "Not Found"
      })
    } 
    if(email === user.email || email !== user.email ){
       if(!BodyEmail || email === user.email){
        //user updating
         user.name = name
         user.lastName = lastName
         user.email = email
         user.role = role
         user.gender = gender
         user.dob = dob

         await user.save()         
        return res.status(200).send({
          message: "Updated Successfully"
         })
       }else{
        return res.status(400).send({
          message: "This user already exist",
        })
       }
   }
    else{
      return res.status(501).send({
        message : "Not Implemented",
        error: error.message,
      })
    }   
    
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

export default {signup, verify, reSendVerification, login, forgot, verifyOTP, changePassword, getAllUser, refreshToken, getUserById, getUser, deletetUserById, editUser}