require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIES = require('./movies.json')


const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    console.log('validate bearer token middleware')
    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request'})
    }

    next()
})

function handleGetMovies(req, res) {
    let response = MOVIES

    if(req.query.genre) {
        response = response.filter(movie => 
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
            )
    }

    if(req.query.country) {
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())  
            )
    }

    if(req.query.avg_vote) {
        response = response.filter(movie => 
            movie.avg_vote * 1 >= req.query.avg_vote * 1
            )
    }
    res.json(response)
}

app.get('/movie', handleGetMovies)

module.exports = app