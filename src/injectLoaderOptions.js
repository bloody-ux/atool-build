import { existsSync } from 'fs';
import { join, resolve } from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import getTSCommonConfig from './getTSCommonConfig';
import { parallelizeStyle } from './happyPack';

const tsQuery = getTSCommonConfig();

function injectPostcssOptions(webpackConfig, args) {
  const postcssOptions = webpackConfig.postcss;
  delete webpackConfig.postcss; // eslint-disable-line

  const pkgPath = join(args.cwd, 'package.json');
  const pkg = existsSync(pkgPath) ? require(pkgPath) : {};

  let theme = {};
  if (pkg.theme && typeof pkg.theme === 'string') {
    let cfgPath = pkg.theme;
    // relative path
    if (cfgPath.charAt(0) === '.') {
      cfgPath = resolve(args.cwd, cfgPath);
    }
    const getThemeConfig = require(cfgPath);
    theme = getThemeConfig();
  } else if (pkg.theme && typeof pkg.theme === 'object') {
    theme = pkg.theme;
  }

  webpackConfig.module.rules.push(
    {
      test(filePath) {
        return /\.css$/.test(filePath) && !/\.module\.css$/.test(filePath);
      },
      use: ExtractTextPlugin.extract({
        use: parallelizeStyle([
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: postcssOptions,
          },
        ],
        webpackConfig.plugins,
        ),
      }),
    },
    {
      test: /\.module\.css$/,
      use: ExtractTextPlugin.extract({
        use: parallelizeStyle([
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: postcssOptions,
          },
        ],
        webpackConfig.plugins,
        ),
      }),
    },
    {
      test(filePath) {
        return /\.less$/.test(filePath) && !/\.module\.less$/.test(filePath);
      },
      use: ExtractTextPlugin.extract({
        use: parallelizeStyle([
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: postcssOptions,
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              modifyVars: theme,
            },
          },
        ],
        webpackConfig.plugins,
        ),
      }),
    },
    {
      test: /\.module\.less$/,
      use: ExtractTextPlugin.extract({
        use: parallelizeStyle([
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: postcssOptions,
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              modifyVars: theme,
            },
          },
        ],
        webpackConfig.plugins,
        ),
      }),
    },
  );
}

function injectBabelOptions(webpackConfig) {
  const babelOptions = webpackConfig.babel;
  delete webpackConfig.babel; // eslint-disable-line

  webpackConfig.module.rules.push(
    {
      parallel: true,
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: babelOptions,
    },
    {
      parallel: true,
      test: /\.tsx?$/,
      use: [
        {
          loader: 'babel-loader',
          options: babelOptions,
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

export default function injectLoaderOptions(webpackConfig, args) {
  injectPostcssOptions(webpackConfig, args);
  injectBabelOptions(webpackConfig);
}
