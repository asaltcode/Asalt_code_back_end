import mongoose from './index.js'


const paymentSchema = new mongoose.Schema({    
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
    payment_status: {
        type: String,
        default: null
    },
    access:{
        type: Boolean,
        default: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"    
    },
    order_id: {
        type: String,        
        required: true
    },    
    paymentId: {
        type: String,
        default: null
    },
    signature: {
        type: String,
        default: null
    },  
    createdAt:{
        type: Date,
        default: Date.now(),        
    },
},
{
    collection : "payment",
    versionKey: false,
}
)

const paymentModel = mongoose.model('payment', paymentSchema)

export default paymentModel