var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

module.exports = {
    devServer: {
        contentBase: 'public/'
    },

    devtool: 'cheap-source-map',

    entry: [
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
                ],
                exclude: /node_modules/
            },
            {
                test: /\.less/,
                loader: ExtractTextPlugin.extract('style', 'css!postcss!less'),
                exclude: /node_modules/
            }
        ]
    },

    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
        pathinfo: true
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('index.css'),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'src', 'index.html')
        })
    ],

    resolve: {
        extensions: ['', '.jsx', '.js']
    }
};
