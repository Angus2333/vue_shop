"use strict";

exports.__esModule = true;
exports.callInterceptor = callInterceptor;

var _ = require(".");

function callInterceptor(options) {
  var interceptor = options.interceptor,
      args = options.args,
      done = options.done,
      canceled = options.canceled;

  if (interceptor) {
    // eslint-disable-next-line prefer-spread
    var returnVal = interceptor.apply(null, args || []);

    if ((0, _.isPromise)(returnVal)) {
      returnVal.then(function (value) {
        if (value) {
          done();
        } else if (canceled) {
          canceled();
        }
      }).catch(_.noop);
    } else if (returnVal) {
      done();
    } else if (canceled) {
      canceled();
    }
  } else {
    done();
  }
}