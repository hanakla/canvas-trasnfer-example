const {join} = require('path')

module.exports = {
    context: join(__dirname, 'src'),
    node: {
        // workerでパスを解決するのに必要
        __filename: true,
        __dirname: true,
    },
    entry: {
        main: ['babel-polyfill', './main.js'],
        worker: ['babel-polyfill', './worker.js'],
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
                        'stage-3',
                        ['latest', {modules: false}]
                    ]
                },
            },
        ],
    },
    devServer: {
        contentBase: './',
        port: 8080,
    },
}
