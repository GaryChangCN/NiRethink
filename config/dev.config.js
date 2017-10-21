const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                loader: "babel-loader"
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
            use: ["style-loader", "css-loader"]
        }, {
            test: /\.(eot|svg|ttf|woff|woff2|gif)$/,
            use: ['file-loader?name=dist/assets/[name][sha512:hash:base64:7].[ext]&publicPath=../']
        }]
    },
    resolve: {
        extensions: [".js"]
    },
    target: "electron",
    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve(__dirname, "../dist"),
        compress: true,
        open: false,
        port: 9900,
        historyApiFallback: true,
        overlay: {
            warnings: true,
            errors: true
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        })
    ]
}