import mongoose from "./index.js";

const syllabusSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    course_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true,
    },
    visibility: {
        type: Boolean,
        default: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }    
},
{
    collection: "syllabus",
    versionKey: false
}

)

const SyllabusModle = mongoose.model('syllabus', syllabusSchema)
export default SyllabusModle