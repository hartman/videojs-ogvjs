const generate = require('videojs-generate-karma-config');

module.exports = function(config) {

  // see https://github.com/videojs/videojs-generate-karma-config
  // for options
  const options = {
    files(defaultFiles) {
      defaultFiles.splice(
        -1, 0,
        'node_modules/ogv/dist/ogv-support.js',
        'node_modules/ogv/dist/ogv.js',
      );
      return defaultFiles;
    }
  };

  config = generate(config, options);

  // any other custom stuff not supported by options here!
};
