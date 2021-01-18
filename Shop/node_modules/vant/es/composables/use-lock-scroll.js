import { getScrollParent, supportsPassive } from '@vant/use';
import { useTouch } from './use-touch';
import { preventDefault } from '../utils';
var totalLockCount = 0;
var BODY_LOCK_CLASS = 'van-overflow-hidden';
export function useLockScroll(rootRef, shouldLock) {
  var touch = useTouch();

  var onTouchMove = function onTouchMove(event) {
    touch.move(event);
    var direction = touch.deltaY.value > 0 ? '10' : '01';
    var el = getScrollParent(event.target, rootRef.value);
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
      preventDefault(event, true);
    }
  };

  var lock = function lock() {
    if (shouldLock()) {
      document.addEventListener('touchstart', touch.start);
      document.addEventListener('touchmove', onTouchMove, supportsPassive ? {
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