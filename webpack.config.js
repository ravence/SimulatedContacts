var webpack = require('webpack'); 
const path = require('path'); 

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
               test: /\.(scss|css)$/,
               use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
        })
    ]
};