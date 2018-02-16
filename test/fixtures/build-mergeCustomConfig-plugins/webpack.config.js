module.exports = function config(webpackConfig) {
  webpackConfig.output.filename = '[name].js';
  webpackConfig.plugins = [];
  return webpackConfig;
};
