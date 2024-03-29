import Course from "../models/courseModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import APIFeatures from "../utils/apiFeatures.js";
import paymentModel from "../models/paymentModel.js";

//Create Course - /api/v1/course/new
const addCourse = catchAsyncError(async (req, res, next) => {
  const course = await Course.findOne({ thumbnail: req.body.thumbnail });
  if (!course) {
    await Course.create(req.body);
    res.status(200).send({
      message: "Course Added Successfully",
    });
  } else {
    res.status(400).send({
      message: "This course already exist",
    });
  }
});
//Get Courses - /api/v1/admin/courses
const getAdminCourse = catchAsyncError(async (req, res, next) => {
  const courses = await Course.find();
  if(!courses){
    return next(new ErrorHandler("Not found", 400))
  }
    res.status(200).send({
      success: true,
      courses,
      message: "courses featched Successfully",
    });
  
});
//Get Courses - /api/v1/courses
const getCourses = catchAsyncError(async (req, res, next) => {
  let resPerPage = 8
  const apiFeatures = new APIFeatures(Course.find({ visibility: true },{ visibility: 0 }), req.query).search().filter().paginate(resPerPage)

  const courses = await apiFeatures.query;
  res.status(200).send({
    success: true,
    count: courses.length,
    courses,
  });
});
//Delete Courses - /api/v1/course/:id
const delCourse = catchAsyncError(async (req, res, next) => {
  const course = await Course.findOneAndDelete({ _id: req.params.id });
  if (!course) {
    return next(new ErrorHandler("Course Not Found", 404));
  }
  res.status(200).send({
    message: "Course Deleted!",
  });
});
//Edit Courses - /api/v1/course/:id
const editCourse = catchAsyncError(async (req, res, next) => {
  let course = await Course.findById({ _id: req.params.id });
  if (!course) {
    return next(new ErrorHandler("Course Not Found Test", 404));
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).send({
   success: true,
   message: "Updated Successfully"
  });
})
//Get Single Courses - /api/v1/course/:id
const getCourseById = catchAsyncError(async (req, res, next) => {
  const course = await Course.findOne({ $and:[{_id: req.params.id}, {visibility: true}] });
  if(!course){
    return next(new ErrorHandler("Course Not Found", 400))
  }
    res.status(200).send({
      success: true,
      course,
    });
})
//Get Single Courses - /api/v1/my-crouses
const myCourses = catchAsyncError(async (req, res, next) => {
  // Check if user ID is missing
  if (!req.user.id) {
    return next(new ErrorHandler("Bad request", 400));
  }
  
  const userId = req.user.id;  
  // Find all payment records for the user
  const paymentStatus = await paymentModel.find({ user_id: userId });

  // Filter payment records to include only those with access and matching user ID
  const courseIds = paymentStatus
    .filter(data => data.access && req.user.id === `${data.user_id}`)
    .map(data => data.course_id);

  // Fetch courses for each course ID
  const courses = await Promise.all(
    courseIds.map(async courseId => {
      return Course.findOne({ _id: courseId, visibility: true });
    })
  );

  res.status(200).send({
    success: true,
    courses
  });
});


export default {
  addCourse,
  getCourses,
  getAdminCourse,
  delCourse,
  editCourse,
  getCourseById,
  myCourses,
};
