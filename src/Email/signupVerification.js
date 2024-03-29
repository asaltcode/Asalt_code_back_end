import nodemailer from 'nodemailer'// import express from 'express'


const signupVerify = async (name, email, verifyLink) =>{
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });
 
  // const website = 'http://localhost:5173/verify'
  const website = 'https://asalt-code-front-end.vercel.app/verify'

  const mailOptions = {
    from: process.env.USER,
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
            
        <div style="display: flex;	justify-content: center;">
        <a href='${website}?token=${verifyLink}' target="_blank" role="link" rel="noopener noreferrer"><button style="padding: 10px; background: blue; border: none; border-radius: 10px; color: white;" >Verify My Email Address</button></a>
        </div>            
        </div>
        <p>If you didn't sign up for Asalt Code, please ignore this email.</p><br>   
        <div style="text-align: center; color: red; font-family: cursive;">The link expires in 2 hours.</div>
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