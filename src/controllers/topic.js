import Topic from "../models/topicModel.js";
import SyllabusModle from "../models/syllbusModel.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

const addTopic = catchAsyncError(async (req, res, next) => {
  const topic = await Topic.findOne({
    topic_video: req.body.topic_video,
  });
  if (!topic) {
    const topic = await Topic.create(req.body);
    res.status(200).send({
      message: "Topic added successfully",
    });
  } else {
    res.status(400).send({
      message: "This Video areade exist",
    });
  }
})

const get_topic_by_syllabus_id = catchAsyncError(async (req, res, next) => {
  const syllabus = await SyllabusModle.findById(req.params.id);
  if(!syllabus){
    return next(new ErrorHandler("Not found", 404))
  }
  const topics= await Topic.find({ syllabus_id: syllabus._id });
    res.status(200).send({
      success: true,
      message: "Topic get successfully",
      topics,
    });
  
})

 const editTopic = catchAsyncError( async(req, res, next) =>{
  let topic  = await Topic.findOne({ _id: req.params.id });
  if(!topic){
    return next(new ErrorHandler("Not found", 404))
  }
  topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
  res.status(201).send({
    success: true,
    topic,
    message: "Updated Successfully!"
  })
 })
 const getTopicById = catchAsyncError(async(req, res, next) =>{
  const topic = await Topic.findById(req.params.id);
  if (!topic) {
     return next(new ErrorHandler("Not found", 404))
  } 
  res.status(200).send({
    success: true,
    topic,
    message: "Topic featched Successfully",
  });
 })

 const deleteTopic = catchAsyncError(async (req, res, next) =>{
  const topic = await Topic.findByIdAndDelete(req.params.id)
  if(!topic){
    return next(ErrorHandler("Bad Request", 400))
  }
  res.status(204).send({
    success: true,
    message: "Deleted Successfully!"
  })
 })


export default { addTopic, get_topic_by_syllabus_id, editTopic, getTopicById, deleteTopic };
