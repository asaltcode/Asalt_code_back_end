import mongoose from "mongoose";
import Auth from "../helper/auth.js";
import crypto from "crypto"

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(?=.*[a-zA-Z0-9._%+-]+@(?:gmail\.com|outlook\.com|yahoo\.com|zoho\.com)$).+$/
      );
  };

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required :[true, "Please enter name"],
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
        default: "",
    },
    email: {
        type: String,
        required :[true, "Please enter email"],    
        unique: true,  
        trim: true, 
        validate:{
            validator:validateEmail,
            message: props => `${props.value} is not a valid email!`
        }, 
        lowercase: true
    },
    password: {
        type: String,
        trim: true,
        minlength: [6, 'Password cannot exceed 6 characters'],
        select: false,
        required: [true, "Please enter password"],
    },
    status: {
        type: Boolean,
        default: true
    },
    avatar: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    role: {
        type: String,
        default: "user"
    },
    dob: {
        type: String,
        default: "dd-mm-yyyy"
    },
    gender: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: null,
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    verified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpire: Date,
    createdAt:{
        type: Date,
        default: Date.now()
    }

},
{
collection : "user",
versionKey: false
}
)

userSchema.pre("save", async function (next) {
    if(!this.isModified('password')){
        next();
    }
    this.password = await Auth.createHash(this.password)
})

userSchema.methods.getJwtToken = async function(){
   return await Auth.createToken({id: this.id})
}

userSchema.methods.isValidPassword = async function(enteredPassword){    
   return await Auth.compareHash(enteredPassword, this.password)    
}

userSchema.methods.getResetToken = async function(){
    //Generet Token
   const token = crypto.randomBytes(20).toString('hex')

   //Generate Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')

  //Set token expire time
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000; //Add 30 minutes

  return token
}

userSchema.methods.getVerifyToken = async function(){
    //Generet Verify Token
    const token = crypto.randomBytes(25).toString("hex")
    //Generet Hash and set ot verify Token
    this.verificationToken = crypto.createHash("sha256").update(token).digest("hex")
    //Set verify token expire time
    this.verificationTokenExpire = Date.now() + (2 * 60 * 60 * 1000); // Add 2 hours
}

const UserModel = mongoose.model('user', userSchema)

export default UserModel