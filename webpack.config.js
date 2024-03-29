var webpack = require('webpack');
var path = require('path');
var GitRevisionPlugin = require('git-revision-webpack-plugin')

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR  = path.resolve(__dirname, '');

var config = {
  entry: [
    APP_DIR + '/src/Game.js'
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|src\/phaser)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  devServer: {
    open: true,
    historyApiFallback: true
  },
  devtool: 'eval-source-map',
  plugins: [

  ]
};


module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.devServer = {};
    config.bail = true;
    config.stats = 'verbose';
    config.plugins = config.plugins.concat([
      new GitRevisionPlugin()
    ]);
  }

   return config;
};
