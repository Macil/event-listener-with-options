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
    EventTarget: {
      prototype: {
        addEventListener: sinon.spy()
      }
    }
  };
}

function setupNew() {
  global.window = {
    get addEventListener() {
      return window.EventTarget.prototype.addEventListener;
    },
    EventTarget: {
      prototype: {
        addEventListener: sinon.spy(function(type, handler, options) {
          if (options) {
            options.capture;
          }
        })
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
    const addEventListenerWithOptions = require('../src');
    assert.strictEqual(originalAddEventListener.callCount, 1);
    assert.strictEqual(window.EventTarget.prototype.addEventListener, originalAddEventListener);

    {
      addEventListenerWithOptions(window, 'objtest', thrower, {capture: true});
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower, {capture: true}, undefined]);
    }

    {
      addEventListenerWithOptions(window, 'objtest', thrower);
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower, undefined, undefined]);
    }

    {
      addEventListenerWithOptions(window, 'objtest', thrower, {capture: true, passive: true}, true);
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower, {capture: true, passive: true}, true]);
    }
  });

  it('works without browser support', function() {
    setupOld();
    const originalAddEventListener = window.EventTarget.prototype.addEventListener;
    const addEventListenerWithOptions = require('../src');
    assert.strictEqual(originalAddEventListener.callCount, 1);
    assert.strictEqual(window.EventTarget.prototype.addEventListener, originalAddEventListener);

    {
      addEventListenerWithOptions(window, 'objtest', thrower, {capture: true});
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower, true, undefined]);
    }

    {
      addEventListenerWithOptions(window, 'objtest', thrower, {capture: false});
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower, false, undefined]);
    }

    {
      addEventListenerWithOptions(window, 'objtest', thrower, {});
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower, false, undefined]);
    }

    {
      addEventListenerWithOptions(window, 'objtest', thrower, true);
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower, true, undefined]);
    }

    {
      addEventListenerWithOptions(window, 'objtest', thrower, false);
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower, false, undefined]);
    }

    {
      addEventListenerWithOptions(window, 'objtest', thrower);
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower, undefined, undefined]);
    }

    {
      addEventListenerWithOptions(window, 'objtest', thrower, {capture: true, passive: true}, true);
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower, true, true]);
    }
  });
});

describe('polyfill', function() {
  it("doesn't replace if unnecessary", function() {
    setupNew();
    const originalAddEventListener = window.EventTarget.prototype.addEventListener;
    require('../src/polyfill');
    assert.strictEqual(originalAddEventListener.callCount, 1);
    assert.strictEqual(window.EventTarget.prototype.addEventListener, originalAddEventListener);
    assert.strictEqual(window.EventTarget.prototype.addEventListener.POLYFILLED_OPTIONS_SUPPORT, undefined);
  });

  it('works without browser support', function() {
    setupOld();
    const originalAddEventListener = window.EventTarget.prototype.addEventListener;
    require('../src/polyfill');
    assert.strictEqual(originalAddEventListener.callCount, 1);
    assert.notStrictEqual(window.EventTarget.prototype.addEventListener, originalAddEventListener);
    assert.strictEqual(window.EventTarget.prototype.addEventListener.POLYFILLED_OPTIONS_SUPPORT, true);

    {
      window.addEventListener('objtest', thrower, {capture: true});
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower, true]);
    }

    {
      window.addEventListener('objtest', thrower, {capture: false});
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower, false]);
    }

    {
      window.addEventListener('objtest', thrower, {});
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower, false]);
    }

    {
      window.addEventListener('objtest', thrower, true);
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower, true]);
    }

    {
      window.addEventListener('objtest', thrower, false);
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower, false]);
    }

    {
      window.addEventListener('objtest', thrower);
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower]);
    }

    {
      window.addEventListener('objtest', thrower, {capture: true, passive: true}, true);
      const call = originalAddEventListener.lastCall;
      assert.strictEqual(call.thisValue, window);
      assert.deepEqual(call.args, ['objtest', thrower, true, true]);
    }
  });
});
