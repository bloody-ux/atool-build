import { join } from 'path';
import { readFileSync } from 'fs';
import glob from 'glob';
import expect from 'expect';

import build from '../src/build';

function assert(actualDir, _expect) {
  const expectDir = join(__dirname, 'expect', _expect);
  const actualFiles = glob.sync('**/*', { cwd: actualDir, nodir: true });

  actualFiles.forEach((file) => {
    const actualFile = readFileSync(join(actualDir, file), 'utf-8');
    const expectFile = readFileSync(join(expectDir, file), 'utf-8');
    expect(actualFile).toEqual(expectFile);
  });
}

function testBuild(args, fixture) {
  return new Promise((resolve) => {
    const cwd = join(__dirname, 'fixtures', fixture);
    const outputPath = join(cwd, 'dist');
    process.chdir(cwd);

    const defaultConfig = {
      cwd,
      compress: false,
    };

    build({ ...defaultConfig, ...args }, (err) => {
      if (err) throw new Error(err);
      assert(outputPath, fixture);
      resolve();
    });
  });
}

describe('lib/build', function action() {
  this.timeout(50000);
  it('should build normally', () => testBuild({ hash: true }, 'build-normal'));
  it('should support class property', () => testBuild({}, 'build-class-property'));
  it('should support less', () => testBuild({}, 'build-less'));
  it('should support css modules', () => testBuild({}, 'build-css-modules'));
  it('should support add-module-exports', () => testBuild({}, 'build-add-module-exports'));
  it('should support jsx', () => testBuild({}, 'build-jsx'));
  it('should support json', () => testBuild({}, 'build-json'));
  it('should support node builtins', () => testBuild({}, 'build-node-builtins'));
  it('should support mergeCustomConfig plugins', () => testBuild({ hash: true }, 'build-mergeCustomConfig-plugins'));
  it('should support mergeCustomConfig environment production', () => testBuild({ compress: true }, 'build-mergeCustomConfig-environment-production'));
  it('should support mergeCustomConfig environment development', () => {
    process.env.NODE_ENV = 'development';
    return testBuild({}, 'build-mergeCustomConfig-environment-development');
  });
  it('should support config', () => testBuild({ config: 'webpack.config.path.js' }, 'build-mergeCustomConfig-path'));
  it('should support dedupe', () => testBuild({}, 'build-dedupePlugin-enabled'));
  it('should support hash map', () => testBuild({ hash: true }, 'build-hash-map'));
  it('should support i18n', () => testBuild({}, 'build-i18n'));
  it('should support decorator', () => testBuild({}, 'build-decorator'));
  it('should support es3', () => testBuild({}, 'build-es3'));
  it('should support typescript', () => testBuild({}, 'build-typescript'));
  it('should support theme', () => testBuild({}, 'build-theme'));
  it('should support font', () => testBuild({}, 'build-font'));
  it('should support autoprefix', () => testBuild({}, 'build-autoprefix'));
  it('should support common', () => testBuild({}, 'build-common'));
  it('should support svg', () => testBuild({}, 'build-svg'));
  it('should throw error', () => testBuild({}, 'build-no-entry')
    .catch((err) => {
      expect(err.name).toEqual('NoEntry');
      expect(err.message).toEqual('no webpack entry found');
    }));
  it('should support notify', () => testBuild({ hash: true, notify: true }, 'build-normal'));
  it('should custom babel', () => testBuild({}, 'build-mergeCustomConfig-babel'));
});
