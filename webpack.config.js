const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const path = require('path');

const src = path.resolve(__dirname, 'src');
const dev = path.resolve(__dirname, 'dev');
const public = path.resolve(__dirname, 'public');

const isProduction = process.env.NODE_ENV === 'production';

const manifest = new ManifestPlugin({
  seed: {
    name: 'Upbit Trading View Chart',
    short_name: 'Upbit Chart',
    icons: [{
      src: '/icon-192x192.ico',
      sizes: '192x192',
      type: 'image/png'
    }, {
      src: '/icon-256x256.ico',
      sizes: '256x256',
      type: 'image/ico'
    }, {
      src: '/icon-128x128.ico',
      sizes: '128x128',
      type: 'image/ico'
    }, {
      src: '/icon-64x64.ico',
      sizes: '64x64',
      type: 'image/ico'
    }, {
      src: '/icon-32x32.ico',
      sizes: '32x32',
      type: 'image/ico'
    }, {
      src: '/icon-16x16.ico',
      sizes: '16x16',
      type: 'image/ico'
    }],
    start_url: '/index.html',
    // gcm_sender_id: '780056023795',
    gcm_sender_id: '103953800507',
    display: 'standalone',
    background_color: '#131722',
    theme_color: '#131722'
  },
  serialize: manifest => JSON.stringify(manifest, '/s', 1).replace(/\s(?=([^"]*"[^"]*")*[^"]*$)/g, ''),
});

const plugins = isProduction ? [
  new webpack.DefinePlugin({ process: { env: { NODE_ENV: JSON.stringify('production'), BROWSER: true } } }),
  new WebpackAssetsManifest({}),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/static/index.html'),
  }),
  manifest,
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
