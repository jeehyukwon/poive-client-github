'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require('./config')
const _ = require('./utils')

module.exports = {
  entry: {
    client: './client/index.js'
  },
  output: {
    path: _.outputPath,
    filename: '[name].js',
    publicPath: config.publicPath
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false
  },
  resolve: {
    extensions: ['.js', '.vue', '.css', '.json'],
    alias: {
      root: path.join(__dirname, '../client'),
      components: path.join(__dirname, '../client/components')
    },
    modules: [
      _.cwd('node_modules'),
      // this meanse you can get rid of dot hell
      // for example import 'components/Foo' instead of import '../../components/Foo'
      _.cwd('client')
    ]
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loaders: ['vue-loader']
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: [/node_modules/]
      },
      {
        test: /\.(ico|jpg|png|gif|otf|svg|webp)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          name: 'media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(ttf|eot|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        query: {
          name: 'fonts/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(pvt|json)$/,
        loaders: 'json-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: config.title,
      template: path.resolve(__dirname, 'index.html'),
      filename: _.outputIndexPath
    }),
    new webpack.LoaderOptionsPlugin(_.loadersOptions())
  ],
  target: _.target
}
