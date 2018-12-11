const path = require('path');
module.exports = {
  webpack: {
    mode: "none",
    entry: path.join(__dirname, '../src/main')
  }
}
