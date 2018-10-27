var express = require('express');
var bodyParser = require('body-parser');
const axios = require('axios')
var path = require('path')
var app = express();
const knex = require('../database/knex')
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');



app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))



const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and 
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://james-dempsey.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: 'https://james-dempsey.auth0.com/userinfo',
    issuer: `https://james-dempsey.auth0.com/`,
    algorithms: ['RS256']
});






//createUser
app.post('/users/create', (req,res)=>{
    knex('users').insert({username: req.body.username})
        .then( ()=>{
            console.log('added username', req.body.username)
            knex.raw('SELECT time_value FROM coin_values ORDER BY time_value DESC LIMIT 1;')
                .then((results)=>{
                    knex('wallets').insert({
                        timestamp: results.rows[0].time_value,
                        user_id: req.body.username
                    }) //currencies all default to zero
                        .then(()=>{
                            console.log('wallet created');
                            res.send('created user', req.body.username, 'with a zero wallet at', results.rows[0].time_value );
                        });
                });
        })
});

//retrieveWallet
app.get('/api/wallet/:id', (req, res) => {
    console.log('wallet get req');
    console.log('params', req.params);

    knex.select('timestamp', 'c1_amount', 'c1_value', 'c2_amount', 'c2_value', 'c3_amount', 'c3_value', 'c4_amount', 'c4_value', 'c5_amount', 'c5_value')
        .from('wallets').innerJoin('coin_values', 'wallets.timestamp', '=', 'coin_values.time_value')
        .where('user_id', req.params.id)
        .then((results) => {
            console.log('success');
            res.status(200);
            res.send(results);
        })
        // Note: if id not found, does not error. Returns all zero matches. 
        .catch((err) => {
            //knex.create
            console.log('Error getting wallet', err);
            res.status(404);
            res.send('Error getting wallet: ', err)
        });
})

app.patch('/api/wallet/:id', (req, res) => {
    console.log('updating current wallet');
    console.log('params', req.params)
    console.log('req body:', req.body)
    knex('wallets')
        .where({
            user_id: req.params.id,
            timestamp: req.body.time
        })
        .update({
            c1_amount: req.body.c1,
            c2_amount: req.body.c2,
            c3_amount: req.body.c3,
            c4_amount: req.body.c4,
            c5_amount: req.body.c5
        })
        .then((results) => {
            console.log('success')
            res.status(201);
            res.send('You done patched it!');
        })
        .catch((err) => {
            console.log('Error updating wallet', err);
            res.status(404);
            res.send('Error updating wallet: ', err)
        });
})

//bad get requests send you home
app.get('/*', (err, res) => {
    console.log('here!')

    res.sendFile(path.join(__dirname, '../client/dist/index.html'))

})




app.listen(3000, function () {
    console.log('listening on port 3000!');
});