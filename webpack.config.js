const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: "./webpack/entry.js",
    output: {
        path: __dirname + '/src/assets/js/',
        filename: "site.min.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
            },
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    sourceMap: false,
                },
                extractComments: true,
                test: /\.js(\?.*)?$/i,
            }),
        ],
    },
    mode: 'production'
};
