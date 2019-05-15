// define child rescript
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
module.exports = config => {
    config.target = 'electron-renderer';
    config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));
    return config;
  }