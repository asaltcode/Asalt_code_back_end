 const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (`${process.env.NODE_ENV}` === 'development') {
        res.status(err.statusCode).send({
            success: false,
            message: err.message,
            stack: err.stack,
            error: err
        });
    }


    if (process.env.NODE_ENV === 'production') {
        let { message } = err;
        let error = new Error(message);
        if(err.name === "ValidationError") {
            message = Object.values(err.errors).map(value => value.message)
            error = new Error(message)
            err.statusCode = 400
        }
        if(err.name === "CastError"){
            message = `Resourse Not Found ${err.path}`
        }

        if(err.code === 11000) {
            let message = `Duplicate ${Object.keys(err.keyValue)} error`
            error = new Error(message)
            err.statusCode = 400
        }
        if(err.name === "JSONWebTokenError"){
            let message = `JSON Web Token is invalid. Try again`;
            error = new Error(message)
        }
        if(err.name === "TokenExpiredError"){
            let message = `JSON Web Token is expired. Try again`;
            error = new Error(message)
            // res.cookie("token", null, {
            //     expires: new Date(Date.now()),
            //     httpOnly: true,
            //     secure: true
            // }).status(200).send({
            //     success: true,
            //     message: "Loggedout"
            // })
        }
        res.status(err.statusCode).send({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}
export default errorHandler