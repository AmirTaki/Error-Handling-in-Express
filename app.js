// express
const express = require('express')
const app = express()
app.set('query parser', 'extended'); 

app.use(express.json())
const router = require('./Routes/moviesRoute')

// Middleware
const morgan = require('morgan')
const logger = (req, res, next) => {
    console.log('logger')
    next()
}
// logger & time & morgan
if(process.env.NODE_ENV === "developer"){
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
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on the server!`
    // })

    const err = new Error(`Can't find ${req.originalUrl} on the server!`)
    err.status = 'fail',
    err.statusCode = 404
    
    next(err)
})

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use((error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error'

    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message
    })
})


module.exports = app

