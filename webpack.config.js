const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const src = path.resolve(__dirname, 'src');
const dev = path.resolve(__dirname, 'dev');
const public = path.resolve(__dirname, 'public');

const isProduction = process.env.NODE_ENV === 'production';

const plugins = isProduction ? [
  new webpack.DefinePlugin({ process: { env: { NODE_ENV: JSON.stringify('production'), BROWSER: true } } }),
  new WebpackAssetsManifest({}),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/static/index.html'),
  }),
] : [
  new webpack.DefinePlugin({ process: { env: { NODE_ENV: JSON.stringify('development'), BROWSER: true } } }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
];

const config = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    app: src,
    vendor: ['react', 'react-dom'],
  },
  devServer: {
    contentBase: dev,
    hot: true,
    inline: true,
    port: 7777,
    historyApiFallback: true,
    compress: false,
  },
  output: {
    path: isProduction ? public : dev,
    publicPath: '/',
    filename: isProduction ? 'assets/javascripts/[hash]/bundle-[name].js' : 'assets/javascripts/bundle-[name].js',
    chunkFilename: isProduction ? 'assets/javascripts/[hash]/bundle-[name].chunk.js' : 'assets/javascripts/bundle-[name].chunk.js',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  plugins,
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '~': src,
    },
    modules: ['node_modules', src],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        include: src,
        options: {
          failOnWarning: true,
          failOnError: true,
          emitWarning: true,
        },
      },
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules|bower_components/,
      },
    ],
  },
  devtool: isProduction ? false : 'eval-source-map',
  optimization: {
    minimize: isProduction,
  },
};

module.exports = config;
