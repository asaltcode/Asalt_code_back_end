import Razorpay from "razorpay";
import paymentModel from "../models/paymentModel.js";
import crypto from "crypto";
import CourseModel from "../models/courseModel.js";
import AddToCartModel from "../models/addToCardModel.js";
// import uid from 'short'
import ShortUniqueId from "short-unique-id";
import UserModel from "../models/userModel.js";
import Auth from "../helper/auth.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

// const secret_key = 'Y3HnqMN7pT2otFj9XtVL8w0D'
const uid = new ShortUniqueId({ length: 10 });

const coursePurchase = catchAsyncError(async (req, res, next) => {    // initializing razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZOR_API_KEY,
      key_secret: process.env.RAZOR_SECRET_KEY,
  });

  const courses = await AddToCartModel.find({user_id: req.user.id})
  const courseIds = courses.map((data) => data.course_id);

  let totalAmount = 0;
for (const courseId of courseIds) {    //Total amount calculate
  const course = await CourseModel.findOne({ _id: courseId });
  totalAmount += course.price;
}

  const options = {  // setting up options for razorpay order.
      amount: totalAmount * 100,
      currency: "INR",
      receipt: uid.rnd(),
      payment_capture: 1
  };
  
  try {
    if(!courses){
      return next(new ErrorHandler("Please try again", 400))
    }
    if(!totalAmount){
      return next(new ErrorHandler("Not Acceptable", 406))
    }
      const response = await razorpay.orders.create(options) // this save information to razorpay server

      courseIds.map(async (id, i) => {
              const course = await CourseModel.findById(id)
              const payment = await paymentModel.findOne({ course_id: id });
              if (course && !payment) {
                await paymentModel.create({
                  title: course.title,
                  course_id: course._id,
                  user_id: req.user.id,
                  price: course.price,
                  order_id: response.id,
                });
              } else {
                (payment.title = course.title),
                  (payment.course_id = course._id),
                  (payment.user_id = req.user.id),
                  (payment.price = course.price),
                  (payment.order_id = response.id);
                  await payment.save();
              }
            });    
          
      const orderDetails = {
        order_id: response.id,
        currency: response.currency,
        amount: response.amount
      }
      res.status(201).send({
        success: true,
        orderDetails          
      })
  } catch (err) {
     res.status(400).send('Not able to create order. Please try again!');
  }
})



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

const paymentCapture = catchAsyncError(async (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body
  const data = crypto.createHmac("sha256", process.env.RAZOR_SECRET_KEY)
  data.update(`${razorpay_order_id}|${razorpay_payment_id}`)
  const digest = data.digest("hex")

  if(digest !== razorpay_signature){
   return next(new ErrorHandler("Invalid signature", 400))
  }

 
  await paymentModel.updateMany({ order_id: razorpay_order_id },{
      $set: {
        access: true,
        paymentId: razorpay_payment_id,
        payment_status: req.body.status,
        signature: razorpay_signature,
        paidAt: Date.now()
      },
    }
  );
  const payment = await paymentModel.find({order_id: razorpay_order_id});
  payment.map(async (data) => { await AddToCartModel.deleteOne({ course_id: data.course_id })});

  res.status(201).send({
    success: true,
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  })


})

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

const paidStatus = catchAsyncError( async (req, res, next) => {

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
})

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


// const razorpay = new Razorpay({    // initializing razorpay
//   key_id: process.env.RAZOR_API_KEY,
//   key_secret: process.env.RAZOR_SECRET_KEY,
// });

// let totalAmount = 100;

// // for (const courseId of req.body.course_id) {    //Total amount calculate
// //   const course = await CourseModel.findOne({ _id: courseId });
// //   totalAmount += course.price;
// // }

// try {
//   const options = {      // setting up options for razorpay order.
//     amount: totalAmount * 100,
//     currency: "INR",
//     receipt: uid.rnd(),
//     payment_capture: 1,
//   };

//   if (totalAmount) {
//     const response = await razorpay.orders.create(options);
    
//     req.body.course_id.map(async (id, i) => {
//       const course = await CourseModel.findOne({ _id: id });
//       const payment = await paymentModel.findOne({ course_id: id });
//       if (course && !payment) {
//         await paymentModel.create({
//           title: course.title,
//           course_id: course._id,
//           user_id: req.body.user_id,
//           price: course.price,
//           order_id: response.id,
//         });
//       } else {
//         (payment.title = course.title),
//           (payment.course_id = course._id),
//           (payment.user_id = req.body.user_id),
//           (payment.price = course.price),
//           (payment.order_id = response.id);
//         payment.save();
//       }
//     });
//     const user = await UserModel.findOne({ _id: req.body.user_id });
//     res.status(200).send({
//       order_id: response.id,
//       currency: response.currency,
//       amount: response.amount,
//       user_email: user.email,
//       user_name: user.name,
//     });
//   }else{
//       res.status(406).send({
//           message: "Not Acceptable"
//       })
//   }
// } catch (err) {
//   res.status(400).send("Not able to create order. Please try again!");
// }