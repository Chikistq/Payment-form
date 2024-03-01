const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const {CleanWebpackPlugin} = require('clean-webpack-plugin')




const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const fileName = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['@babel/polyfill', './js/index.js'],
  output: {
    filename: fileName('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.scss'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  target: isDev ? 'web' : 'browserslist',
  devtool: isDev ? 'source-map' : false,
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: isDev,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './index.html',
      inject: 'body',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      },
    }),
    new MiniCssExtractPlugin(
      // {
      // filename: fileName('css')
      // },
    ),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(jpg|png|jpeg|gif|svg|ico|webp)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext][query]'
        }
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
    ]
  }
}
