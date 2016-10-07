import document from 'global/document';

import QUnit from 'qunit';
import sinon from 'sinon';
import videojs from 'video.js';

import plugin from '../src/plugin';

// const Player = videojs.getComponent('Player');

QUnit.test('the environment is sane', function(assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
  assert.strictEqual(typeof videojs, 'function', 'videojs exists');
  assert.strictEqual(typeof plugin, 'function', 'plugin is a function');
});

QUnit.module('videojs-ogvjs', {

  beforeEach() {

    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5. This MUST come
    // before any player is created; otherwise, timers could get created
    // with the actual timer methods!
    this.clock = sinon.useFakeTimers();

    this.fixture = document.getElementById('qunit-fixture');
    this.video = document.createElement('video');
    this.source = document.createElement('source');
    this.source.setAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/9/94/Folgers.ogv');
    this.source.setAttribute('type', 'video/ogg');
    this.video.appendChild(this.source);
    this.fixture.appendChild(this.video);
    this.player = videojs(this.video, {
      techOrder: [ 'ogvjs' ],
      ogvjs: { base: './node_modules/ogv/dist' }
    });
  },

  afterEach() {
    this.player.dispose();
    this.clock.restore();
  }
});

QUnit.test('registers itself with video.js', function(assert) {
  assert.expect(3);

  // this.player.test();

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  assert.ok(
    typeof videojs.getTech('Ogvjs'),
    'function',
    'videojs-ogvjs plugin is a function'
  );

  assert.ok(
    videojs.hasClass(
      this.player.tech({ IWillNotUseThisInPlugins: true}).el(),
      'vjs-tech'
    ),
    'the plugin adds a class to the player'
  );

  assert.ok(
    this.player.tech({ IWillNotUseThisInPlugins: true}).el().tagName === 'OGVJS',
    'the plugin adds an ogvjs element'
  );
});
