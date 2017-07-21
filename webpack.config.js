var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './public/js/app.js',
    output: {
        path: __dirname + "/public/js", // or path: path.join(__dirname, "dist/js"),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                },
                exclude: /node_modules/
            }
        ]
    }
};
