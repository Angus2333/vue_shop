"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _lockClick = require("./lock-click");

var _icon = _interopRequireDefault(require("../icon"));

var _popup = _interopRequireDefault(require("../popup"));

var _loading = _interopRequireDefault(require("../loading"));

// Utils
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('toast'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
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
        (0, _lockClick.lockClick)(clickable);
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
        return (0, _vue.createVNode)(_icon.default, {
          "name": icon || type,
          "class": bem('icon'),
          "classPrefix": iconPrefix
        }, null);
      }

      if (type === 'loading') {
        return (0, _vue.createVNode)(_loading.default, {
          "class": bem('loading'),
          "type": loadingType
        }, null);
      }
    };

    var renderMessage = function renderMessage() {
      var type = props.type,
          message = props.message;

      if ((0, _utils.isDef)(message) && message !== '') {
        return type === 'html' ? (0, _vue.createVNode)("div", {
          "class": bem('text'),
          "innerHTML": message
        }, null) : (0, _vue.createVNode)("div", {
          "class": bem('text')
        }, _isSlot(message) ? message : {
          default: function _default() {
            return [message];
          }
        });
      }
    };

    (0, _vue.watch)([function () {
      return props.show;
    }, function () {
      return props.forbidClick;
    }], toggleClickable);
    (0, _vue.watch)([function () {
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
    (0, _vue.onMounted)(toggleClickable);
    (0, _vue.onUnmounted)(toggleClickable);
    return function () {
      var _ref2;

      return (0, _vue.createVNode)(_popup.default, {
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

exports.default = _default2;