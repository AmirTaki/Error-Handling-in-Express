const CustomError = require("../Utils/CustomError")

const developmentErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error
    })
}
const productionErrors = (res, error) => {
    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message,
        })
    }
    // اگر یک باگ ناگهانی در کدهای ما یا پکیج‌های شخص ثالث رخ دهد، نباید بگذاریم
    // پیام خام باگ به مشتری نشان داده شود و به جای آن پیام عمومی "مشکلی پیش آمده، بعداً تلاش کنید" فرستاده می‌شود
    else {
        res.status(500).json({
            status: 'error',
            message: "Something went wrong! Please try again later."
        })
    }
}

const castErrorHandler = (err) => {
    const msg = `Invalid value for ${err.path}: ${err.value}!`
    return new CustomError(msg, 400)
}

const duplicateKeyErrorHandler = (err) => {
    const name = err.keyValue.name
    const msg = `There is already a movie with name ${name}. Plase use another name!`   
    return new CustomError(msg, 400)
}


const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map((val) => (val.message))
    const errorMessages = errors.join('. ')
    const msg = `Invalid input data: ${errorMessages}`
    return new CustomError(msg, 400)
}

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error'

    if(process.env.NODE_ENV === "development"){
        developmentErrors(res, error)
    }

    else if(process.env.NODE_ENV === "production"){
        if(error.name === "CastError")   error =  castErrorHandler(error)   
        if(error.code === 11000 ) error = duplicateKeyErrorHandler(error)
        if(error.name === 'ValidationError') error = validationErrorHandler(error)
        productionErrors(res, error)
    }
}



/*
    development -> npm start
    production -> npm run start_prod
*/