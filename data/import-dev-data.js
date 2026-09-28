const mongoose = require('mongoose')
const fs = require('node:fs')
const Movie = require('../Models/movieModel') // Modle Schema
require('dotenv').config({path: "./config.env"})

// CONNECT TO DATABASE MONGODB
mongoose.connect(process.env.LOCAL_CONN_STR, )
    .then(() => {console.log('connect to database ...')})
    .catch((err) => {console.log('Some error has occured ')})

// READ MOVIES.JSON FILE --> ./data/movies.json
const movies = JSON.parse(fs.readFileSync('./data/movies.json', "utf-8"))

// DELETE EXISTING MOVIE DOCUMENTS FROM COLLECTION
const deleteMovies = async () => {
    try {
        await Movie.deleteMany({})
        console.log('Data successfully deleted!')
    }
    catch(err){
        console.log(err.message)
    }
    process.exit()
} 

// IMPORT MOVIES DATA TO MONGODB COLLECTION
const importMovies = async () => {
    try{
        await Movie.create(movies)
        console.log('Data successfully imported!')
    }
    catch(err){
        console.log(err.message)
    }
    process.exit()
}

// deleteMovies()
// importMovies()

// console.log(process.argv)

if(process.argv[2] === "--delete"){
    deleteMovies()
}

if(process.argv[2] === "--import"){
    importMovies()
}



/*
command prompt: 

    A) cd data -> node import-dev-data.js
        1. require('dotenv').config({path: "./../config.env"})
        2. const movies = JSON.parse(fs.readFileSync('./movies.json', "utf-8"))
    
    B)  node data/import-dev-data.js --delete     
        node data/import-dev-data.js --import
            
            1. require('dotenv').config({path: "./config.env"})
            2. const movies = JSON.parse(fs.readFileSync('./data/movies.json', "utf-8"))



*/