var express = require('express');
var bodyParser = require('body-parser');
const axios = require('axios')

var app = express();

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json())




console.log('testing jamesBranch');















app.listen(3000, function () {
    console.log('listening on port 3000!');
});