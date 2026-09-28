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
// error not found
app.use((req, res) => {res.status(404).json({status: 'fail', message: 'not found page incrrect url !'})})

module.exports = app

