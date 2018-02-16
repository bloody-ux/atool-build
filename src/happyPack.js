import HappyPack from 'happypack';

const happyThreadPool = HappyPack.ThreadPool({ size: 8 });

const options = {
  threadPool: happyThreadPool,
};

let seed = 0;
const getId = () => {
  seed += 1;
  return `parallel${seed}`;
};

function parallelizeLoader(plugins = [], rule) {
  // not in the multi-thread mapping list
  if (!rule.parallel) return;
  delete rule.parallel;

  let loaders = null;
  if (Array.isArray(rule.use)) {
    loaders = rule.use;
  } else if (typeof rule.loader !== 'undefined') {
    loaders = [
      {
        loader: rule.loader,
        options: rule.options,
      },
    ];

    delete rule.loader;
    delete rule.options;
  }

  if (!loaders) return; // not use/loader

  // parallelized
  const id = getId();
  rule.use = `happypack/loader?id=${id}`;
  plugins.push(new HappyPack({
    ...options,
    id,
    loaders,
  }));
}


export default function parallelize(webpackConfig = []) {
  webpackConfig.forEach((config) => {
    const plugins = config.plugins;
    const processer = parallelizeLoader.bind(null, plugins);

    config.module.rules.forEach(processer);
  });
}
