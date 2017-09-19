function hello({ types: t }) {
  return {
    visitor: {
      Program(path) {
        path.unshiftContainer('body', t.expressionStatement(t.stringLiteral('use helloworld')));
      },
    },
  };
}

module.exports = function(webpackConfig) {
  webpackConfig.babel.plugins.push(hello);

  return webpackConfig;
};
