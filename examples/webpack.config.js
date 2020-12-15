module.exports = {
  entry: './src/main.js',
  output: {
    path: `${__dirname}`,
    filename: `main.js`
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        loader: 'css-loader',
      }
    ]
  },
  devServer: {
    contentBase: `${__dirname}`,
    port: 3030
  }
}
