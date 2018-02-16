// eslint-disable-next-line
const I18nPlugin = require('i18n-webpack-plugin');

const langs = {
  en: null,
  de: require('./de.json'),
};

module.exports = function(webpackConfig) {
  return Object.keys(langs).map(lang => Object.assign({}, webpackConfig, {
    name: lang,
    output: Object.assign({}, webpackConfig.output, {
      filename: `app.${lang}.js`,
    }),
    plugins: [].concat(webpackConfig.plugins, new I18nPlugin(
      langs[lang],
    )),
  }));
};
