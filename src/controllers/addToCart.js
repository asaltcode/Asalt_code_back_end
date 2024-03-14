import AddToCartModel from "../models/addToCardModel.js";
import CourseModel from "../models/courseModel.js";
import UserModel from "../models/userModel.js";
import Auth from "../helper/auth.js";

const addCart = async (req, res) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  const payload = await Auth.decodeToken(token);
  const user = await UserModel.findOne({$and: [{ _id: payload.id }, { email: payload.email }],});
  try {
    const course = await CourseModel.findOne({ _id: req.body.course_id });
    const cart = await AddToCartModel.findOne({$and: [{ course_id: req.body.course_id }, { user_id: payload.id }],
    });
    if (user && course) {
      if (!cart) {
        const datas = {
          user_id: user._id,
          course_id: course._id,
          price: course.price,
          title: course.title,
          thumbnail: course.thumbnail,
        };
        await AddToCartModel.create(datas);
        res.send({ message: "product added" });
      } else {
        res.status(208).send({
          message: "This course already added",
        });
      }
    } else {
      res.status(400).send({
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
const getAllCart = async (req, res) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  const payload = await Auth.decodeToken(token);
  const user = await UserModel.findOne({$and: [{ _id: payload.id }, { email: payload.email }],});
  try {
    const cart = await AddToCartModel.find({ user_id: user._id }, {user_id: 0});
    if (cart.length !== 0) {
      res.send({ message: "Cart featched successfully", cartList: cart });
    } else {
      res.status(400).send({
        message: "Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
const getCart = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const delAllCart = async (req, res) => {
  try {
    const cart = await AddToCartModel.find({ user_id: req.body.user_id });
    if (cart.length !== 0) {
      await AddToCartModel.deleteMany({ user_id: req.body.user_id });
      res.send({ message: "Remove from all cart" });
    } else {
      res.status(400).send({
        message: "Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const delCart = async (req, res) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  const payload = await Auth.decodeToken(token);
  const user = await UserModel.findOne({$and: [{ _id: payload.id }, { email: payload.email }],});
  try {
    const cart = await AddToCartModel.findOne({$and: [{ course_id: req.body.course_id }, { user_id: payload.id}],});
    if (cart) {
      if (user) {
        await AddToCartModel.deleteOne({ course_id: req.body.course_id });
        return res.send({ message: "Course remove from cart" });
      } else {
        return res.status(401).send({ message: "Unauthorized" });
      }
    } else {
      res.status(400).send({
        message: "Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

export default { addCart, getAllCart, getCart, delAllCart, delCart };
