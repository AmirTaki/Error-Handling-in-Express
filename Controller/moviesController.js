const Movie = require("../Models/movieModel")
const Apifeatures = require("../Utils/ApiFeatures")

exports. getAllMovies = async (req, res) => {
    
    try{    

        const feature  = new Apifeatures(Movie.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination()
        
        const movies = await feature.query

        // const movies = await query
        
        res.status(201).json({
            status: "success",
            length: movies.length,
            data: {movies}
        })
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}
// POST MOVIE
exports. createMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body)

        res.status(201).json({
            status: "success",
            data: {movie}
        })
    }
    catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}
// GET MOVIE WHIT ID
exports. getMovie = async (req, res) => {
    try {
        // const movie = await Movie.find({_id: req.params.id})
        const movie = await Movie.findById(req.params.id)

        res.status(200).json({
            status: 'success',
            data: {movie}
        })
    }
    catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}
// REMOVE MOVIE WHIT ID
exports. deleteMovie = async (req, res) => {
    try{
        await Movie.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: 'success',
            data: null
        })
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        }) 
    }
    
}
// UPDATE MOVIE WHIT ID
exports. updateMovie = async (req, res) => {
    try {
        const updateMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        res.status(200).json({
            status: 'success', 
            data: {movie: updateMovie}
        })
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports. getHighestRated = async (req, res) => {
    try {
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
    catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
} 




// Aggregation pipeline: $match & $group 
exports.getMovieStats = async (req, res) => {
    try {
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
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

// Aggregation pipeline: $unwind & $project 
exports.getMovieByGenre = async (req, res) => {
    try {
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
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}