var express = require('express');
var bodyParser = require('body-parser');
const axios = require('axios')
var path = require('path')
var app = express();
const knex = require('../database/knex')
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const ALPHA_ADVANTAGE_API_KEY = require('../client/config/config.js');

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
            //Here's an example of using Knex's raw command:
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

//bad get requests send you home. you monster.
app.get('/*', (err, res) => {
    console.log('here!')
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
});

const getLiveCoinData = () => { //
    const coinNames = ["BTC", "LTC", "ETH", "XRP", "EOS"];
    const promiseArray = [];
    const output = {};
    for (let i = 0; i < coinNames.length; i++) {
        let dummyPromise = axios
            .get(
            "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency="
            + coinNames[i] 
            + "&to_currency=USD&apikey=" 
            + ALPHA_ADVANTAGE_API_KEY
            )
            .then(function(res) {
            // The API has long "normal English" names for keys. 
            // console.log("Currency", res.data['Realtime Currency Exchange Rate']['1. From_Currency Code']);
            // console.log("Rate", res.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
            // console.log("Timestamp", res.data['Realtime Currency Exchange Rate']['6. Last Refreshed']);
            output[coinNames[i]] = res.data['Realtime Currency Exchange Rate']['1. From_Currency Code'];
            output[coinNames[i] + '_value'] = res.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
            output['timestamp'] = res.data['Realtime Currency Exchange Rate']['6. Last Refreshed'];
            }).catch(console.log('error getting', coinNames[i]));
            /*.catch(function(error) {
            console.log("*** Error Getting data from AlphaAdvantage:", error);
            })*/
        promiseArray.push(dummyPromise);
    }
    Promise.all(promiseArray).then(()=>{
        if(output.timestamp 
            && output.BTC_value 
            && output.LTC_value
            && output.ETH_value
            && output.XRP_value
            && output.EOS_value) {
            console.log('INSERTING:', output)
            knex('coin_values').insert({
                time_value: output.timestamp,
                c1_value: output.BTC_value,
                c2_value: output.LTC_value,
                c4_value: output.ETH_value,
                c5_value: output.XRP_value,
                c3_value: output.EOS_value,
            })
            .then(()=> {
                //update all users wallets with a timestamp at their current amounts (super hacky)
                knex('wallets').distinct().select('user_id') //gets list of distinct usernames
                .then((resNames)=> {
                    console.log('resNames', resNames);
                    //resNames is an array of objects containing just names e.g. [{ user_id: 'name@email.com' }]
                    for(let i=0; i < resNames.length; i++){
                        knex('wallets').select().orderBy('timestamp', 'desc').limit(1)//.where('user_id' === resNames[i].user_id)
                        .then((recentRow)=>{ //now that we have the most recent row for a username
                            console.log('recentRow', recentRow);
                            knex('wallets').insert({
                                user_id: resNames[i].user_id,
                                timestamp: output.timestamp,
                                c1_amount: recentRow[0].c1_amount,
                                c2_amount: recentRow[0].c2_amount,
                                c4_amount: recentRow[0].c3_amount,
                                c5_amount: recentRow[0].c4_amount,
                                c3_amount: recentRow[0].c5_amount,
                            })
                            .then(()=>{console.log('Updated user', resNames[i].user_id)})

                        })
                    }
                })
            });
        } else {
            console.log('Failed to get insert update to coin_values');
        }
    }).catch(console.log('Failed to get complete update.'));
  }

app.listen(3000, function () {
    console.log('listening on port 3000!');
});

getLiveCoinData();
setInterval(()=>{
    console.log('Pinging the API for values');
    getLiveCoinData();
}, 70000); //Recommended min 70sec setInterval