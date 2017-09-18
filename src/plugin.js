import merge from 'webpack-merge';
import getWebpackCommonConfig from './getWebpackCommonConfig';

export default class Plugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.plugin('environment', () => {
      const defaultConfig = getWebpackCommonConfig(compiler, this.options);
      compiler.options = merge(defaultConfig, compiler.options); // eslint-disable-line
    });

    compiler.plugin('done', this.afterDone.bind(this));
  }

  afterDone() {
    if (this.options.json) {
      const filename = typeof this.options.json === 'boolean' ? 'build-bundle.json' : this.options.json;
      const jsonPath = join(fileOutputPath, filename);
      writeFileSync(jsonPath, JSON.stringify(stats.toJson()), 'utf-8');
      console.log(`Generate Json File: ${jsonPath}`);
    }

    const { errors } = stats.toJson();
    if (errors && errors.length) {
      process.on('exit', () => {
        process.exit(1);
      });
    }
    // if watch enabled only stats.hasErrors would log info
    // otherwise  would always log info
    if (!args.watch || stats.hasErrors()) {
      const buildInfo = stats.toString({
        colors: true,
        children: true,
        chunks: !!args.verbose,
        modules: !!args.verbose,
        chunkModules: !!args.verbose,
        hash: !!args.verbose,
        version: !!args.verbose,
      });
      if (stats.hasErrors()) {
        console.error(buildInfo);
      } else {
        console.log(buildInfo);
        if (args.silent !== true) {
          notifier.notify({
            title: 'ant tool',
            message: 'done',
            subtitle: 'build successfully',
            contentImage: join(__dirname, '../assets/success.png'),
            sound: 'Glass',
          });
        }
      }
    }


  }
}
