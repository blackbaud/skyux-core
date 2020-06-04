const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');

module.exports = {
  getWebpackConfig: function () {

    const srcPath = path.resolve(process.cwd(), 'src', 'app', 'public');

    return {
      mode: 'development',

      resolve: {
        extensions: ['.ts', '.js']
      },

      module: {
        rules: [
          {
            test: /\.ts$/,
            use: ['awesome-typescript-loader', 'angular2-template-loader']
          },

          {
            test: /\.s?css$/,
            use: ['raw-loader', 'sass-loader']
          },

          {
            test: /\.html$/,
            loader: 'raw-loader'
          }
        ]
      },

      plugins: [
        new DefinePlugin({
          'ROOT_DIR': JSON.stringify(srcPath)
        })
      ]
    };

  }
};