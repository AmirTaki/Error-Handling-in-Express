const mongoose = require('mongoose')
require('dotenv').config({path: "./config.env"})
const app = require("./app")

process.env.NODE_ENV === "developer"&& console.log(process.env.NODE_ENV)

// connect to database mongoDB
mongoose.connect(process.env.LOCAL_CONN_STR)
    .then(() => {console.log('connect to database mongoDB')})
    .catch((err) => {console.error("error: ", err)})


const PORT = process.env.PORT | 3000
const IP = process.env.IP | "127.0.0.1"

app.listen(PORT, IP, () => {
    console.log('connect the server')
}) 

