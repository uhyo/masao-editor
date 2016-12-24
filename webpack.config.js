"use strict";
const path=require('path');
const webpack=require('webpack');

module.exports={
    devtool: 'source-map',
    entry: {
        js: './jsx/index.ts',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        library: 'MasaoEditorCore',
        libraryTarget: 'umd',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: [path.join(__dirname, 'node_modules/babel-preset-react'), path.join(__dirname, 'node_modules/babel-preset-es2015')],
                    //sourceMaps: true
                }
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules|\.d\.ts$/,
                loader: 'awesome-typescript-loader',
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader?modules&camelCase', 'postcss-loader'],
            },
            {
                test: /\.json$/,
                loaders: ['json-loader'],
            },
            {
                test: /\.(?:png|gif)$/,
                loaders: ['url-loader', 'img-loader'],
            },
            /*
            {
                test: /\.jsx?$/,
                loader: 'transform/cacheable?envify',
            },
            {
                test: /\.html$/,
                loader: 'file?name=[name].[ext]',
            },
           */
        ]
    },
    plugins: [
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        modules: [path.resolve(__dirname, 'node_modules')],
    },
    externals: {
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            root: 'React',
        },
    },

    performance: {
        //bye bye, FIXME...
        hints: false,
    },
    
    devServer: {
        contentBase: './dist',
        port: 8080,
    }
};