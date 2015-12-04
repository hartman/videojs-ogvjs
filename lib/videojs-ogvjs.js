/*! videojs-ogvjs - v0.0.0 - 2015-12-4
 * Copyright (c) 2015 Derk-Jan Hartman
 * Licensed under the Apache-2.0 license. */
(function(window, videojs) {
  'use strict';

  var defaults = {
        option: true
      },
      ogvjs;

  /**
   * Initialize the plugin.
   * @param options (optional) {object} configuration for the plugin
   */
  ogvjs = function(options) {
    var settings = videojs.util.mergeOptions(defaults, options),
        player = this;

    // TODO: write some amazing plugin code
  };

  // register the plugin
  videojs.plugin('ogvjs', ogvjs);
})(window, window.videojs);
