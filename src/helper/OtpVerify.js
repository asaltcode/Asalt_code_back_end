import nodemailer from 'nodemailer'// import express from 'express'

const OTPverification = async (name, email, OTP) =>{
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });


  const mailOptions = {
    from: "psumma999@gmail.com",
    to: email,
    subject: "Password Reset OTP",
    text: "This is a test email sent using Nodemailer.",
    html: `<div style="text-align: center; font-family: cursive;">
    <h2>Asalt code</h2>
    <h3>Reset password</h3>
    <hr>
    <div style="text-align: left; padding-left: 50px;">
        <p>Dear ${name},</p>
        <p>You have requested to reset your password. Use the following OTP to reset your password:</p>
        <p>OTP : ${OTP}</p>
        <p>This OTP is valid for a limited time. If you did not request a password reset, please ignore this email.</p><br>   
        <p>Thank you,</p>
        <p>Asalt Code Private Limited</p>
    </div>
</div>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
}
export default {OTPverification}