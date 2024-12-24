const path = require('path');
const { override, addWebpackAlias } = require('customize-cra');

module.exports = override(
  // Add alias for "@" to map to the "src" folder
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'), // Makes imports cleaner
  }),

  // Add custom configuration
  (config) => {
    // Disable ModuleScopePlugin
    config.resolve.plugins = config.resolve.plugins.filter(
      (plugin) => plugin.constructor.name !== 'ModuleScopePlugin'
    );

    // Add fallback for `string_decoder`
    config.resolve.fallback = {
      ...config.resolve.fallback,
      string_decoder: require.resolve('string_decoder'), // Resolve string_decoder module
    };

    return config;
  }
);
