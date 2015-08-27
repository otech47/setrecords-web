'use strict';

var HtmlWebpackPlugin = require('html-webpack-plugin');
var entryPoints = ['./src/index.jsx'];

module.exports = {
  entry: {
    'click-gator-app': entryPoints
  },
  output: {
    path: 'public/js',
    filename: '[name]-bundle.js',
    pathinfo: true
  },
  resolve: {
    extensions: ['', '.jsx', '.es6', '.js', '.scss']
  },
  plugins: [new HtmlWebpackPlugin({
    template: 'src/index.html',
    inject: 'body'
  })],
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.es6$/,
      loader: 'babel',
      exclude: /node_modules/
    },
    {
      test: /\.jsx$/,
      loader: 'jsx!babel',
      exclude: /node_modules/
    },
    {
      test: /\.js$/,
      loader: 'jsx!babel',
      exclude: /node_modules/
    },
    {
      test: /\.scss$/,
      loader: 'style!css!sass?sourceMap',
      exclude: /node_modules/
    }]
  }
};
