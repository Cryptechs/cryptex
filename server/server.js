var express = require('express');
var bodyParser = require('body-parser');
const axios = require('axios')
var path = require('path')
var app = express();

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json())



app.post('/users/create')

app.get('/users')

app.patch('/wallet/get')

app.get('/api/coins')

app.get('/api')

app.patch('/users/logout')











app.get('/*', (err, res) => {
    console.log('here!')

    res.sendFile(path.join(__dirname, '../client/dist/index.html'))

})




app.listen(3000, function () {
    console.log('listening on port 3000!');
});