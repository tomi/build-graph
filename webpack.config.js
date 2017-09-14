const jsRule = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        ['env', {
          'targets': {
            'browsers': ['last 3 versions']
          }
        }]
      ],
      plugins: ['lodash']
    }
  }
}

module.exports ={
    context: __dirname,
    entry: "./app.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    }
}
