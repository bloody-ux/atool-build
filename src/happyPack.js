import HappyPack from 'happypack';
import { cpus } from 'os';

const theadCount = Math.max(1, cpus().length - 1);
const useParallel = theadCount > 1;
const happyThreadPool = HappyPack.ThreadPool({ size: theadCount });

const options = {
  threadPool: happyThreadPool,
};

let seed = 0;
const getId = () => {
  seed += 1;
  return `parallel${seed}`;
};

export function parallelizeStyle(loaders = [], plugins = []) {
  if (!useParallel) return loaders;

  const id = getId();

  plugins.push(new HappyPack({
    ...options,
    id,
    loaders,
  }));

  return `happypack/loader?id=${id}`;
}

function parallelizeLoader(plugins = [], rule) {
  // not in the multi-thread mapping list
  if (!rule.parallel) return;
  delete rule.parallel;

  if (!useParallel) return;

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
  } else if (typeof rule.loaders !== 'undefined') {
    loaders = rule.loaders;

    delete rule.loaders;
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
