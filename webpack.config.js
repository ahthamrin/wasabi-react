var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');
var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BowerWebpackPlugin = require("bower-webpack-plugin");

var pkg = require('./package.json');

const autoprefixer = require('autoprefixer');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

var common = {
  // entry: ['tether', 'font-awesome-loader', 'bootstrap-loader', PATHS.app ],
  entry: ['tether', 'bootstrap-loader', PATHS.app ],
  // entry: [ PATHS.app ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    // alias: { bxslider: 'vendor/bxslider'}
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: PATHS.app,
        exclude: /node_modules/
      },
      // { test: /\.css$/, loaders: [ 'style', 'css', 'postcss' ], include: 'bootstrap-loader' },
      { test: /\.css$/, loaders: [ 'style', 'css'] },
      { test: /\.scss$/, loaders: [ 'style', 'css', 'postcss', 'sass' ] },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url?limit=10000"
      },
      {
        test: /\.(ttf|eot|svg|gif|png|jpg)(\?[\s\S]+)?$/,
        loader: 'file'
      },
      // { test: /bootstrap-sass\/assets\/javascripts\//, 
      //   loader: 'imports?jQuery=jquery' 
      // },
      { test: /jquery-mobile\/dist\/jquery\.mobile\.js$/, 
        loader: 'imports?jQuery=jquery,$=jquery' 
      },
      // { test: /bxslider\/dist\/jquery\.bxslider\.js$/, 
      //   loader: 'imports?jQuery=jquery,$=jquery' 
      // },
      // { test: /jquery-touchswipe\/jquery\.touchSwipe\.js$/, 
      //   loader: 'imports?jQuery=jquery,$=jquery' 
      // }
    ]
  },
  postcss: [ autoprefixer ],
  plugins: [
    new HtmlwebpackPlugin({
      title: 'WASABI App',
      template: 'templates/index.tpl',
      appMountId: 'app',
      inject: false
    }),
    new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery",
    'window.Tether': 'tether'
    })
  ]
};

if(TARGET === 'start' || !TARGET || TARGET === 'mba-start') {
  module.exports = merge(common, {
    module: {
      loaders: [
      ]
    },
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      // hot: true,
      // inline: true,
      progress: true,

      // display only errors to reduce the amount of output
      stats: 'errors-only',

      // parse host and port from env so this is easy
      // to customize
      host: '0.0.0.0',
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}


if(TARGET === 'build' || TARGET === 'stats' || TARGET === 'deploy') {
  module.exports = merge(common, {
    entry: {
      app:  PATHS.app,
      // vendor: ['bootstrap-loader/extractStyles'].concat(Object.keys(pkg.dependencies))
      vendor: ['tether', 'bootstrap-loader/extractStyles'].concat(Object.keys(pkg.dependencies))
    },
    output: {
      path: PATHS.build,
      filename: '[name].js',
      // filename: '[name].[chunkhash].js',
      chunkFilename: '[chunkhash].js'
    },
    devtool: 'source-map',
    plugins: [
      new Clean(['build']),
      new ExtractTextPlugin('styles.[chunkhash].css'),
      new webpack.optimize.CommonsChunkPlugin(
        {names:['vendor', 'manifest']}
        // 'vendor',
        // '[name].[chunkhash].js'
      ),
      new webpack.DefinePlugin({
        // This affects react lib size
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        mangle: false
      })
    ]
  });
}

