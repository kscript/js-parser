const path = require('path');
module.exports = {
  webpack: {
    output: {
      path: path.join(__dirname, '../dist'),
      filename: "app.js",
      publicPath: "./"
    }
  }
}
