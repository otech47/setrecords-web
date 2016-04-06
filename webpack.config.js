var path = require('path');
var webpack = require('webpack');

var buildPath = path.resolve(__dirname, 'public');
var mainPath = path.resolve(__dirname, 'src', 'index.jsx');
var stylePath = path.resolve(__dirname, 'src', 'styles', 'index.less');

module.exports = {
    devtool: 'eval-source-map',

    entry: [
        stylePath,
        mainPath,
        'webpack-dev-server/client?http://localhost:8080'
    ],

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'babel'
            },
            {
                test: /\.less$/,
                include: stylePath,
                loader: 'style!css!autoprefixer!less'
            }
        ]
    },

    output: {
        publicPath: '/public',
        filename: 'bundle.js',
    },

    resolve: {
        extensions: ['', '.jsx', '.js', '.less']
    }
};
