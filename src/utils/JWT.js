//Send JWT Tokens
const sendToken = async (user, stausCode, res, message = undefined) =>{
    //Creating JWT Token
    const token = await user.getJwtToken()
    //Seting cookies
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRY_TIME * 24 * 60 * 60 * 1000),
        secure: true,
        httpOnly: true,
    }

    res.status(stausCode)
    .cookie("token", token, options)
    .send({
        success: true,
        token,
        user,
        message
    })
}

export default sendToken