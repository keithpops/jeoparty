// MAIN DEPENDENCIES
var path = require('path');
var webpack = require('webpack');

var _ = require('lodash');

var node_modules_dir = path.resolve(__dirname, '../node_modules');
var pathToReact = path.resolve(node_modules_dir, 'react/dist/react.min.js');

// PLUGINS
// html / clean / extract css
var HtmlWebpackPlugin = require('html-webpack-plugin'),
    Clean = require("clean-webpack-plugin");    
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    StatsPlugin = require("stats-webpack-plugin");

// fixture extract css
function extractForProduction(loaders) {
  return ExtractTextPlugin.extract('style', loaders.substr(loaders.indexOf('!')));
}

var cssLoaders = 'style-loader!css-loader';
var sassLoaders = 'style!css!sass?indentedSyntax';

// stats
var excludeFromStats = [
    /node_modules[\\\/]react(-router)?[\\\/]/
];

// common configs

var config = {
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};

module.exports = function(options) {
  var production = options.production;
  var dev = options.dev;

  // webpack plugins
  var plugins = [new webpack.NoErrorsPlugin()];

  var cleanDirectories = [];

  // html template  
  var suffix = '';
  var outputPath = './build/';

  if (!dev) {

    cssLoaders = extractForProduction(cssLoaders);
    sassLoaders = extractForProduction(sassLoaders);
    
    suffix = '-prod';    
    plugins.push(new ExtractTextPlugin("app-[hash].css"));
    plugins.push(new StatsPlugin(path.join(__dirname, '../dist/', "stats.prerender.json"), {
      chunkModules: true,
      exclude: excludeFromStats
    }));

    outputPath = './dist/';

    plugins.push(new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'));

    cleanDirectories.push('../dist');
  }
  else {    
    plugins.push(new ExtractTextPlugin("app-[hash].css"));
    cleanDirectories.push('../build'); 
  }
  
  plugins.push(
    new HtmlWebpackPlugin({
      filename: 'index'+suffix+'.html',
      template: 'assets/index'+suffix+'.html'
    })    
  );

  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true)  
      }
    })
  );

  

  // new Clean(cleanDirectories)        

  var hash = production || !dev ? '-[hash]': '';  

  if (!options.production) {

    return _.merge({}, config, {
      devtool: 'eval',
      entry: {    
        app: './app/app',
        vendors: ['react', 'react-router', 'react-hot-loader']
      },    
      output: {
          path: outputPath,
          filename: 'app'+hash+'.js',
          publicPath: production ? '' : ''
      },
      module: {
        loaders: [
          { test: /\.jsx?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },      
          { test: /\.(jpe?g|png|gif|svg|woff|eot|ttf)$/, loader: 'url?limit=10000&name=[sha512:hash:base64:7].[ext]' },
          { test: /\.sass$/, loader: sassLoaders },
          { test: /\.css$/, loader: cssLoaders },
          { test: /\.scss$/, loader: cssLoaders }
        ]
      },
      plugins: plugins    
    });
  }
  else {
      // server
    return _.merge({}, {}, {    
      entry: {    
        server: './app/server'
      },
       output: {
        path: './dist/',
        filename: 'server.js',
        libraryTarget: 'commonjs2'
      },
      resolve: {
        extensions: ['', '.js', '.jsx']
      },
      target: 'node',
      externals: /^[a-z][a-z\.\-0-9]*$/,
      node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: true,
        __dirname: true
      },
      module : {
        loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
          { test: /\.jsx?$/, loaders: ['babel'], exclude: /node_modules/ },
          { test: /\.(jpe?g|png|gif|svg|woff|eot|ttf)$/, loader: 'url?limit=10000&name=[sha512:hash:base64:7].[ext]' },
          { test: /\.sass$/, loader: sassLoaders },
          { test: /\.css$/, loader: cssLoaders },
          { test: /\.scss$/, loader: cssLoaders }
        ]
      },
      plugins: plugins
    });

  }
};

// { test: /\.(jpe?g|png|gif|svg|woff|eot|ttf)$/, loader: 'url?limit=10000&name=[sha512:hash:base64:7].[ext]' }

//&name=dist/[hash].[ext]

//module.exports = [clientApp, serverApp];