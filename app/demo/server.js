import 'babel-polyfill';
import 'source-map-support/register';
import path from 'path';
import webpack from 'webpack';
import WebPackDevServer from 'webpack-dev-server';

const PORT = 8888;

const webpackConfig = {
  entry: {
    app: [path.join(__dirname, 'client.js')],
  },
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/public/',
    filename: 'client.js',
  },
  devtool: 'eval-inline-source-map',
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  target: 'web',
};

const webPackDevServerConfig = {
  contentBase: path.join(__dirname, 'public'),
};

const compiler = webpack(webpackConfig);

const webpackServer = new WebPackDevServer(compiler, webPackDevServerConfig);
webpackServer.listen(PORT);
