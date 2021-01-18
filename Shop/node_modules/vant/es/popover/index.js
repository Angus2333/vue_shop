import { mergeProps as _mergeProps } from "vue";
import { Fragment as _Fragment } from "vue";
import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { createPopper, offsetModifier } from '@vant/popperjs'; // Utils

import { createNamespace } from '../utils';
import { BORDER_BOTTOM } from '../utils/constant'; // Composition

import { useClickAway } from '@vant/use'; // Components

import Icon from '../icon';
import Popup from '../popup';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('popover'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    show: Boolean,
    overlay: Boolean,
    offset: {
      type: Array,
      default: function _default() {
        return [0, 8];
      }
    },
    theme: {
      type: String,
      default: 'light'
    },
    trigger: {
      type: String,
      default: 'click'
    },
    actions: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    teleport: {
      type: [String, Object],
      default: 'body'
    },
    closeOnClickAction: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select', 'touchstart', 'update:show'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots,
        attrs = _ref.attrs;
    var popper;
    var wrapperRef = ref();
    var popoverRef = ref();

    var createPopperInstance = function createPopperInstance() {
      return createPopper(wrapperRef.value, popoverRef.value.popupRef.value, {
        placement: props.placement,
        modifiers: [{
          name: 'computeStyles',
          options: {
            adaptive: false,
            gpuAcceleration: false
          }
        }, _extends({}, offsetModifier, {
          options: {
            offset: props.offset
          }
        })]
      });
    };

    var updateLocation = function updateLocation() {
      nextTick(function () {
        if (!props.show) {
          return;
        }

        if (!popper) {
          popper = createPopperInstance();
        } else {
          popper.setOptions({
            placement: props.placement
          });
        }
      });
    };

    var toggle = function toggle(value) {
      emit('update:show', value);
    };

    var onClickWrapper = function onClickWrapper() {
      if (props.trigger === 'click') {
        toggle(!props.show);
      }
    };

    var onTouchstart = function onTouchstart(event) {
      event.stopPropagation();
      emit('touchstart', event);
    };

    var onClickAction = function onClickAction(action, index) {
      if (action.disabled) {
        return;
      }

      emit('select', action, index);

      if (props.closeOnClickAction) {
        toggle(false);
      }
    };

    var onClickAway = function onClickAway() {
      toggle(false);
    };

    var renderAction = function renderAction(action, index) {
      var icon = action.icon,
          text = action.text,
          disabled = action.disabled,
          className = action.className;
      return _createVNode("div", {
        "role": "menuitem",
        "class": [bem('action', {
          disabled: disabled,
          'with-icon': icon
        }), className],
        "onClick": function onClick() {
          return onClickAction(action, index);
        }
      }, [icon && _createVNode(Icon, {
        "name": icon,
        "class": bem('action-icon')
      }, null), _createVNode("div", {
        "class": [bem('action-text'), BORDER_BOTTOM]
      }, _isSlot(text) ? text : {
        default: function _default() {
          return [text];
        }
      })]);
    };

    onMounted(updateLocation);
    onBeforeUnmount(function () {
      if (popper) {
        popper.destroy();
        popper = null;
      }
    });
    watch([function () {
      return props.show;
    }, function () {
      return props.placement;
    }], updateLocation);
    useClickAway(wrapperRef, onClickAway, {
      eventName: 'touchstart'
    });
    return function () {
      return _createVNode(_Fragment, null, [_createVNode("span", {
        "ref": wrapperRef,
        "class": bem('wrapper'),
        "onClick": onClickWrapper
      }, [slots.reference == null ? void 0 : slots.reference()]), _createVNode(Popup, _mergeProps({
        "ref": popoverRef,
        "show": props.show,
        "class": bem([props.theme]),
        "overlay": props.overlay,
        "position": null,
        "teleport": props.teleport,
        "transition": "van-popover-zoom",
        "lockScroll": false,
        "onTouchstart": onTouchstart
      }, _extends({}, attrs, {
        'onUpdate:show': toggle
      })), {
        default: function _default() {
          return [_createVNode("div", {
            "class": bem('arrow')
          }, null), _createVNode("div", {
            "role": "menu",
            "class": bem('content')
          }, [slots.default ? slots.default() : props.actions.map(renderAction)])];
        }
      })]);
    };
  }
});