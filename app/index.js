const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const path = require('path');
const { router } = require('./router/router');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', router);

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`);
});