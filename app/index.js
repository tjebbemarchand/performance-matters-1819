const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const shrinkRay = require('shrink-ray');
const port = 3000;
const path = require('path');
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

enableCaching();
enableCompression();

app.set('views', path.join(__dirname, 'views')); // Defined where template files are located.
app.set('view engine', 'ejs'); // Defined which template engine to use.
app.use(express.static(__dirname + '/public')); // Defined where all media files are located.

app.get('/', renderHomepage);
app.post('/search', renderSearchpage);
app.get('/detailpage/:id', renderDetailpage);

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