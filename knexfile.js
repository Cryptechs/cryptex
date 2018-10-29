// Update with your config settings.
module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/cryptex',
    migrations: {
      directory: __dirname + '/database/migrations',
    },
    seeds:{
      directory: __dirname + '/database/seeds'
    }
  },


  production: {
    client: 'pg',
    connection: 'postgres://localhost/cryptex', //production will need some deployement in the tutorial: process.env.DATABASE_URL
    migrations: {
      directory: __dirname + '/database/migrations',
    },
    seeds:{
      directory: __dirname + '/database/seeds/production'
    }
  },

};
