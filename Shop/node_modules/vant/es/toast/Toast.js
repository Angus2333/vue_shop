import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import { watch, onMounted, onUnmounted } from 'vue'; // Utils

import { createNamespace, isDef } from '../utils';
import { lockClick } from './lock-click'; // Components

import Icon from '../icon';
import Popup from '../popup';
import Loading from '../loading';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('toast'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    icon: String,
    show: Boolean,
    message: [Number, String],
    duration: Number,
    className: null,
    iconPrefix: String,
    lockScroll: Boolean,
    loadingType: String,
    forbidClick: Boolean,
    closeOnClick: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    position: {
      type: String,
      default: 'middle'
    },
    transition: {
      type: String,
      default: 'van-fade'
    }
  },
  emits: ['update:show'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit;
    var timer;
    var clickable = false;

    var toggleClickable = function toggleClickable() {
      var newValue = props.show && props.forbidClick;

      if (clickable !== newValue) {
        clickable = newValue;
        lockClick(clickable);
      }
    };

    var onClick = function onClick() {
      if (props.closeOnClick) {
        emit('update:show', false);
      }
    };

    var clearTimer = function clearTimer() {
      clearTimeout(timer);
    };

    var renderIcon = function renderIcon() {
      var icon = props.icon,
          type = props.type,
          iconPrefix = props.iconPrefix,
          loadingType = props.loadingType;
      var hasIcon = icon || type === 'success' || type === 'fail';

      if (hasIcon) {
        return _createVNode(Icon, {
          "name": icon || type,
          "class": bem('icon'),
          "classPrefix": iconPrefix
        }, null);
      }

      if (type === 'loading') {
        return _createVNode(Loading, {
          "class": bem('loading'),
          "type": loadingType
        }, null);
      }
    };

    var renderMessage = function renderMessage() {
      var type = props.type,
          message = props.message;

      if (isDef(message) && message !== '') {
        return type === 'html' ? _createVNode("div", {
          "class": bem('text'),
          "innerHTML": message
        }, null) : _createVNode("div", {
          "class": bem('text')
        }, _isSlot(message) ? message : {
          default: function _default() {
            return [message];
          }
        });
      }
    };

    watch([function () {
      return props.show;
    }, function () {
      return props.forbidClick;
    }], toggleClickable);
    watch([function () {
      return props.show;
    }, function () {
      return props.duration;
    }], function () {
      clearTimer();

      if (props.show && props.duration > 0) {
        timer = setTimeout(function () {
          emit('update:show', false);
        }, props.duration);
      }
    });
    onMounted(toggleClickable);
    onUnmounted(toggleClickable);
    return function () {
      var _ref2;

      return _createVNode(Popup, {
        "show": props.show,
        "class": [bem([props.position, (_ref2 = {}, _ref2[props.type] = !props.icon, _ref2)]), props.className],
        "lockScroll": false,
        "transition": props.transition,
        "onClick": onClick,
        "onClosed": clearTimer
      }, {
        default: function _default() {
          return [renderIcon(), renderMessage()];
        }
      });
    };
  }
});