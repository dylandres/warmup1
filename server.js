const express = require('express')
const app = express()
const algos = require('./algos.js')
const PORT = 8080;

// middleware for processing json payload in a GET/POST
app.use(express.json())
// middleware for processing urlencoded payload in GET/POST
app.use(express.urlencoded({ extended: true}))
// tell app to serve static files from /public
app.use(express.static('public'))

// use ejs templating
app.set('view engine', 'ejs')
// ejs views will be from /views
app.set('views', 'views')

app.listen(
    PORT,
    () => console.log(`we out here on port ${PORT}`)
)
app.get('/',
    (req, res) => {
        res.send('Nothing here! Visit /ttt or /ttt/play');
    })

// visiting hotpink.cse356.compas.cs.stonybrook.edu/ttt
app.get('/ttt/',
    (req, res) => {
        res.render('homepage.ejs')
    });

// dynamically render name
app.post('/ttt/',
    (req, res) => {
        var name = req.body.name;
        var date = new Date().toLocaleDateString();
        if (name)
            res.render('greeting.ejs', {name: name, date: date})
        else
            res.redirect('/ttt/');
    });

// tic-tac-toe
app.get('/ttt/play',
    (req, res) => {
        res.render('game.ejs');
    });

// process client POST
app.post('/ttt/play',
    (req, res) => {
        var grid = req.body.grid;
        // Check if X won
        if (algos.checkWinner(grid, 'X'))
            res.send(JSON.stringify({'grid': grid, 'winner': 'X'}))
        // If not, Check for tie
        else if (algos.checkTie(grid))
            res.send(JSON.stringify({'grid': grid, 'winner': 'T'}))
        // If not, place an O
        else {
            grid = algos.botsMove(grid)
            // Check if bot won
            if (algos.checkWinner(grid, 'O'))
                res.send(JSON.stringify({'grid': grid, 'winner': 'O'}))
            // Otherwise, keep playing
            else
            res.send(JSON.stringify({'grid': grid, 'winner': ' '}))      
        }
    });
