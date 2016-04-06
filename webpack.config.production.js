var path = require('path');
var webpack = require('webpack');

var buildPath = path.resolve(__dirname, 'public');
var mainPath = path.resolve(__dirname, 'src', 'index.jsx');

module.exports = {
    entry: [
        'babel-polyfill',
        mainPath
    ],
    output: {
        path: buildPath,
        filename: 'bundle.js',
        pathinfo: true,
        historyApiFallback: true
    },
    resolve: {
        extensions: ['', '.jsx', '.es6', '.js', '.scss']
    },
    devtool: 'cheap-source-map',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel'],
                include: [
                    path.resolve(__dirname, 'src')
                ]
            }
        ]
    }
};
