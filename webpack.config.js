export default {
    mode: 'production',
    entry: {
        main: './src/js/main.js'
    },
    output: {
        publicPath: '/',
        filename: '[name].min.js',
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: [
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env'] }
                }
            },
        ],
    },
    performance: {
        maxEntrypointSize: 1024000,
        maxAssetSize: 1024000
    }
};