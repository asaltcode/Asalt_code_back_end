import nodemailer from 'nodemailer'// import express from 'express'


const signupVerify = async (name, email, verifyLink) =>{
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
 
  // const website = 'http://localhost:5173/verify'
  const website = 'https://asalt-code-front-end.vercel.app/verify'
  // const website = 'https://getbootstrap.com/docs'

  const mailOptions = {
    from: "psumma999@gmail.com",
    to: email,
    subject: "Verify Your Account - Asalt Code",
    html: `<div style="text-align: center; font-family: cursive;">
    <h2>Asalt code</h2>
    <h3>Sing Up Verify</h3>
    <hr>
    <div style="text-align: left; padding-left: 50px;">
        <p>Hello ${name},</p>
        <p>Thank you for signing up with <b>Asalt code!</b> To complete the registration process, please verify your email address by clicking the link below:</p>
        <div style="display: flex;"> 
            
        <a href='${website}?token=${verifyLink}' target="_blank" role="link" rel="noopener noreferrer">${website}</a>
            
        </div>
        <p>If you didn't sign up for Asalt Code, please ignore this email.</p><br>   
        <p>Best Regards</p>
        <p>Asalt Code Private Limited Team</p>
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
export default {signupVerify}