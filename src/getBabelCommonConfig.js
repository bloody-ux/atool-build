import { tmpdir } from 'os';

export default function babel(pkg) {
  const flowOptions = pkg.flow || {
    modules: [{
      isRegExp: true,
      name: '/interfaces/',
    }],
  };

  return {
    cacheDirectory: tmpdir(),
    presets: [
      require.resolve('babel-preset-es2015-ie'),
      require.resolve('babel-preset-react'),
      require.resolve('babel-preset-stage-0'),
    ],
    plugins: [
      require.resolve('babel-plugin-add-module-exports'),
      require.resolve('babel-plugin-transform-decorators-legacy'),
      [require.resolve('transform-flow-interface-imports'), flowOptions],
    ],
  };
}
