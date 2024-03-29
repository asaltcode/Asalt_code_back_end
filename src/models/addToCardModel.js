// import mongoose from './index.js'
import mongoose from "mongoose"


const addToCartSchema = new mongoose.Schema({    
    thumbnail: {
        type : String,
        required : true, 
    },
    price: {
        type : Number,
        required : true,        
    },
    title: {
        type : String,
        required : true,        
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'course'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"    
    },
    createdAt:{
        type: Date,
        default: Date.now(),        
    },
},
{
    collection : "addToCart",
    versionKey: false,
}
)

const AddToCartModel = mongoose.model('addToCart', addToCartSchema)

export default AddToCartModel