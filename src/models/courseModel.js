import mongoose from "mongoose";


const courseSchema = new mongoose.Schema({
    thumbnail: {
        type: String,
        required: [true, "Thumbnail is Required"],
        validate: {
          validator: function(value) {
            // Regular expression to validate URL format
            const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
            // Check if the value matches the URL format
            return urlRegex.test(value);
          },
          message: 'Invalid URL format for image'
        }
    },
    price: {
        type : Number,
        required : [true, "Price is Required"],  
        default: 0.0      
    },
    ratings : {
        type: String,
        default: 0
    },
    syllabus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'syllbus'
    },
    author: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        required: [true, "Title is Required"]
    },
    description: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        enum: {
            values: [
                "Hacking",
                "Web Development",
                "Data Science",
                "Career"
            ],
            message: "Please select correct category"
        }
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            rating: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    visibility: {
        type: Boolean,
        default: true
    },
    user: {
        type : mongoose.Schema.Types.ObjectId
    },
    createdAt:{
        type: Date,
        default: Date.now(),        
    },
},
{
    collection : "course",
    versionKey: false,
}
)

const CourseModel = mongoose.model('course', courseSchema)

export default CourseModel