// express
const express = require('express')
const app = express()
app.set('query parser', 'extended'); 

app.use(express.json())
const router = require('./Routes/moviesRoute')
// Error Class
const CustomError = require('./Utils/CustomError');
const globalErrorHandler =  require('./Controller/errorController')

// Middleware
const morgan = require('morgan');
const logger = (req, res, next) => {
    console.log('logger')
    next()
}
// logger & time & morgan
if(process.env.NODE_ENV === "development"){
    app.use(logger)
    app.use((req, res, next) => {
        req.createdTime = new Date().toISOString()
        next()
    })
    app.use(morgan('dev'))
}

// STATIC FILE
app.use(express.static("./public"))

// Path
const path = '/api/v1/movies'
// route
app.use(path, router)

// DEFAULT ROUTE
app.all("/*catchAll", (req, res, next) => {
    const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404)
    next(err)
})

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler)


module.exports = app

