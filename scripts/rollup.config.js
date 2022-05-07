const generate = require('videojs-generate-rollup-config');

// see https://github.com/videojs/videojs-generate-rollup-config
// for options
const options = {
  browserslist: ['defaults', 'ie 11'],
  externals(defaults) {
    return {
      browser: defaults.browser.concat([
        'OGVCompat',
        'OGVLoader',
        'OGVPlayer'
      ]),
      module: defaults.module.concat([
        'OGVCompat',
        'OGVLoader',
        'OGVPlayer'
      ]),
      test: defaults.test.concat([
        'OGVCompat',
        'OGVLoader',
        'OGVPlayer'
      ])
    };
  },
  globals(defaults) {
    return {
      browser: Object.assign(defaults.browser, {
        OGVCompat: 'OGVCompat',
        OGVLoader: 'OGVLoader',
        OGVPlayer: 'OGVPlayer'
      }),
      module: Object.assign(defaults.module, {
        OGVCompat: 'OGVCompat',
        OGVLoader: 'OGVLoader',
        OGVPlayer: 'OGVPlayer'
      }),
      test: Object.assign(defaults.test, {
        OGVCompat: 'OGVCompat',
        OGVLoader: 'OGVLoader',
        OGVPlayer: 'OGVPlayer'
      })
    };
  }
};
const config = generate(options);

// Add additonal builds/customization here!

// do not build module dists with rollup
// this is handled by build:es and build:cjs
if (config.builds.module) {
  delete config.builds.module;
}

// export the builds to rollup
export default Object.values(config.builds);
