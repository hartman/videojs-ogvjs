import videojs from 'video.js';
import OGVCompat from 'OGVCompat';
import OGVLoader from 'OGVLoader';
import OGVPlayer from 'OGVPlayer';
const Tech = videojs.getComponent('Tech');

/**
 * Ogvjs Media Controller - Wrapper for Ogvjs Media API
 *
 * @param {Object=} options Object of option names and values
 * @param {Function=} ready Ready callback function
 * @extends Tech
 * @class Ogvjs
 */
class Ogvjs extends Tech {

  constructor(options, ready) {
    super(options, ready);

    // Set initial state of player
    this.el_.src = options.source.src;
    Ogvjs.setIfAvailable(this.el_, 'autoplay', options.autoplay);
    Ogvjs.setIfAvailable(this.el_, 'loop', options.loop);
    Ogvjs.setIfAvailable(this.el_, 'poster', options.poster);
    Ogvjs.setIfAvailable(this.el_, 'preload', options.preload);

    this.triggerReady();
  }

  /**
   * Dispose of Ogvjs media element
   *
   * @method dispose
   */
  dispose() {
    this.el_.removeEventListener('framecallback', this.onFrameUpdate);
    super.dispose();
  }

  /**
   * Create the component's DOM element
   *
   * @return {Element}
   * @method createEl
   */
  createEl() {
    const options = this.options_;

    if (options.base) {
      OGVLoader.base = options.base;
    } else {
      throw new Error('Please specify the base for the ogv.js library');
    }

    const el = new OGVPlayer(options);

    if (!el.hasOwnProperty('preload')) {
      // simulate timeupdate events for older ogv.js versions pre 1.1 versions
      // needed for subtitles. preload is only defined in 1.1 and later,
      this.lastTime = 0;
      el.addEventListener('framecallback', this.onFrameUpdate.bind(this));
    }

    el.className += ' vjs-tech';
    options.tag = el;

    return el;
  }

  onFrameUpdate(event) {
    const timeupdateInterval = 0.25;
    const now = this.el_ ? this.el_.currentTime : this.lastTime;

    // Don't spam time updates on every frame
    if (Math.abs(now - this.lastTime) >= timeupdateInterval) {
      this.lastTime = now;
      this.trigger('timeupdate');
      this.trigger('durationchange');
    }
  }

  /**
   * Play for Ogvjs tech
   *
   * @method play
   */
  play() {
    this.el_.play();
  }

  /**
   * Pause for Ogvjs tech
   *
   * @method pause
   */
  pause() {
    this.el_.pause();
  }

  /**
   * Paused for Ogvjs tech
   *
   * @return {boolean}
   * @method paused
   */
  paused() {
    return this.el_.paused;
  }

  /**
   * Get current time
   *
   * @return {number}
   * @method currentTime
   */
  currentTime() {
    return this.el_.currentTime;
  }

  /**
   * Set current time
   *
   * @param {number} seconds Current time of video
   * @method setCurrentTime
   */
  setCurrentTime(seconds) {
    try {
      this.el_.currentTime = seconds;
    } catch (e) {
      videojs.log(e, 'Video is not ready. (Video.js)');
    }
  }

  /**
   * Get duration
   *
   * @return {number}
   * @method duration
   */
  duration() {
    return this.el_.duration || 0;
  }

  /**
   * Get a TimeRange object that represents the intersection
   * of the time ranges for which the user agent has all
   * relevant media
   *
   * @return {TimeRangeObject}
   * @method buffered
   */
  buffered() {
    return this.el_.buffered;
  }

  /**
   * Get volume level
   *
   * @return {number}
   * @method volume
   */
  volume() {
    return this.el_.hasOwnProperty('volume') ? this.el_.volume : 1;
  }

  /**
   * Set volume level
   *
   * @param {number} percentAsDecimal Volume percent as a decimal
   * @method setVolume
   */
  setVolume(percentAsDecimal) {
    if (this.el_.hasOwnProperty('volume')) {
      this.el_.volume = percentAsDecimal;
    }
  }

  /**
   * Get if muted
   *
   * @return {boolean}
   * @method muted
   */
  muted() {
    return this.el_.muted;
  }

  /**
   * Set muted
   *
   * @param {boolean} If player is to be muted or note
   * @method setMuted
   */
  setMuted(muted) {
    this.el_.muted = !!muted;
  }

  /**
   * Get player width
   *
   * @return {number}
   * @method width
   */
  width() {
    return this.el_.offsetWidth;
  }

  /**
   * Get player height
   *
   * @return {number}
   * @method height
   */
  height() {
    return this.el_.offsetHeight;
  }

