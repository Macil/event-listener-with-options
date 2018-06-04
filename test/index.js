/* @flow */

import assert from 'assert';
import sinon from 'sinon';

function thrower() {
  throw new Error('should not happen');
}

function setupOld() {
  global.window = {
    get addEventListener() {
      return window.EventTarget.prototype.addEventListener;
    },
    get removeEventListener() {
      return window.EventTarget.prototype.removeEventListener;
    },
    EventTarget: {
      prototype: {
        addEventListener: sinon.spy(),
        removeEventListener: sinon.spy()
      }
    }
  };
}

function setupNew() {
  global.window = {
    get addEventListener() {
      return window.EventTarget.prototype.addEventListener;
    },
    get removeEventListener() {
      return window.EventTarget.prototype.removeEventListener;
    },
    EventTarget: {
      prototype: {
        addEventListener: sinon.spy(function(type, handler, options) {
          if (options) {
            options.capture;
          }
        }),
        removeEventListener: sinon.spy()
      }
    }
  };
}

global.window = null;
beforeEach(function() {
  global.window = null;
  delete require.cache[require.resolve('../src')];
  delete require.cache[require.resolve('../src/supportsCaptureOption')];
  delete require.cache[require.resolve('../src/polyfill')];
});

describe('addEventListenerWithOptions', function() {
  it('works with browser support', function() {
    setupNew();
    const originalAddEventListener = window.EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = window.EventTarget.prototype.removeEventListener;
    const {addEventListener, removeEventListener} = require('../src');
    assert.strictEqual(originalAddEventListener.callCount, 0);
    assert.strictEqual(originalRemoveEventListener.callCount, 0);
    assert.strictEqual(window.EventTarget.prototype.addEventListener, originalAddEventListener);

    function attempt(args: any[]) {
      const expectedArgs = [...args, undefined, undefined].slice(1, 5);

      addEventListener(...args);
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, args[0]);
      assert.deepEqual(call.args, expectedArgs);

      removeEventListener(...args);
      const rcall = originalRemoveEventListener.lastCall;
      assert.strictEqual(rcall.thisValue, args[0]);
      assert.deepEqual(rcall.args, expectedArgs.slice(0, 3));
    }

    attempt([window, 'objtest', thrower, {capture: true}]);
    attempt([window, 'objtest', thrower]);
    attempt([window, 'objtest', thrower, {capture: true, passive: true}, true]);
  });

  it('works without browser support', function() {
    setupOld();
    const originalAddEventListener = window.EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = window.EventTarget.prototype.removeEventListener;
    const {addEventListener, removeEventListener} = require('../src');
    assert.strictEqual(originalAddEventListener.callCount, 0);
    assert.strictEqual(originalRemoveEventListener.callCount, 0);
    assert.strictEqual(window.EventTarget.prototype.addEventListener, originalAddEventListener);

    function attempt(args: any[], expectedArgs: any[]) {
      expectedArgs = [...expectedArgs, undefined, undefined].slice(0, 4);

      addEventListener(...args);
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, args[0]);
      assert.deepEqual(call.args, expectedArgs);

      removeEventListener(...args.slice(0, 4));
      const rcall = originalRemoveEventListener.lastCall;
      assert.strictEqual(rcall.thisValue, args[0]);
      assert.deepEqual(rcall.args, expectedArgs.slice(0, 3));
    }

    attempt(
      [window, 'objtest', thrower, {capture: true}],
      ['objtest', thrower, true]
    );
    attempt(
      [window, 'objtest', thrower, {capture: false}],
      ['objtest', thrower, false]
    );
    attempt(
      [window, 'objtest', thrower, {}],
      ['objtest', thrower, false]
    );
    attempt(
      [window, 'objtest', thrower, true],
      ['objtest', thrower, true]
    );
    attempt(
      [window, 'objtest', thrower, false],
      ['objtest', thrower, false]
    );
    attempt(
      [window, 'objtest', thrower],
      ['objtest', thrower]
    );
    attempt(
      [window, 'objtest', thrower, {capture: true, passive: true}, true],
      ['objtest', thrower, true, true]
    );
  });
});

describe('polyfill', function() {
  it("doesn't replace if unnecessary", function() {
    setupNew();
    const originalAddEventListener = window.EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = window.EventTarget.prototype.removeEventListener;
    require('../src/polyfill');
    assert.strictEqual(originalAddEventListener.callCount, 1);
    assert.strictEqual(originalRemoveEventListener.callCount, 0);
    assert.strictEqual(window.EventTarget.prototype.addEventListener, originalAddEventListener);
    assert.strictEqual(window.EventTarget.prototype.removeEventListener, originalRemoveEventListener);
    assert.strictEqual(window.EventTarget.prototype.addEventListener.POLYFILLED_OPTIONS_SUPPORT, undefined);
    assert.strictEqual(window.EventTarget.prototype.removeEventListener.POLYFILLED_OPTIONS_SUPPORT, undefined);
  });

  it('works without browser support', function() {
    setupOld();
    const originalAddEventListener = window.EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = window.EventTarget.prototype.removeEventListener;
    require('../src/polyfill');
    assert.strictEqual(originalAddEventListener.callCount, 1);
    assert.strictEqual(originalRemoveEventListener.callCount, 0);
    assert.notStrictEqual(window.EventTarget.prototype.addEventListener, originalAddEventListener);
    assert.notStrictEqual(window.EventTarget.prototype.removeEventListener, originalRemoveEventListener);
    assert.strictEqual(window.EventTarget.prototype.addEventListener.POLYFILLED_OPTIONS_SUPPORT, true);
    assert.strictEqual(window.EventTarget.prototype.removeEventListener.POLYFILLED_OPTIONS_SUPPORT, true);

    function attempt(args: any[], expectedArgs: any[]) {
      args[0].addEventListener(...args.slice(1));
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, args[0]);
      assert.deepEqual(call.args, expectedArgs);

      args[0].removeEventListener(...args.slice(1, 4));
      const rcall = originalRemoveEventListener.lastCall;
      assert.strictEqual(rcall.thisValue, args[0]);
      assert.deepEqual(rcall.args, expectedArgs.slice(0, 3));
    }

    attempt(
      [window, 'objtest', thrower, {capture: true}],
      ['objtest', thrower, true]
    );
    attempt(
      [window, 'objtest', thrower, {capture: false}],
      ['objtest', thrower, false]
    );
    attempt(
      [window, 'objtest', thrower, {}],
      ['objtest', thrower, false]
    );
    attempt(
      [window, 'objtest', thrower, true],
      ['objtest', thrower, true]
    );
    attempt(
      [window, 'objtest', thrower, false],
      ['objtest', thrower, false]
    );
    attempt(
      [window, 'objtest', thrower],
      ['objtest', thrower]
    );
    attempt(
      [window, 'objtest', thrower, {capture: true, passive: true}, true],
      ['objtest', thrower, true, true]
    );
  });
});
