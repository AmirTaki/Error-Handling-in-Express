const mongoose = require('mongoose')
const fs = require('node:fs')
const validator =  require("validator")

// SCHEMA MONGOOSE 
 const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required field!"],
        unique: true, 
        maxlength: [100, "Movie name must not have more than 100 characters"],
        minlength: [4, "Movie name must have at least 4 characters"],
        trim: true,
        validate: [validator.isAlpha, "Name should only contain alphabets."]
    }, 
    
    description: {
        type: String,
        required: [true, "Description is required field!"],
        trim: true
    },

    duration: {
        type: Number,
        required: [true, "Duration is required field!"],
    },
    
    ratings: {
        type: Number, 
        validate: {
            validator: function(value) {
                return value >= 1 && value <= 10;
            },
            message: "Ratings ({VALUE}) should be above 1 and below 10"
        }
    }, 

    totalRating: {
        type: Number
    },

    releaseYear: {
        type: Number,
        required: [true, "Release year is required field!"]
    },

    releaseDate: {
        type: Date
    },

    createdAt: {
        type: Date, 
        default: Date.now(),
        select: false
    },

    genres: {
        type: [String],
        required: [true, "Geners is required field!"],
        enum: {
            values: ["Action", "Adventure", "Sci-Fi", "Thriller", "Crime", "Drama", "Comedy", "Romance", "Biography"],
            message: 'This genre does not exist'   
        }
    },

    directors: {
        type: [String],
        required: [true, "Directors is required field!"]
    },

    coverImage: {
        type: String, 
        require: [true, "Cover image is required filed!"]
    },

    actors: {
        type: [String],
        require: [true, "Actors image is required filed!"]
    },
    
    price: {
        type: Number, 
        required: [true, "Price is required field!"]
    },
    createdBy: String

}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    id: false
})

// Virtual Properties 
movieSchema.virtual("durationInHours").get(function() {
    return this.duration / 60
})

//Document Middleware Mongoose
movieSchema.pre('save', function() {
    this.createdBy = "AMIR_T"
})

movieSchema.post('save', function (doc){
    const content = `A new movie document with name ${doc.name} has been created by ${doc.createdBy}.\n`
    fs.writeFileSync( "./Log/log.txt", content, {flag: 'a'}, (err) => {
        console.log(err.message)
    })
})



// Query Middleware 
movieSchema.pre(/^find/, function(){
    // فقط فیلم‌هایی که تاریخ انتشار آن‌ها کوچکتر یا مساوی زمان حال است، پیدا شوند
    this.find({releaseDate: {$lte: Date.now() }})   
    this.startTime = Date.now()
})

movieSchema.post(/^find/, function (docs) {
    this.endTime = Date.now()
    const content = `Query took ${this.endTime - this.startTime} milliseconds to fetch the documents.\n`
    fs.writeFileSync( "./Log/log.txt", content, {flag: 'a'}, (err) => {
        console.log(err.message)
    })
})


// Aggregation Middleware
movieSchema.pre('aggregate', function () {
    this.pipeline().unshift({ $match: {releaseDate: {$lte: new Date()}}})
})

// MODEL MONGOOSE 
const Movie =  mongoose.model("Movie", movieSchema)

module.exports = Movie

