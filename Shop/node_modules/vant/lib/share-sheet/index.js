"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _popup = _interopRequireWildcard(require("../popup"));

// Utils
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var PRESET_ICONS = ['qq', 'link', 'weibo', 'wechat', 'poster', 'qrcode', 'weapp-qrcode'];

function getIconURL(icon) {
  if (PRESET_ICONS.indexOf(icon) !== -1) {
    return "https://img.yzcdn.cn/vant/share-icon-" + icon + ".png";
  }

  return icon;
}

var _createNamespace = (0, _utils.createNamespace)('share-sheet'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var _default2 = createComponent({
  props: (0, _extends2.default)({}, _popup.popupSharedProps, {
    title: String,
    cancelText: String,
    description: String,
    options: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    closeOnPopstate: {
      type: Boolean,
      default: true
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: true
    }
  }),
  emits: ['cancel', 'select', 'update:show'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var toggle = function toggle(value) {
      emit('update:show', value);
    };

    var onCancel = function onCancel() {
      toggle(false);
      emit('cancel');
    };

    var onSelect = function onSelect(option, index) {
      emit('select', option, index);
    };

    var renderHeader = function renderHeader() {
      var title = slots.title ? slots.title() : props.title;
      var description = slots.description ? slots.description() : props.description;

      if (title || description) {
        return (0, _vue.createVNode)("div", {
          "class": bem('header')
        }, [title && (0, _vue.createVNode)("h2", {
          "class": bem('title')
        }, _isSlot(title) ? title : {
          default: function _default() {
            return [title];
          }
        }), description && (0, _vue.createVNode)("span", {
          "class": bem('description')
        }, _isSlot(description) ? description : {
          default: function _default() {
            return [description];
          }
        })]);
      }
    };

    var renderOption = function renderOption(option, index) {
      var name = option.name,
          icon = option.icon,
          className = option.className,
          description = option.description;
      return (0, _vue.createVNode)("div", {
        "role": "button",
        "tabindex": "0",
        "class": [bem('option'), className],
        "onClick": function onClick() {
          onSelect(option, index);
        }
      }, [(0, _vue.createVNode)("img", {
        "src": getIconURL(icon),
        "class": bem('icon')
      }, null), name && (0, _vue.createVNode)("span", {
        "class": bem('name')
      }, _isSlot(name) ? name : {
        default: function _default() {
          return [name];
        }
      }), description && (0, _vue.createVNode)("span", {
        "class": bem('option-description')
      }, _isSlot(description) ? description : {
        default: function _default() {
          return [description];
        }
      })]);
    };

    var renderOptions = function renderOptions(options, border) {
      return (0, _vue.createVNode)("div", {
        "class": bem('options', {
          border: border
        })
      }, [options.map(renderOption)]);
    };

    var renderRows = function renderRows() {
      var options = props.options;

      if (Array.isArray(options[0])) {
        return options.map(function (item, index) {
          return renderOptions(item, index !== 0);
        });
      }

      return renderOptions(options);
    };

    var renderCancelText = function renderCancelText() {
      var _props$cancelText;

      var text = (_props$cancelText = props.cancelText) != null ? _props$cancelText : t('cancel');

      if (text) {
        return (0, _vue.createVNode)("button", {
          "type": "button",
          "class": bem('cancel'),
          "onClick": onCancel
        }, _isSlot(text) ? text : {
          default: function _default() {
            return [text];
          }
        });
      }
    };

    return function () {
      return (0, _vue.createVNode)(_popup.default, (0, _vue.mergeProps)({
        "round": true,
        "class": bem(),
        "position": "bottom"
      }, (0, _extends2.default)({}, (0, _utils.pick)(props, ['show', 'overlay', 'duration', 'teleport', 'lazyRender', 'lockScroll', 'closeOnPopstate', 'closeOnClickOverlay', 'safeAreaInsetBottom']), {
        'onUpdate:show': toggle
      })), {
        default: function _default() {
          return [renderHeader(), renderRows(), renderCancelText()];
        }
      });
    };
  }
});

exports.default = _default2;