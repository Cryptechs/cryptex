console.log('knex.js in database folder called')
const environment = process.env.NODE_ENV || 'development'; //mjw- I don't know what the first bit aside from invoking production environment when defined
const config = require('../knexfile.js')[environment];
module.exports = require('knex')(config);