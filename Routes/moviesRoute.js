const { getAllMovies, getMovie, checkIdMovies, createMovie, handlerValidationMovie, deleteMovie, updateMovie, getHighestRated, getMovieStats, getMovieByGenre,   } = require('../Controller/moviesController')

const express = require('express')

const router =  express.Router()
// router.param('id', checkIdMovies)


// ALIASING A ROUTE
router.route('/highest-rated').get(getHighestRated)

// Aggregation
router.route('/movie-stats').get(getMovieStats)
router.route('/movies-by-genre/:genre').get(getMovieByGenre)

router.route('')
.get(getAllMovies)
.post(createMovie)

router.route(`/:id`)
.get(getMovie)
.delete(deleteMovie)
.patch(updateMovie)



module.exports = router