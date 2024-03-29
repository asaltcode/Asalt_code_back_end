import { catchAsyncError } from "../middleware/catchAsyncError.js";
import CourseModel from "../models/courseModel.js";
import paymentModel from "../models/paymentModel.js";
import SyllabusModle from "../models/syllbusModel.js";
import TopicModle from "../models/topicModel.js";
import ErrorHandler from "../utils/errorHandler.js";

//post Syllabus - /api/v1/admin/syllabus/new
const addSyllabus = catchAsyncError(async (req, res, next) => {
  const syllabus = await SyllabusModle.create(req.body);
  res.status(201).send({
    success: true,
    syllabus,
    message: "Syllabus Added Successfully",
  });
})
//Delete Syllabus - /api/v1/admin/syllabus/:id
const delSyllabus = catchAsyncError(async (req, res, next) => {
  const syllabus = await SyllabusModle.findByIdAndDelete({ _id: req.params.id });
    if (!syllabus) {
       return next(new ErrorHandler("Not found", 404))
    } 
    res.status(204).send({
      message: "Syllabus Deleted Successfully",
    });
})
//Get Syllabus with topics by Course ID - /api/v1/syllabus/course/:id ____ Normal use
const getSyllabusByCourseId = catchAsyncError(async (req, res, next) => {
  const syllabus = await SyllabusModle.find({ course_id: req.params.id, visibility: true });
  if (!syllabus) {
    return next(new ErrorHandler("Not found", 404))
  }

  const topicIds = syllabus.map((s) => s._id);
  const topics = await TopicModle.find({ syllabus_id: { $in: topicIds }, visibility: true },
    { _id: 0, topic_video_id: 0, visibility: 0, createdAt: 0, topic_video: 0, public_id: 0 });

  const syllabusWithTopics = syllabus.map((s) => {
    const items = topics.filter((t) => t.syllabus_id.toString() === s._id.toString());
    return { ...s.toObject(), items };
  });

  res.status(200).send({
    success: true,
    message: "Syllabus fetched Successfully",
    syllabus: syllabusWithTopics,
  });
});
//Edit Syllabus Put - /api/v1/admin/syllabus/:id
const editSyllabus = catchAsyncError(async (req, res, next) => {
  let syllabus = await SyllabusModle.findById(req.params.id)
  if(!syllabus){
    return next(new ErrorHandler("Not found", 404))
  }
  syllabus = await SyllabusModle.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
  res.status(201).send({
    success: true,
    syllabus,
    message: "Updated Successfully!"
  })
})
//get Syllabus - /api/v1/admin/syllabus/:id
const getSyllabusById = catchAsyncError(async (req, res, next) => {
  const syllabus = await SyllabusModle.findOne({ _id: req.params.id });
  if (!syllabus) {
    return next(new ErrorHandler("Not found"))   
  } 
  res.status(200).send({
    success: true,
    syllabus,
    message: "syllabus featched Successfully",
  });
})
//Get Syllabus with topics by Course ID - /api/v1/admin/syllabus/course/:id ____ Normal use
const getSyllabusByCourseIdAdmin = catchAsyncError(async (req, res, next) => {
  const syllabus = await SyllabusModle.find({ course_id: req.params.id });
  if (!syllabus) {
    return next(new ErrorHandler("Not found", 404))
  }

  const topicIds = syllabus.map((s) => s._id);
  const topics = await TopicModle.find({ syllabus_id: { $in: topicIds } });

  const syllabusWithTopics = syllabus.map((s) => {
    const items = topics.filter((t) => t.syllabus_id.toString() === s._id.toString());
    return { ...s.toObject(), items };
  });

  res.status(200).send({
    success: true,
    message: "Syllabus fetched Successfully",
    syllabus: syllabusWithTopics,
  });
})
const getSyllabusByCourseIdNormal = async (req, res) => {
  try {
    const syllabus = await SyllabusModle.find({ course_id: req.params.id });
    if (syllabus) {
      const syllabus = await SyllabusModle.find({$and: [{course_id: req.params.id}, {visibility: true}]},{createdAt:0});
      const topic = [];
      for (let i in syllabus) {
        topic.push(
          ...(await TopicModle.find(
            { $and: [ { syllabus_id: syllabus[i]._id }, {visibility: true}] },
            { _id: 0, topic_video_id: 0, visibility: 0, createdAt: 0, topic_video: 0}
          ))
        );
      }

      for (let i in syllabus) {
        for (let y in topic) {
          if (`${syllabus[i]._id}` === `${topic[y].syllabus_id}`) {
            syllabus[i].items.push(topic[y]);
          }
        }
      }
      res.status(200).send({
        message: "syllabus featched Successfully",
        syllabus,
      });
    } else {
      return res.status(404).send({
        message: "Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Get Syllabus with topics by Course ID - /api/v1/paid/syllabus/course/:id ____ Paid Producted
const getPaidSyllabusByCourseId = catchAsyncError(async (req, res, next) => {
  const syllabus = await SyllabusModle.find({ course_id: req.params.id, visibility: true });
  const paidStatus = await paymentModel.findOne({$and: [{course_id: req.params.id}, {user_id: req.user.id}, {access: true}]})
  if(!paidStatus){
    return next(new ErrorHandler("Payment Required", 402))
  }
  if(!paidStatus.signature || !paidStatus.paymentId){
    return next(new ErrorHandler("Bad Request", 400))
  }
  if (!syllabus) {
    return next(new ErrorHandler("Not found", 404))
  }

  const topicIds = syllabus.map((s) => s._id);
  const topics = await TopicModle.find({ syllabus_id: { $in: topicIds }, visibility: true },
    { _id: 0, topic_video_id: 0, visibility: 0, createdAt: 0, topic_video: 0 });

  const syllabusWithTopics = syllabus.map((s) => {
    const items = topics.filter((t) => t.syllabus_id.toString() === s._id.toString());
    return { ...s.toObject(), items };
  });

  res.status(200).send({
    success: true,
    message: "Syllabus fetched Successfully",
    syllabus: syllabusWithTopics,
  });
});



export default {
  addSyllabus,
  delSyllabus,
  getSyllabusByCourseId,
  editSyllabus,
  getSyllabusById,
  getSyllabusByCourseIdAdmin,
  getSyllabusByCourseIdNormal,
  getPaidSyllabusByCourseId
};
