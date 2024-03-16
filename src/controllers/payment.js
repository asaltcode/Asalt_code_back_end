import Razorpay from "razorpay";
import paymentModel from "../models/paymentModel.js";
import crypto from "crypto";
import CourseModel from "../models/courseModel.js";
import AddToCartModel from "../models/addToCardModel.js";
// import uid from 'short'
import ShortUniqueId from "short-unique-id";
import UserModel from "../models/userModel.js";
import Auth from "../helper/auth.js";

// const secret_key = 'Y3HnqMN7pT2otFj9XtVL8w0D'
const uid = new ShortUniqueId({ length: 10 });

const coursePurchase = async (req, res) => {
  const razorpay = new Razorpay({
    // initializing razorpay
    key_id: process.env.RAZOR_API_KEY,
    key_secret: process.env.RAZOR_SECRET_KEY,
  });

  let totalAmount = 0;
  for (const courseId of req.body.course_id) {    //Total amount calculate
    const course = await CourseModel.findOne({ _id: courseId });
    totalAmount += course.price;
  }

  try {
    const options = {      // setting up options for razorpay order.
      amount: totalAmount * 100,
      currency: "INR",
      receipt: uid.rnd(),
      payment_capture: 1,
    };
    if (req.body.amount === totalAmount) {
      const response = await razorpay.orders.create(options);
      req.body.course_id.map(async (id, i) => {
        const course = await CourseModel.findOne({ _id: id });
        const payment = await paymentModel.findOne({ course_id: id });
        if (course && !payment) {
          await paymentModel.create({
            title: course.title,
            course_id: course._id,
            user_id: req.body.user_id,
            price: course.price,
            order_id: response.id,
          });
        } else {
          (payment.title = course.title),
            (payment.course_id = course._id),
            (payment.user_id = req.body.user_id),
            (payment.price = course.price),
            (payment.order_id = response.id);
          payment.save();
        }
      });
      const user = await UserModel.findOne({ _id: req.body.user_id });
      res.status(200).send({
        order_id: response.id,
        currency: response.currency,
        amount: response.amount,
        user_email: user.email,
        user_name: user.name,
      });
    }else{
        res.status(406).send({
            message: "Not Acceptable"
        })
    }
  } catch (err) {
    res.status(400).send("Not able to create order. Please try again!");
  }
};

// const paymentCapture = async (req, res) => {
//     // do a validation
//  const data = crypto.createHmac('sha256', secret_key)

//  data.update(JSON.stringify(req.body))
//  const digest = data.digest('hex')
//  console.log(req.headers['x-razorpay-signature'])

//  if (digest === req.headers['x-razorpay-signature']) {
//         console.log('request is legit')
//         //We can send the response and store information in a database.

//         res.json({

//             status: 'ok'

//         })

//  } else {
//         res.status(400).send('Invalid signature');
//     }

//  }

const paymentCapture = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;
    //   const response = await Razorpay.payments.capture(payment_id, order_id);

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const paymentRefunt = async (req, res) => {
  try {
    //Verify the payment Id first, then access the Razorpay API.
    const options = {
      payment_id: req.body.paymentId,
      amount: req.body.amount,
    };

    const razorpayResponse = await Razorpay.refund(options);
    //We can send the response and store information in a database
    res.send("Successfully refunded");
  } catch (error) {
    console.log(error);
    res.status(400).send("unable to issue a refund");
  }
};

const paidStatus = async (req, res) => {
  try {
    switch (req.body.status) {
      case "succeeded":
        await paymentModel.updateMany(
          { order_id: req.body.orderDetails.orderId },
          {
            $set: {
              access: true,
              paymentId: req.body.orderDetails.paymentId.current,
              payment_status: req.body.status,
              signature: req.body.orderDetails.signature,
            },
          }
        );
        const payment = await paymentModel.find({
          order_id: req.body.orderDetails.orderId,
        });
        payment.map(async (data) => {
          await AddToCartModel.deleteOne({ course_id: data.course_id });
        });

        res.status(200).send({
          message: "paid Successfully",
        });
        break;
      case "failed":
        res.status(402).send({
          message: "Payment Failed",
        });
        break;
      case "Cancelled":
        res.status(402).send({
          message: "Payment Cancelled",
        });
        break;
      default:
        break;
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const courseAccess = async (req, res) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (token) {
      const payload = await Auth.decodeToken(token);
      const payment = await paymentModel.findOne({
        $and: [
          { course_id: req.body.course_id },
          { access: true },
          { user_id: payload.id },
        ],
      });

      if (payment) {
        res.status(202).send({
          access: true,
        });
      } else {
        res.status(406).send({
          access: false,
        });
      }
    } else {
      res.status.send({
        message: "unauth",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default { coursePurchase, paymentCapture, paidStatus, courseAccess };
