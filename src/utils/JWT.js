//Send JWT Tokens
const sendToken = async (user, stausCode, res) =>{
    //Creating JWT Token
    const token = await user.getJwtToken()
    //Seting cookies
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRY_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true
    }

    res.status(stausCode)
    .cookie("token", token, options)
    .send({
        success: true,
        token,
        user
    })
}

export default sendToken