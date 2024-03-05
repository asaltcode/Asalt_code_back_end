import mongoose from './index.js'


const purchaseSchema = new mongoose.Schema({    
    price: {
        type : Number,
        required : true,        
    },
    syllabus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'syllbus'
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'course'
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"    
    },
    payment_status: {
       
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default: ""
    },
    visibility: {
        type: Boolean,
        default: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),        
    },
},
{
    collection : "purchase",
    versionKey: false,
}
)

const PurchaseModel = mongoose.model('purchase', purchaseSchema)

export default PurchaseModel