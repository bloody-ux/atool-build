import getTSCommonConfig from './getTSCommonConfig';

const tsQuery = getTSCommonConfig();

export default function injectBabelConfig(webpackConfig) {
  const babelConfig = webpackConfig.babel;
  delete webpackConfig.babel; // eslint-disable-line

  webpackConfig.module.rules.push(
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: babelConfig,
    },
    {
      test: /\.tsx?$/,
      use: [
        {
          loader: 'babel-loader',
          options: babelConfig,
        },
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: tsQuery,
          },
        },
      ],
    },
  );
}
