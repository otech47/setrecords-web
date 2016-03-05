var path = require('path');
var webpack = require('webpack');

module.exports = {
    devServer: {
        contentBase: 'public/'
    },

    devtool: 'eval',

    entry: [
        'babel-polyfill',
        path.resolve(__dirname, 'src', 'styles', 'index.less'),
        path.resolve(__dirname, 'src', 'index.jsx'),
        'webpack-dev-server/client?http://localhost:8080'
    ],

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['react-hot', 'babel'],
                include: [
                    path.resolve(__dirname, 'src')
                ]
            },
            {
                test: /\.less/,
                loader: 'style!css!postcss!less'
            }
        ]
    },

    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    resolve: {
        extensions: ['', '.jsx', '.js']
    }
};