  /**
   * Get/set video
   *
   * @param {Object=} src Source object
   * @return {Object}
   * @method src
   */
  src(src) {
    if (typeof src === 'undefined') {
      return this.el_.src;
    }
    // Setting src through `src` instead of `setSrc` will be deprecated
    this.setSrc(src);
  }

  /**
   * Set video
   *
   * @param {Object} src Source object
   * @deprecated
   * @method setSrc
   */
  setSrc(src) {
    this.el_.src = src;
  }

  /**
   * Load media into player
   *
   * @method load
   */
  load() {
    this.el_.load();
  }

  /**
   * Get current source
   *
   * @return {Object}
   * @method currentSrc
   */
  currentSrc() {
    if (this.currentSource_) {
      return this.currentSource_.src;
    }
    return this.el_.currentSrc;
  }

  /**
   * Get poster
   *
   * @return {string}
   * @method poster
   */
  poster() {
    return this.el_.poster;
  }

  /**
   * Set poster
   *
   * @param {string} val URL to poster image
   * @method
   */
  setPoster(val) {
    this.el_.poster = val;
  }

  /**
   * Get preload attribute
   *
   * @return {string}
   * @method preload
   */
  preload() {
    return this.el_.preload || 'none';
  }

  /**
   * Set preload attribute
   *
   * @param {string} val Value for preload attribute
   * @method setPreload
   */
  setPreload(val) {
    if (this.el_.hasOwnProperty('preload')) {
      this.el_.preload = val;
    }
  }

  /**
   * Get autoplay attribute
   *
   * @return {boolean}
   * @method autoplay
   */
  autoplay() {
    return this.el_.autoplay || false;
  }

  /**
   * Set autoplay attribute
   *
   * @param {boolean} val Value for preload attribute
   * @method setAutoplay
   */
  setAutoplay(val) {
    if (this.el_.hasOwnProperty('autoplay')) {
      this.el_.autoplay = !!val;
      return;
    }
  }

  /**
   * Get controls attribute
   *
   * @return {boolean}
   * @method controls
   */
  controls() {
    return this.el_controls || false;
  }

  /**
   * Set controls attribute
   *
   * @param {boolean} val Value for controls attribute
   * @method setControls
   */
  setControls(val) {
    if (this.el_.hasOwnProperty('controls')) {
      this.el_.controls = !!val;
    }
  }

  /**
   * Get loop attribute
   *
   * @return {boolean}
   * @method loop
   */
  loop() {
    return this.el_.loop || false;
  }

  /**
   * Set loop attribute
   *
   * @param {boolean} val Value for loop attribute
   * @method setLoop
   */
  setLoop(val) {
    if (this.el_.hasOwnProperty('loop')) {
      this.el_.loop = !!val;
    }
  }

  /**
   * Get error value
   *
   * @return {string}
   * @method error
   */
  error() {
    return this.el_.error;
  }

  /**
   * Get whether or not the player is in the "seeking" state
   *
   * @return {boolean}
   * @method seeking
   */
  seeking() {
    return this.el_.seeking;
  }

  /**
   * Get a TimeRanges object that represents the
   * ranges of the media resource to which it is possible
   * for the user agent to seek.
   *
   * @return {TimeRangeObject}
   * @method seekable
   */
  seekable() {
    return this.el_.seekable;
  }

  /**
   * Get if video ended
   *
   * @return {boolean}
   * @method ended
   */
  ended() {
    return this.el_.ended;
  }

  /**
   * Get the value of the muted content attribute
   * This attribute has no dynamic effect, it only
   * controls the default state of the element
   *
   * @return {boolean}
   * @method defaultMuted
   */
  defaultMuted() {
    return this.el_.defaultMuted || false;
  }

  /**
   * Get desired speed at which the media resource is to play
   *
   * @return {number}
   * @method playbackRate
   */
  playbackRate() {
    return this.el_.playbackRate || 1;
  }

  /**
   * Returns a TimeRanges object that represents the ranges of the
   * media resource that the user agent has played.
   *
   * @return {TimeRangeObject} the range of points on the media
   * timeline that has been reached through normal playback
   * @see https://html.spec.whatwg.org/multipage/embedded-content.html#dom-media-played
   */
  played() {
    return this.el_.played;
  }

  /**
   * Set desired speed at which the media resource is to play
   *
   * @param {number} val Speed at which the media resource is to play
   * @method setPlaybackRate
   */
  setPlaybackRate(val) {
    if (this.el_.hasOwnProperty('playbackRate')) {
      this.el_.playbackRate = val;
    }
  }

