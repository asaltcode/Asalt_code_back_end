import mongoose from "mongoose";


const paymentSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'course'
    },
    payment_status: {
        type: String,
        default: null
    },
    access: {
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
    paymentId: String,
    signature: String,
    paidAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    collection: "payment",
    versionKey: false
});

const paymentModel = mongoose.model('payment', paymentSchema);

export default paymentModel;