// Update with your config settings.
console.log('Migration file called');
module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/cryptex',
    migrations: {
      directory: __dirname + '/database/migrations',
    },
    seeds: {
      directory: __dirname + '/database/seeds'
    }
  },


  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL, //production will need some deployement in the tutorial: process.env.DATABASE_URL
    migrations: {
      directory: __dirname + '/database/migrations',
    },
    seeds: {
      directory: __dirname + '/database/seeds/production'
    }
  },

};