  /**
   * Get the current state of network activity for the element, from
   * the list below
   * NETWORK_EMPTY (numeric value 0)
   * NETWORK_IDLE (numeric value 1)
   * NETWORK_LOADING (numeric value 2)
   * NETWORK_NO_SOURCE (numeric value 3)
   *
   * @return {number}
   * @method networkState
   */
  networkState() {
    return this.el_.networkState;
  }

  /**
   * Get a value that expresses the current state of the element
   * with respect to rendering the current playback position, from
   * the codes in the list below
   * HAVE_NOTHING (numeric value 0)
   * HAVE_METADATA (numeric value 1)
   * HAVE_CURRENT_DATA (numeric value 2)
   * HAVE_FUTURE_DATA (numeric value 3)
   * HAVE_ENOUGH_DATA (numeric value 4)
   *
   * @return {number}
   * @method readyState
   */
  readyState() {
    return this.el_.readyState;
  }

  /**
   * Get width of video
   *
   * @return {number}
   * @method videoWidth
   */
  videoWidth() {
    return this.el_.videoWidth;
  }

  /**
   * Get height of video
   *
   * @return {number}
   * @method videoHeight
   */
  videoHeight() {
    return this.el_.videoHeight;
  }

  /**
   * The technology has no native fullscreen
   * This is important on iOS, where we have to fallback to
   * fullWindow mode due to lack of HTML5 fullscreen api
   */
  supportsFullScreen() {
    return false;
  }

}

/*
 * Only set a value on an element if it has that property
 *
 * @param {Element} el
 * @param {string} name
 * @param value
 */
Ogvjs.setIfAvailable = function(el, name, value) {
  if (el.hasOwnProperty(name)) {
    el[name] = value;
  }
};

/*
 * Check if Ogvjs video is supported by this browser/device
 *
 * @return {boolean}
 */
Ogvjs.isSupported = function() {
  return OGVCompat.supported('OGVPlayer');
};

/*
 * Determine if the specified media type can be played back
 * by the Tech
 *
 * @param  {string} type  A media type description
 * @return {string}         'probably', 'maybe', or '' (empty string)
 */
Ogvjs.canPlayType = function(type) {
  const p = new OGVPlayer();

  return p.canPlayType(type);
};

/*
 * Check if the tech can support the given source
 * @param  {Object} srcObj  The source object
 * @return {string}         'probably', 'maybe', or '' (empty string)
 */
Ogvjs.canPlaySource = function(srcObj) {
  return Ogvjs.canPlayType(srcObj.type);
};

/*
 * Check if the volume can be changed in this browser/device.
 * Volume cannot be changed in a lot of mobile devices.
 * Specifically, it can't be changed from 1 on iOS.
 *
 * @return {boolean}
 */
Ogvjs.canControlVolume = function() {
  const p = new OGVPlayer();

  return p.hasOwnProperty('volume');
};

/*
 * Check if playbackRate is supported in this browser/device.
 *
 * @return {number} [description]
 */
Ogvjs.canControlPlaybackRate = function() {
  return false;
};

/*
 * Check to see if native text tracks are supported by this browser/device
 *
 * @return {boolean}
 */
Ogvjs.supportsNativeTextTracks = function() {
  return false;
};

/**
 * An array of events available on the Ogvjs tech.
 *
 * @private
 * @type {Array}
 */
Ogvjs.Events = [
  'loadstart',
  'suspend',
  'abort',
  'error',
  'emptied',
  'stalled',
  'loadedmetadata',
  'loadeddata',
  'canplay',
  'canplaythrough',
  'playing',
  'waiting',
  'seeking',
  'seeked',
  'ended',
  'durationchange',
  'timeupdate',
  'progress',
  'play',
  'pause',
  'ratechange',
  'volumechange'
];

/*
 * Set the tech's volume control support status
 *
 * @type {boolean}
 */
Ogvjs.prototype.featuresVolumeControl = Ogvjs.canControlVolume();

/*
 * Set the tech's playbackRate support status
 *
 * @type {boolean}
 */
Ogvjs.prototype.featuresPlaybackRate = Ogvjs.canControlPlaybackRate();

/*
 * Set the the tech's fullscreen resize support status.
 * HTML video is able to automatically resize when going to fullscreen.
 * (No longer appears to be used. Can probably be removed.)
 */
Ogvjs.prototype.featuresFullscreenResize = true;

/*
 * Set the tech's progress event support status
 * (this disables the manual progress events of the Tech)
 */
Ogvjs.prototype.featuresProgressEvents = true;

/*
 * Sets the tech's status on native text track support
 *
 * @type {boolean}
 */
Ogvjs.prototype.featuresNativeTextTracks = Ogvjs.supportsNativeTextTracks();

Tech.registerTech('Ogvjs', Ogvjs);
export default Ogvjs;

