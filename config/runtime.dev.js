process.env.NODE_ENV = 'development';

// const webpackConfig = require('./webpack.config.js');
// module.exports = {
//   mode: 'development',
//   ...webpackConfig
// }

const config = require("./config.main");
const chalk = require('chalk')
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);
const middleware = webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  log: false,
  reload: true
});
const app = express();

app.use(middleware);

middleware.waitUntilValid(function () {
  console.log(chalk.blue(`\nhttp://${config.server.host}:${config.server.port}\n`));
});

app.listen(config.server.port, function () {
});
