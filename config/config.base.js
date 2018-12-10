const path = require('path');
module.exports = {
  webpack: {
    mode: "none",
    entry: path.join(__dirname, '../src/main'),
    output: {
      path: path.join(__dirname, '../dist'),
      filename: "app.js",
      publicPath: "/"
    }
  }
}
