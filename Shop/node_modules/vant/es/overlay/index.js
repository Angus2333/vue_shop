import { isVNode as _isVNode } from "vue";
import { withDirectives as _withDirectives } from "vue";
import { createVNode as _createVNode } from "vue";
import { vShow as _vShow } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { Transition } from 'vue';
import { noop, isDef, preventDefault, createNamespace } from '../utils';
import { useLazyRender } from '../composables/use-lazy-render';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('overlay'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    show: Boolean,
    zIndex: [Number, String],
    duration: [Number, String],
    className: null,
    customStyle: Object,
    lockScroll: {
      type: Boolean,
      default: true
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var lazyRender = useLazyRender(function () {
      return props.show;
    });

    var preventTouchMove = function preventTouchMove(event) {
      preventDefault(event, true);
    };

    var renderOverlay = lazyRender(function () {
      var style = _extends({
        zIndex: props.zIndex !== undefined ? +props.zIndex : undefined
      }, props.customStyle);

      if (isDef(props.duration)) {
        style.animationDuration = props.duration + "s";
      }

      return _withDirectives(_createVNode("div", {
        "style": style,
        "class": [bem(), props.className],
        "onTouchmove": props.lockScroll ? preventTouchMove : noop
      }, [slots.default == null ? void 0 : slots.default()]), [[_vShow, props.show]]);
    });
    return function () {
      var _slot;

      return _createVNode(Transition, {
        "name": "van-fade"
      }, _isSlot(_slot = renderOverlay()) ? _slot : {
        default: function _default() {
          return [_slot];
        }
      });
    };
  }
});