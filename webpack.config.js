const {join} = require('path')

module.exports = {
    context: join(__dirname, 'src'),
    entry: {
        main: './main.js',
        worker: './worker.js',
    },
    output: {
        path: join(__dirname, 'dist'),
        publicPath: '/dist',
        filename: '[name].js',
    },
    // resolve: {
    //     extension: ['', '.js'],
    // },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        ["latest", {modules: false}]
                    ]
                },
            },
        ],
    },
}
