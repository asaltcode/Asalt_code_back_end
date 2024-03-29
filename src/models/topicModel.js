// import mongoose from "./index.js";
import mongoose from "mongoose"

const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    syllabus_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'syllabus',
            required: true
        },
    topic_video: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    topic_video_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "videos",
        required: true,
    },
    public_id: {
        type: String,
        require: true
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
    collection: "topic",
    versionKey: false
}
)

const TopicModle = mongoose.model('topic', topicSchema)
export default TopicModle