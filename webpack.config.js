const webpack = require('webpack');
const webpackManifestPlugin = require('webpack-manifest-plugin');
const webpackCleanPlugin = require('clean-webpack-plugin');
const webpackTerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const globalPrefix = 'MailPoetLib';
const PRODUCTION_ENV = process.env.NODE_ENV === 'production';
const manifestSeed = {};

// Base config
const baseConfig = {
  mode: PRODUCTION_ENV ? 'production' : 'development',
  devtool: PRODUCTION_ENV ? undefined : 'eval-source-map',
  cache: true,
  context: __dirname,
  watchOptions: {
    aggregateTimeout: 300,
    poll: true
  },
  optimization: {
    minimizer: [
      new webpackTerserPlugin({
        terserOptions: {
          // preserve identifier names for easier debugging & support
          mangle: false,
        },
        parallel: false,
      }),
    ],
  },
  output: {
    path: path.join(__dirname, 'assets/dist/js'),
    filename: (PRODUCTION_ENV) ? '[name].[hash:8].js' : '[name].js',
    chunkFilename: (PRODUCTION_ENV) ? '[name].[hash:8].chunk.js' : '[name].chunk.js',
    jsonpFunction: 'mailpoetJsonp'
  },
  resolve: {
    modules: [
      'node_modules',
      'assets/js/src',
    ],
    alias: {
      'handlebars': 'handlebars/dist/handlebars.js',
      'backbone.marionette': 'backbone.marionette/lib/backbone.marionette',
      'backbone.supermodel$': 'backbone.supermodel/build/backbone.supermodel.js',
      'sticky-kit': 'vendor/jquery.sticky-kit.js',
      'interact$': 'interact.js/interact.js',
      'spectrum$': 'spectrum-colorpicker/spectrum.js',
      'wp-js-hooks': path.resolve(__dirname, 'assets/js/src/hooks.js'),
      'blob$': 'blob-tmp/Blob.js',
      'papaparse': 'papaparse/papaparse.min.js',
      'html2canvas': 'html2canvas/dist/html2canvas.js',
      'asyncqueue': 'vendor/jquery.asyncqueue.js',
      'intro.js': 'intro.js/intro.js',
    },
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new webpackCleanPlugin([
      './assets/dist/js/*',
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|src\/vendor)/,
        loader: 'babel-loader',
      },
      {
        test: /form_editor\.js$/,
        loader: 'expose-loader?WysijaForm',
      },
      {
        include: require.resolve('codemirror'),
        loader: 'expose-loader?CodeMirror',
      },
      {
        include: require.resolve('backbone'),
        loader: 'expose-loader?Backbone',
      },
      {
        include: require.resolve('underscore'),
        loader: 'expose-loader?_',
      },
      {
        include: require.resolve('react-tooltip'),
        loader: 'expose-loader?' + globalPrefix + '.ReactTooltip',
      },
      {
        include: require.resolve('react'),
        loader: 'expose-loader?' + globalPrefix + '.React',
      },
      {
        include: require.resolve('react-dom'),
        loader: 'expose-loader?' + globalPrefix + '.ReactDOM',
      },
      {
        include: require.resolve('react-router-dom'),
        use: 'expose-loader?' + globalPrefix + '.ReactRouter',
      },
      {
        include: require.resolve('react-string-replace'),
        loader: 'expose-loader?' + globalPrefix + '.ReactStringReplace',
      },
      {
        include: path.resolve(__dirname, 'assets/js/src/hooks.js'),
        use: 'expose-loader?' + globalPrefix + '.Hooks',
      },
      {
        test: /listing.jsx/i,
        use: [
          'expose-loader?' + globalPrefix + '.Listing',
          'babel-loader'
        ],
      },
      {
        test: /form.jsx/i,
        use: [
          'expose-loader?' + globalPrefix + '.Form',
          'babel-loader'
        ]
      },
      {
        include: path.resolve(__dirname, 'assets/js/src/newsletters/listings/mixins.jsx'),
        use: [
          'expose-loader?' + globalPrefix + '.NewslettersListingsMixins',
          'babel-loader',
        ]
      },
      {
        include: path.resolve(__dirname, 'assets/js/src/newsletters/listings/tabs.jsx'),
        use: [
          'expose-loader?' + globalPrefix + '.NewslettersListingsTabs',
          'babel-loader',
        ]
      },
      {
        include: path.resolve(__dirname, 'assets/js/src/newsletters/listings/heading.jsx'),
        use: [
          'expose-loader?' + globalPrefix + '.NewslettersListingsHeading',
          'babel-loader',
        ]
      },
      {
        include: path.resolve(__dirname, 'assets/js/src/announcements/feature_announcement.jsx'),
        use: [
          'expose-loader?' + globalPrefix + '.FeatureAnnouncement',
          'babel-loader',
        ]
      },
      {
        include: path.resolve(__dirname, 'assets/js/src/form/fields/selection.jsx'),
        use: [
          'expose-loader?' + globalPrefix + '.FormFieldSelection',
          'babel-loader',
        ]
      },
      {
        include: path.resolve(__dirname, 'assets/js/src/form/fields/text.jsx'),
        use: [
          'expose-loader?' + globalPrefix + '.FormFieldText',
          'babel-loader',
        ]
      },
      {
        include: path.resolve(__dirname, 'assets/js/src/newsletters/scheduling/common.jsx'),
        use: [
          'expose-loader?' + globalPrefix + '.NewsletterSchedulingCommonOptions',
          'babel-loader',
        ]
      },
      {
        include: path.resolve(__dirname, 'assets/js/src/newsletters/badges/stats.jsx'),
        use: [
          'expose-loader?' + globalPrefix + '.StatsBadge',
          'babel-loader',
        ]
      },
      {
        include: path.resolve(__dirname, 'assets/js/src/newsletters/breadcrumb.jsx'),
        use: [
          'expose-loader?' + globalPrefix + '.NewsletterCreationBreadcrumb',
          'babel-loader',
        ]
      },
      {
        include: path.resolve(__dirname, 'assets/js/src/newsletters/types/automatic_emails/events_list.jsx'),
        use: [
          'expose-loader?' + globalPrefix + '.AutomaticEmailEventsList',
          'babel-loader',
        ]
      },
      {
        include: path.resolve(__dirname, 'assets/js/src/help-tooltip.jsx'),
        use: [
          'expose-loader?' + globalPrefix + '.HelpTooltip',
          'babel-loader',
        ]
      },
      {
        include: path.resolve(__dirname, 'assets/js/src/newsletters/types/automatic_emails/breadcrumb.jsx'),
        use: [
          'expose-loader?' + globalPrefix + '.AutomaticEmailsBreadcrumb',
          'babel-loader',
        ]
      },
      {
        include: /Blob.js$/,
        loader: 'exports-loader?window.Blob',
      },
      {
        test: /backbone.supermodel/,
        loader: 'exports-loader?Backbone.SuperModel',
      },
      {
        include: require.resolve('handlebars'),
        loader: 'expose-loader?Handlebars',
      },
      {
        include: /html2canvas.js$/,
        loader: 'expose-loader?html2canvas',
      },
      {
        include: require.resolve('velocity-animate'),
        loader: 'imports-loader?jQuery=jquery',
      },
      {
        include: require.resolve('classnames'),
        use: [
          'expose-loader?' + globalPrefix + '.ClassNames',
          'babel-loader',
        ]
      },
    ]
  }
};

