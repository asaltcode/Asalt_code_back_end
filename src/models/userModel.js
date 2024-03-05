import mongoose from "./index.js";

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(?=.*[a-zA-Z0-9._%+-]+@(?:gmail\.com|outlook\.com|yahoo\.com|zoho\.com)$).+$/
      );
  };

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required :[true, "Name is required"]
    },
    lastName: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required :[true, "Email is required"],
        lowercase: true,
        validate:{
            validator:validateEmail,
            message: props => `${props.value} is not a valid email!`
        }        
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    status: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        default: "user"
    },
    dob: {
        type: Date,
        default: "dd-mm-yyyy"
    },
    gender: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: null
    },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
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

const UserModel = mongoose.model('user', userSchema)

export default UserModel