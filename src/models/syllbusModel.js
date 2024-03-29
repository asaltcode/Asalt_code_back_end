import mongoose from "mongoose";

const syllabusSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    course_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true,
    },
    items:{
        type: Array,
        default: []
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