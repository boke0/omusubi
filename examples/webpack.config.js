module.exports = {
  entry: './src/main.js',
  output: {
    path: `${__dirname}`,
    filename: `main.js`
  },
  devServer: {
    contentBase: `${__dirname}`,
    port: 3030
  }
}
