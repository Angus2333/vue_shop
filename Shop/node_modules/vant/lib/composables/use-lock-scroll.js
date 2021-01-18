"use strict";

exports.__esModule = true;
exports.useLockScroll = useLockScroll;

var _use = require("@vant/use");

var _useTouch = require("./use-touch");

var _utils = require("../utils");

var totalLockCount = 0;
var BODY_LOCK_CLASS = 'van-overflow-hidden';

function useLockScroll(rootRef, shouldLock) {
  var touch = (0, _useTouch.useTouch)();

  var onTouchMove = function onTouchMove(event) {
    touch.move(event);
    var direction = touch.deltaY.value > 0 ? '10' : '01';
    var el = (0, _use.getScrollParent)(event.target, rootRef.value);
    var scrollHeight = el.scrollHeight,
        offsetHeight = el.offsetHeight,
        scrollTop = el.scrollTop;
    var status = '11';

    if (scrollTop === 0) {
      status = offsetHeight >= scrollHeight ? '00' : '01';
    } else if (scrollTop + offsetHeight >= scrollHeight) {
      status = '10';
    }

    if (status !== '11' && touch.isVertical() && !(parseInt(status, 2) & parseInt(direction, 2))) {
      (0, _utils.preventDefault)(event, true);
    }
  };

  var lock = function lock() {
    if (shouldLock()) {
      document.addEventListener('touchstart', touch.start);
      document.addEventListener('touchmove', onTouchMove, _use.supportsPassive ? {
        passive: false
      } : false);

      if (!totalLockCount) {
        document.body.classList.add(BODY_LOCK_CLASS);
      }

      totalLockCount++;
    }
  };

  var unlock = function unlock() {
    if (shouldLock() && totalLockCount) {
      document.removeEventListener('touchstart', touch.start);
      document.removeEventListener('touchmove', onTouchMove);
      totalLockCount--;

      if (!totalLockCount) {
        document.body.classList.remove(BODY_LOCK_CLASS);
      }
    }
  };

  return [lock, unlock];
}