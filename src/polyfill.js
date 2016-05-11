import supportsCaptureOption from './supportsCaptureOption';

if (!supportsCaptureOption) {
  const ETp = window.EventTarget ? window.EventTarget.prototype : window.Node.prototype;
  const originalAddEventListener = ETp.addEventListener;

  ETp.addEventListener = function() {
    if (arguments.length >= 3) {
      const options = arguments[2];
      if (options && typeof options === 'object') {
        arguments[2] = !!options.capture;
      }
    }
    originalAddEventListener.apply(this, arguments);
  };
  ETp.addEventListener.POLYFILLED_OPTIONS_SUPPORT = true;
}
