const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: `${__dirname}/dist`,
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
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: `${__dirname}/index.html`
    })
  ]
}
