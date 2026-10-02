const mongoose = require('mongoose')
require('dotenv').config({path: "./config.env"})


// It must be written before the app.

// HANDLING UNCAUGHT EXCEPTIONS
process.on("uncaughtException" , (err) => {
    console.log(err.name, err.message)
    console.log('Uncaught Exception occured! Shutting down...')
    process.exit(1)
})

const app = require("./app")

// process.env.NODE_ENV === "development"&& console.log(process.env.NODE_ENV)
console.log(process.env.NODE_ENV)


// connect to database mongoDB
mongoose.connect(process.env.LOCAL_CONN_STR)
    .then(() => {console.log('connect to database mongoDB')})
    // .catch((err) => {console.error("error: ", err)})


const PORT = process.env.PORT | 3000
const IP = process.env.IP | "127.0.0.1"

const server =  app.listen(PORT, IP, () => {
    console.log('connect the server')
}) 


// HANDLING REJECTED PROMISE GLOBALLY
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message)
    console.log('Unhandled rejection occured! Shutting down...')
    server.close(() => {
        process.exit(1)
    })
})



// console.log(a)