var express = require('express');
var bodyParser = require('body-parser');
const axios = require('axios')
var path = require('path')
var app = express();
const knex = require('../database/knex')



app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json())



//createUser
app.post('/users/create')

//verifyUser -should this be a post?
app.get('/users')

//logout
app.post('/users/logout');

//retrieveWallet
app.get('/api/wallet/:id', (req, res) => {
    //knex.table('users').innerJoin('accounts', 'users.id', '=', 'accounts.user_id')
    console.log('wallet get req');
    console.log('params', req.params)
    knex.select('timestamp', 'c1_amount', 'c1_value', 'c2_amount', 'c2_value', 'c3_amount', 'c3_value', 'c4_amount', 'c4_value', 'c5_amount', 'c5_value')
        .from('wallets').innerJoin('coin_values', 'wallets.timestamp', '=', 'coin_values.time_value')
        .then((wallet) => {
            console.log('success')
            res.status(200);
            res.send(wallet);
        })
        // Note: if id not found, does not error. Returns all zero matches. 
        .catch((err) => {
            console.log('Error getting wallet', err);
            res.status(404);
            res.send('Error getting wallet: ', err)
        });
})

//getCoinHistory (values)
//app.get('') --- No longer implemented. API call from client

//update coins put or patch?
app.put('/api/wallet', (req, res) => {
    console.log('updating current wallet')

})


console.log('server file line 48');
app.get('/*', (err, res) => {
    console.log('here!')

    res.sendFile(path.join(__dirname, '../client/dist/index.html'))

})




app.listen(3000, function () {
    console.log('listening on port 3000!');
});