// Admin config
const adminConfig = {
  name: 'admin',
  entry: {
    vendor: 'webpack_vendor_index.jsx',
    mailpoet: 'webpack_mailpoet_index.jsx',
    admin_vendor: [
      'react',
      'react-dom',
      require.resolve('react-router-dom'),
      'react-string-replace',
      'prop-types',
      'classnames',
      'help-tooltip.jsx',
      'form/form.jsx',
      'listing/listing.jsx',
      'newsletters/badges/stats.jsx',
      'newsletters/breadcrumb.jsx',
      'newsletters/listings/tabs.jsx',
      'newsletters/listings/mixins.jsx',
      'newsletters/listings/heading.jsx',
      'announcements/feature_announcement.jsx',
      'announcements/free_plan_announcement.jsx',
      'newsletters/types/automatic_emails/events_list.jsx',
      'newsletters/types/automatic_emails/breadcrumb.jsx',
      'newsletters/types/welcome/scheduling.jsx',
    ],
    admin: 'webpack_admin_index.jsx',
    form_editor: 'form_editor/webpack_index.jsx',
    newsletter_editor: 'newsletter_editor/webpack_index.jsx',
  },
  optimization: {
    runtimeChunk: {
      name: 'vendor',
    },
    splitChunks: {
      cacheGroups: {
        chunks: 'all',
        default: false,
        vendors: false,
        vendor: {
          name: 'vendor',
          chunks: (chunk) => chunk.name === 'vendor',
          priority: 1,
          enforce: true,
        },
        admin_vendor_chunk: {
          name: 'admin_vendor_chunk',
          test: (module, chunks) => {
            // add all modules from 'admin_vendor' entrypoint
            if (chunks.some((chunk) => chunk.name === 'admin_vendor')) {
              return true;
            }

            // add admin/form_editor/newsletter_editor shared modules
            const filteredChunks = chunks.filter((chunk) => {
              return ['admin', 'form_editor', 'newsletter_editor'].includes(chunk.name);
            });
            return filteredChunks.length > 1;
          },
          enforce: true,
          chunks: (chunk) => ['admin_vendor', 'admin', 'form_editor', 'newsletter_editor'].includes(chunk.name),
          priority: 0,
        },
      }
    }
  },
  externals: {
    'jquery': 'jQuery',
    'tinymce': 'tinymce'
  }
};

