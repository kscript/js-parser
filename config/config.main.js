const base = require("./config.base");
const production = require("./config.production");
const development = require("./config.development");
const merge = require('webpack-merge');
const config = {
  production: merge(base, production),
  development: merge(base, development)
}

module.exports = config[process.env.NODE_ENV];