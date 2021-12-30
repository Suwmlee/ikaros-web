module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:12346',
        changeOrigin: true,
        pathRewrite: {
          '^/api': 'api'
        }
      },
      '/imgs': {
        target: 'http://localhost:12346',
        changeOrigin: true,
        pathRewrite: {
          '^/imgs': 'imgs'
        }
      }
    }
  }
}
