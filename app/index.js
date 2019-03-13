const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const path = require('path');
const fs = require("fs");

// // const content = JSON.parse(fs.readFileSync('public/results.json', 'utf8'));
// const books = JSON.parse(fs.readFileSync('public/results.json'));
// console.log(books);
// // console.log(content);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views')); // Defined where template files are located.
app.set('view engine', 'ejs'); // Defined which template engine to use.
app.use(express.static('./public/css')); // Defined where all media files are located.

app.get('/', renderHomepage);
app.post('/search', renderSearchpage);
app.get('/detailpage/:id', renderDetailpage);

function renderHomepage(req, res) {
    fs.readFile(__dirname + '/public/results.json', function(error, data) {
        if(error) throw error;
        
        const jsonData = JSON.parse(data.toString());
        const popularBooks = jsonData.data.slice(60, 80);
    
        res.render('pages/index', {
            data: popularBooks
        });
    });
}

function renderSearchpage(req, res) {
    const input = req.body.searchQuery;
   
    fs.readFile(__dirname + '/public/results.json', function(error, data) {
        if(error) throw error;
        
        const jsonData = JSON.parse(data.toString());
        const searchedBooks = jsonData.data.filter(function(book) {
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

        const jsonData = JSON.parse(data.toString());
        const detailBook = jsonData.data.filter(function(book) {
            return book.isbn === req.params.id; 
        });

        res.render('pages/details', {
            data: detailBook[0]
        });
    });
}

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`);
});