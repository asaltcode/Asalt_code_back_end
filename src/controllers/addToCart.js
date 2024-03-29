import AddToCartModel from "../models/addToCardModel.js";
import CourseModel from "../models/courseModel.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

const addCart = catchAsyncError(async (req, res, next) => {
  const course = await CourseModel.findOne({
    $and: [{ _id: req.params.id }, { visibility: true }],
  });
  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }
  const carts = await AddToCartModel.findOne({
    $and: [{ course_id: req.params.id }, { user_id: req.user.id }],
  });
  if (carts) {
    return next(new ErrorHandler("Cart already added", 409));
  }
  const datas = {
    user_id: req.user.id,
    course_id: course._id,
    price: course.price,
    title: course.title,
    thumbnail: course.thumbnail,
  };
  const cart = await AddToCartModel.create(datas);
  res.status(201).send({ success: true, cart });
});
const getAllCart = catchAsyncError(async (req, res, next) => {
  const carts = await AddToCartModel.find(
    { user_id: req.user.id },
    { user_id: 0 }
  );
  if (!carts) {
    next(new ErrorHandler("Cart is empty", 404));
  }
  res.send({ success: true, carts });
});
const delAllCart = catchAsyncError(async (req, res) => {
  const cart = await AddToCartModel.find({user_id: req.user.id})
  if(!cart){
    return next(new ErrorHandler("Cart Not Found", 404))
  }
  await AddToCartModel.deleteMany({user_id: req.user.id})
  res.status(204).send({
    success: true,
    message: "Cart removed successfully!"
  })
})

const delCart = catchAsyncError(async (req, res, next) => {
  const cart = await AddToCartModel.findOne({ $and: [{ course_id: req.params.id }, { user_id: req.user.id }], });
  if(!cart){
    return next(new ErrorHandler("Cart Not Found", 404))
  }
  await AddToCartModel.deleteOne({_id: cart._id})
  res.status(204).send({
      success: true,
      message: "Cart removed successfully!"
  })
})

export default { addCart, getAllCart, delAllCart, delCart };
