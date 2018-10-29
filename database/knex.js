console.log('knex.js in database folder called')
const environment = process.env.NODE_ENV || 'development'; //see below
const config = require('../knexfile.js')[environment];
module.exports = require('knex')(config);

//useful for deployment, set up for dev if not deployed