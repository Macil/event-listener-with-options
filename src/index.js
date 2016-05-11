import supportsCaptureOption from './supportsCaptureOption';

export type Options = {
  capture?: ?boolean;
  passive?: ?boolean;
};

export default function addEventListenerWithOptions(target: EventTarget, type: string, handler: EventListener, options?: Options|boolean, wantsUntrusted?: boolean) {
  const optionsOrCapture = (supportsCaptureOption || !options || typeof options !== 'object') ?
    options : !!options.capture;
  target.addEventListener(type, handler, optionsOrCapture, wantsUntrusted);
}
