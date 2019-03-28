const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const shrinkRay = require('shrink-ray');
const port = 3000;
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

enableCaching();
enableCompression();

app.set('views', path.join(__dirname, 'views')); // Defined where template files are located.
app.set('view engine', 'ejs'); // Defined which template engine to use.
app.use(express.static(__dirname + '/public')); // Defined where all media files are located.

app.get('/', renderHomepage);
app.post('/search', renderSearchpage);
app.get('/detailpage/:id', renderDetailpage);
app.get('/favorites', renderFavoritespage);
app.post('/add-to-favorites', addToFavorites);

app.get('/offline', function(req, res) {
    res.render('pages/offline');
});

function renderHomepage(req, res) {
    fs.readFile(__dirname + '/public/results.json', function(error, data) {
        if(error) throw error;
        
        const popularBooks = JSON.parse(data.toString()).data.slice(60, 80);
    
        res.render('pages/index', {
            data: popularBooks
        });
    });
}

function renderSearchpage(req, res) {
    const input = req.body.searchQuery;

    fs.readFile(__dirname + '/public/results.json', function(error, data) {
        if(error) throw error;
        
        const searchedBooks = JSON.parse(data.toString()).data.filter(function(book) {
            return book.title.includes(input);
        });
    
        res.render('pages/search', {
            data: searchedBooks
        });
    });
}

function renderDetailpage(req, res) {
    fs.readFile(__dirname + '/public/results.json', function(error, data) {
        if(error) throw error;

        const detailBook = JSON.parse(data.toString()).data.filter(function(book) {
            return book.isbn === req.params.id;
        });
        
        res.render('pages/details', {
            data: detailBook[0]
        });
    });
}

function renderFavoritespage(req, res) {
    fs.readFile(__dirname + '/public/results.json', function(error, data) {
        if(error) throw error;

        if(req.cookies.favorites) {
            var favorites = req.cookies.favorites.map(function(bookID) {
                return JSON.parse(data.toString()).data.filter(function(book) {
                    return book.isbn === bookID;
                });
            });

            favorites = [].concat.apply([], favorites);
        }

        res.render('pages/favorites', {
            favorites
        });
    });
}

function addToFavorites(req, res) {
    let favoritesArray = req.cookies.favorites ? req.cookies.favorites : [];
    favoritesArray.push(req.body.heart);
    res.cookie('favorites', favoritesArray, { 'maxAge':  365 * 24 * 60 * 60 });
    res.redirect(`/detailpage/${req.body.heart}`);
}

function enableCaching() {
    // Enable caching
    app.use((req, res, next) => {
        res.setHeader('Cache-Control', 'max-age=' + 7 * 24 * 60 *
        60);
        next();
    });
}

function enableCompression() {
    // Enable compression
    app.use(shrinkRay({
        cache: () => false,
        cacheSize: false,
        filter: () => true,
        brotli: {
            quality: 11 // Between 1 - 11
        },
        zlib: {
            level: 6 // Between 1 - 9
        }
    }));
}

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`);
});