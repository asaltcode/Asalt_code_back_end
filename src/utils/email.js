import nodemailer from 'nodemailer'

const sendEmail = async options => {
    const transport = {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.APP_PASSWORD,
          },
    };
    
    const transporter = nodemailer.createTransport(transport);
    const message = {
        from : `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    
    await transporter.sendMail(message)
}

export default sendEmail