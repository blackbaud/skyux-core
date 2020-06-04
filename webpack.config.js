const tsLoaderUtil = require('@skyux-sdk/builder/config/webpack/ts-loader-rule');
const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

function spaPath(...args) {
  return path.join(process.cwd(), ...args);
}

function outPath(...args) {
  return path.join(process.cwd(), 'node_modules/@skyux-sdk/builder', ...args);
}

module.exports = {
  getWebpackConfig: function (skyPagesConfig, argv) {

    const srcPath = path.resolve(process.cwd(), 'src', 'app', 'public');

    const resolves = [
      process.cwd(),
      spaPath('node_modules'),
      outPath('node_modules')
    ];

    const excludes = [
      spaPath('node_modules'),
      outPath('node_modules')
    ];

    return {
      mode: 'development',
      resolveLoader: {
        modules: resolves
      },
      resolve: {
        modules: resolves,
        extensions: [
          '.js',
          '.ts'
        ]
      },

      module: {
        rules: [
          {
            enforce: 'pre',
            test: /runtime\/config\.ts$/,
            loader: outPath('loader', 'sky-app-config')
          },
          {
            enforce: 'pre',
            test: /sky-pages\.module\.ts$/,
            loader: outPath('loader', 'sky-pages-module')
          },
          {
            enforce: 'pre',
            loader: outPath('loader', 'sky-processor', 'preload'),
            exclude: excludes
          },
          {
            enforce: 'pre',
            test: /skyux-i18n-testing\.js$/,
            loader: outPath('loader', 'sky-fix-require-context')
          },

          tsLoaderUtil.getRule(skyPagesConfig.runtime.command),

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
            skyPagesConfig: skyPagesConfig
          }
        }),

        new DefinePlugin({
          'ROOT_DIR': JSON.stringify(srcPath)
        })
      ]
    };

  }
};