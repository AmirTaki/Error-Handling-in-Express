const Movie = require("../Models/movieModel")
const Apifeatures = require("../Utils/ApiFeatures")
const { asyncErrorHanlder } = require("../Utils/asyncErrorHandler")
const CustomError = require("../Utils/CustomError")


// GET ALL MOVIE
exports. getAllMovies = asyncErrorHanlder (
    async (req, res, next) => {
        const feature  = new Apifeatures(Movie.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination()
        
        const movies = await feature.query
        res.status(201).json({
            status: "success",
            length: movies.length,
            data: {movies}
        })
    }
)

// POST MOVIE
exports.createMovie = asyncErrorHanlder(
    async (req, res, next) => {
        const movie = await Movie.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {movie}
        })
    }
)

/*
exports. createMovie =   async (req, res, next) => {
    try {
        const movie = await Movie.create(req.body)

        res.status(201).json({
            status: "success",
            data: {movie}
        })
    }
    catch(err){
        const error = new CustomError(err.message, 400)
        next(error)
        // res.status(400).json({
        //     status: 'fail',
        //     message: err.message
        // })
    }
}
*/

// GET MOVIE WHIT ID
exports. getMovie = asyncErrorHanlder(
    async (req, res, next) => {
        // const movie = await Movie.find({_id: req.params.id})
        const movie = await Movie.findById(req.params.id)

        res.status(200).json({
            status: 'success',
            data: {movie}
        })
    }
)
// REMOVE MOVIE WHIT ID
exports. deleteMovie = asyncErrorHanlder(
    async (req, res, next) => {
        await Movie.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            data: null
        })

    }
)
// UPDATE MOVIE WHIT ID
exports. updateMovie = asyncErrorHanlder(
    async (req, res, next) => {
        const updateMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        res.status(200).json({
            status: 'success', 
            data: {movie: updateMovie}
        }) 
    }
)

exports. getHighestRated = asyncErrorHanlder(
    async (req, res, next) => {
        const movies = await Movie.find()
        .sort('-ratings')
        .limit(5)
        .select('name price ratings');

        res.status(200).json({
        status: 'success',
        results: movies.length,
        data: { movies }
        });
  
    } 
)




// Aggregation pipeline: $match & $group 
exports.getMovieStats = asyncErrorHanlder(
    async (req, res, next) => {
        const stats = await Movie.aggregate([
            // {$match:{releaseDate: {$lte: new Date() }}},
            {$match: {ratings: {$gte: 4.5}}},
            {$group: {
                _id: '$releaseYear',
                avgRating: {$avg: '$ratings'},
                avgPrice: {$avg: '$price'},
                minPrice: {$min: "$price"},
                maxPrice: {$max: '$price'},
                priceTotal: {$sum: "$price"},
                movieCount: {$sum: 1}
            }},
            {$sort: {minPrice: 1}},
            {$match: {maxPrice: {$gte: 55}}}
        ])

        res.status(200).json({
            status: 'success',
            count: stats.length,
            data: {stats}
        })
    }
)

// Aggregation pipeline: $unwind & $project 
exports.getMovieByGenre = asyncErrorHanlder(
    async (req, res, next) => {
        const genre = req.params.genre
        const movies = await Movie.aggregate([
            // {$match:{releaseDate: {$lte: new Date() }}},
            {$unwind: '$genres'},
            {$group: {
                _id: '$genres',
                movieCount: {$sum: 1},
                movies: {$push: '$name'}
            } },
           {$addFields: {genre: "$_id"}},
           {$project: {_id: 0}},
           {$sort: {movieCount: -1}},
          // {$limit: 5},
          {$match: {genre: genre}}
            
        ])
        res.status(200).json({
            status: 'success',
            count: movies.length,
            data: {movies}
        })
    }

)