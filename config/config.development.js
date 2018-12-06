const path = require('path');
module.exports = {
  server: {
    host: 'localhost',
    port: 5000
  },
  proxy: {
    prot: 5001
  },
  webpack: {
    devtool:'source-map',
    devServer: {
      proxy: {
        '/api': 'http://localhost:5001'
      },
      contentBase: false,
      pusblic: path.join(__dirname, '../dist'),
      compress: true,
      historyApiFallback: true,
      hot: true,
      https: false,
      noInfo: true
    },
    context: __dirname,
    target: "web",
    serve: {
      port: 1337,
      content: '../dist',
    },
    stats: "errors-only",
  }
}
