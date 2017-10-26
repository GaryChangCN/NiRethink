const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const nodeModules = {}
fs.readdirSync('node_modules').filter(x => {
    return ['.bin'].indexOf(x) === -1
}).forEach(mod => {
    nodeModules[mod] = 'commonjs ' + mod
})

module.exports = {
    entry: [
        'babel-polyfill',
        path.resolve(__dirname, "../src/index.js")
    ],
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: 'bundle.js'
    },
    externals: nodeModules,
    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                loader: "babel-loader",
                options: {
                    "presets": ["es2015", "stage-0", "stage-1", "stage-2", "stage-3"]
                }
            }],
            exclude: [
                path.resolve(__dirname, "../node_modules")
            ]
        }, {
            test: /\.less$/,
            use: [
                "style-loader", "css-loader", "less-loader"
            ]
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        }, {
            test: /\.(eot|svg|ttf|woff|woff2|gif)$/,
            use: ['file-loader?name=assets/[name][sha512:hash:base64:7].[ext]&publicPath=./']
        }]
    },
    resolve: {
        extensions: [".js"]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin("styles.css")
    ]
}