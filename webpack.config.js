const webpack = require('webpack');
const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const webpackConfig = {
    entry: {},
    output:{
        path:path.resolve(__dirname, './dist/'),
        filename:'[name].[chunkhash:6].js',
        publicPath: '/'
    },
    //设置开发者工具的端口号,不设置则默认为8080端口
    devServer: {
        inline: true,
        port: 8181
    },
    module:{
        rules:[
            {
                test:/\.js?$/,
                exclude:/node_modules/,
                loader:'babel-loader',
                query:{
                    presets:['env','react']
                }
            },
            {
                test: /\.css$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  'css-loader'
                ]
            },
            {
                test: /\.scss/,
                use: [
                  MiniCssExtractPlugin.loader,
                  'css-loader',
                  'sass-loader'
                ]
            },
            {
              test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'img/[name].[hash:7].[ext]'
              }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin("[name].[chunkhash:6].css"),
        new CleanWebpackPlugin(
            ['dist'],　 
            {
                root: __dirname,       　　　　　　　　　　
                verbose:  true,        　　　　　　　　　　
                dry:      false        　　　　　　　　　　
            }
        )
    ],
};

// 获取指定路径下的入口文件
function getEntries(globPath) {
    const files = glob.sync(globPath),
      entries = {};
    files.forEach(function(filepath) {
        const arr = filepath.split('/');
        const name = (arr.slice(2, arr.length - 1)).join('/');
        entries[name] = './' + filepath;
    });
    return entries;
}
       
const entries = getEntries('src/pages/**/index.js');

Object.keys(entries).forEach(function(name) {
   webpackConfig.entry[name] = entries[name];
   const plugin = new HtmlWebpackPlugin({
       filename: name + '.html',
       template: './public/index.html',
       inject: true,
       chunks: [name]
   });
   webpackConfig.plugins.push(plugin);
})

module.exports = webpackConfig;