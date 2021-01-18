import { isPromise, noop } from '.';
export function callInterceptor(options) {
  var interceptor = options.interceptor,
      args = options.args,
      done = options.done,
      canceled = options.canceled;

  if (interceptor) {
    // eslint-disable-next-line prefer-spread
    var returnVal = interceptor.apply(null, args || []);

    if (isPromise(returnVal)) {
      returnVal.then(function (value) {
        if (value) {
          done();
        } else if (canceled) {
          canceled();
        }
      }).catch(noop);
    } else if (returnVal) {
      done();
    } else if (canceled) {
      canceled();
    }
  } else {
    done();
  }
}