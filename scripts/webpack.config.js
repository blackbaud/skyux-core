const skyPagesConfigUtil = require('@skyux-sdk/builder/config/sky-pages/sky-pages.config');
const aliasBuilder = require('@skyux-sdk/builder/config/webpack/alias-builder');
const path = require('path');

function spaPath(args) {
  return path.join(process.cwd(), ...args);
}

function outPath(args) {
  return path.join(process.cwd(), 'node_modules/@skyux-sdk/builder', ...args);
}

module.exports = {
  getWebpackConfig: function (skyPagesConfig, argv) {

    const resolves = [
      process.cwd(),
      spaPath('node_modules'),
      outPath('node_modules')
    ];

    const excludes = [
      spaPath('node_modules'),
      outPath('node_modules')
    ];

    const alias = aliasBuilder.buildAliasList(skyPagesConfig);

    return {

      mode: 'development',

      devtool: 'inline-source-map',

      resolveLoader: {
        modules: resolves
      },

      resolve: {
        alias,
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
          },
          {
            // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
            // Removing this will cause deprecation warnings to appear.
            // See: https://github.com/angular/angular/issues/21560#issuecomment-433601967
            test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
            parser: {
              system: true
            }
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
          'ENV': JSON.stringify(ENV),
          'HMR': false,
          'process.env': {
            'ENV': JSON.stringify(ENV),
            'NODE_ENV': JSON.stringify(ENV),
            'HMR': false
          },
          'ROOT_DIR': JSON.stringify(srcPath),
          'skyPagesConfig': JSON.stringify(skyPagesConfig)
        }),

        new ContextReplacementPlugin(
          // The (\\|\/) piece accounts for path separators in *nix and Windows
          /angular(\\|\/)core(\\|\/)@angular/,
          skyPagesConfigUtil.spaPath('src'),
          {}
        ),

        // Suppress the "request of a dependency is an expression" warnings.
        // See: https://github.com/angular/angular/issues/20357#issuecomment-343683491
        new ContextReplacementPlugin(
          /\@angular(\\|\/)core(\\|\/)fesm5/,
          spaPath('src'),
          {}
        )
      ]
    };

  }
};