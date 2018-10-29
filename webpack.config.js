var path = require('path');
var SRC_DIR = path.join(__dirname, '/client/src');
var DIST_DIR = path.join(__dirname, '/client/dist');

//DONT MESS WITH ME UNLESS YOU KNOW WHAT YOURE DOING

module.exports = {
  entry: `${SRC_DIR}/router.jsx`, //this is where the page starts, has routes to home page (protected) and welcome page
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
  },
  module: {
    loaders: [{
      test: /\.jsx?/,
      include: SRC_DIR,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015']
      }
    }]
  }
};