// Public config
const publicConfig = {
  name: 'public',
  entry: {
    public: 'webpack_public_index.jsx',
  },
  plugins: [
    ...baseConfig.plugins,

    // replace MailPoet definition with a smaller version for public
    new webpack.NormalModuleReplacementPlugin(
      /mailpoet\.js/,
      './mailpoet_public.js'
    ),
  ],
  externals: {
    'jquery': 'jQuery'
  }
};

// Migrator config
const migratorConfig = {
  name: 'mp2migrator',
  entry: {
    mp2migrator: [
      'mp2migrator.js'
    ]
  },
  externals: {
    'jquery': 'jQuery',
    'mailpoet': 'MailPoet'
  }
};

// Test config
const testConfig = {
  name: 'test',
  entry: {
    vendor: 'webpack_vendor_index.jsx',
    testNewsletterEditor: [
      'webpack_mailpoet_index.jsx',
      'newsletter_editor/webpack_index.jsx',

      'components/config.spec.js',
      'components/content.spec.js',
      'components/heading.spec.js',
      'components/save.spec.js',
      'components/sidebar.spec.js',
      'components/styles.spec.js',
      'components/communication.spec.js',

      'blocks/automatedLatestContentLayout.spec.js',
      'blocks/button.spec.js',
      'blocks/container.spec.js',
      'blocks/divider.spec.js',
      'blocks/footer.spec.js',
      'blocks/header.spec.js',
      'blocks/image.spec.js',
      'blocks/posts.spec.js',
      'blocks/products.spec.js',
      'blocks/social.spec.js',
      'blocks/spacer.spec.js',
      'blocks/text.spec.js',
    ],
  },
  output: {
    path: path.join(__dirname, 'tests/javascript/testBundles'),
    filename: '[name].js',
  },
  plugins: [
    ...baseConfig.plugins,

    // replace MailPoet definition with a smaller version for public
    new webpack.NormalModuleReplacementPlugin(
      /mailpoet\.js/,
      './mailpoet_tests.js'
    ),
  ],
  resolve: {
    modules: [
      'node_modules',
      'assets/js/src',
      'tests/javascript/newsletter_editor'
    ],
    alias: {
      'sticky-kit': 'vendor/jquery.sticky-kit.js',
      'backbone.marionette': 'backbone.marionette/lib/backbone.marionette',
      'backbone.supermodel$': 'backbone.supermodel/build/backbone.supermodel.js',
      'blob$': 'blob-tmp/Blob.js',
      'wp-js-hooks': path.resolve(__dirname, 'assets/js/src/hooks.js'),
    },
  },
  externals: {
    'jquery': 'jQuery',
    'tinymce': 'tinymce',
    'interact': 'interact',
    'spectrum': 'spectrum',
  }
};

module.exports = [adminConfig, publicConfig, migratorConfig, testConfig].map((config) => {
  if (config.name !== 'test') {
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpackManifestPlugin({
        // create single manifest file for all Webpack configs
        seed: manifestSeed,
      })
    );
  }
  return Object.assign({}, baseConfig, config);
});
