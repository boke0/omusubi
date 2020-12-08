module.exports = {
  mode: 'production',
  entry: './main.js',
  output: {
    path: __dirname,
    filename: 'omusubi.min.js',
    library: 'Omusubi',
    libraryTarget: 'umd',
    globalObject: 'this'
  }
}
