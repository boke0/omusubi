module.exports = {
  entry: './src/main.js',
  output: {
    path: `${__dirname}`,
    filename: './main.js'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader:'constructable-style-loader',
            options: {
              purge: true,
              content: ['**/*.js']
            }
          },
          {
            loader:'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-nested']
              }
            }
          }
        ],
      }
    ]
  },
  devServer: {
    contentBase: `${__dirname}`,
    port: 3031
  }
}
