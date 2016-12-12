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
        'main-summary': ['babel-polyfill', './main-summary.js'],
        'worker-summary': ['babel-polyfill', './worker-summary.js'],
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
                        'stage-2',
                        'stage-3',
                        ['latest', {modules: false}]
                    ],
                    'plugins': [
                      'transform-class-properties',
                    ],
                },
            },
        ],
    },
    devServer: {
        contentBase: './',
        port: 8080,
    },
}
