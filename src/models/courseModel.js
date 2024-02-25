import mongoose from './index.js'


const courseSchema = mongoose.Schema({
    thumbnail: {
        type: String,
        required: true,
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
        required: true,
    },
    description: {
        type: String,
        default: ""
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
    collection : "course",
    versionKey: false,
}
)

const CourseModel = mongoose.model('course', courseSchema)

export default CourseModel