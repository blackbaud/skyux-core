const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

function outPath(...args) {
  return path.join(process.cwd(), 'node_modules/@skyux-sdk/builder', ...args);
}

module.exports = {
  getWebpackConfig: function (skyPagesConfig, argv) {

    const srcPath = path.resolve(process.cwd(), 'src', 'app', 'public');

    return {
      mode: 'development',

      resolve: {
        extensions: ['.ts', '.js']
      },

      module: {
        rules: [
          {
            enforce: 'pre',
            test: /sky-pages\.module\.ts$/,
            loader: outPath('loader', 'sky-pages-module')
          },

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
        new LoaderOptionsPlugin({
          debug: true,
          options: {
            context: __dirname,
            skyPagesConfig
          }
        }),

        new DefinePlugin({
          'ROOT_DIR': JSON.stringify(srcPath)
        })
      ]
    };

  }
};