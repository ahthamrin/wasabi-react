var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');
var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var pkg = require('./package.json');

const autoprefixer = require('autoprefixer');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

var common = {
  entry: ['bootstrap-loader', PATHS.app ],
  // entry: [ PATHS.app ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: PATHS.app
      },
      // bootstrap-loader related
      { test: /\.css$/, loaders: [ 'style', 'css', 'postcss' ], include: 'bootstrap-loader' },
      { test: /\.scss$/, loaders: [ 'style', 'css', 'postcss', 'sass' ] },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url?limit=10000"
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        loader: 'file'
      },
      { test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery' },
      { test: /jquery-touchswipe\/jquery\.touchSwipe\.js$/, loader: 'imports?jQuery=jquery,$=jquery' }
    ]
  },
  // postcss: [ autoprefixer ],
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
    "window.jQuery": "jquery"
    })
  ]
};

if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
          include: PATHS.app
        },
        {
          test: /\.scss$/,
          loaders: ['style', 'css', 'scss'],
          include: PATHS.app
        },
        // bootstrap-loader related
        // { test: /\.css$/, loaders: [ 'style', 'css', 'postcss' ], include: 'bootstrap-loader' },
        // { test: /\.scss$/, loaders: [ 'style', 'css', 'postcss', 'sass' ] },
        // {
        //   test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        //   loader: "url?limit=10000"
        // },
        // {
        //   test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        //   loader: 'file'
        // },
        // { test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery' }
      ]
    },
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
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
      vendor: ['bootstrap-loader/extractStyles'].concat(Object.keys(pkg.dependencies))
    },
    output: {
      path: PATHS.build,
      // filename: '[name].js'
      filename: '[name].[chunkhash].js',
      chunkFilename: '[chunkhash].js'
    },
    devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style', 'css!sass'),
          include: PATHS.app
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: PATHS.app
        },

        // // bootstrap-loader related
        // // { test: /\.css$/, loaders: [ 'style', 'css', 'postcss' ], include: 'bootstrap-loader' },
        // // { test: /\.scss$/, loaders: [ 'style', 'css', 'postcss', 'sass' ] },
        // // { test: /\.css$/, loader: ExtractTextPlugin.extract( 'style', 'css!postcss' ) },
        // { test: /\.scss$/, loader: ExtractTextPlugin.extract( 'style', 'css!postcss!sass' ) },
        // {
        //   test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        //   loader: "url?limit=10000"
        // },
        // {
        //   test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        //   loader: 'file'
        // },
        // { test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery' }
      ]
    },
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
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}

