"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _icon = _interopRequireDefault(require("../icon"));

var _popup = _interopRequireWildcard(require("../popup"));

var _loading = _interopRequireDefault(require("../loading"));

// Utils
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('action-sheet'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: (0, _extends2.default)({}, _popup.popupSharedProps, {
    title: String,
    actions: Array,
    cancelText: String,
    description: String,
    closeOnPopstate: Boolean,
    closeOnClickAction: Boolean,
    round: {
      type: Boolean,
      default: true
    },
    closeable: {
      type: Boolean,
      default: true
    },
    closeIcon: {
      type: String,
      default: 'cross'
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: true
    }
  }),
  emits: ['select', 'cancel', 'update:show'],
  setup: function setup(props, _ref) {
    var slots = _ref.slots,
        emit = _ref.emit;
    var popupPropKeys = Object.keys(_popup.popupSharedProps);

    var onUpdateShow = function onUpdateShow(show) {
      emit('update:show', show);
    };

    var onCancel = function onCancel() {
      onUpdateShow(false);
      emit('cancel');
    };

    var renderHeader = function renderHeader() {
      if (props.title) {
        return (0, _vue.createVNode)("div", {
          "class": bem('header')
        }, [props.title, props.closeable && (0, _vue.createVNode)(_icon.default, {
          "name": props.closeIcon,
          "class": bem('close'),
          "onClick": onCancel
        }, null)]);
      }
    };

    var renderCancel = function renderCancel() {
      if (props.cancelText) {
        return [(0, _vue.createVNode)("div", {
          "class": bem('gap')
        }, null), (0, _vue.createVNode)("button", {
          "type": "button",
          "class": bem('cancel'),
          "onClick": onCancel
        }, [props.cancelText])];
      }
    };

    var renderOption = function renderOption(item, index) {
      var name = item.name,
          color = item.color,
          subname = item.subname,
          loading = item.loading,
          callback = item.callback,
          disabled = item.disabled,
          className = item.className;
      var Content = loading ? (0, _vue.createVNode)(_loading.default, {
        "class": bem('loading-icon')
      }, null) : [(0, _vue.createVNode)("span", {
        "class": bem('name')
      }, _isSlot(name) ? name : {
        default: function _default() {
          return [name];
        }
      }), subname && (0, _vue.createVNode)("div", {
        "class": bem('subname')
      }, _isSlot(subname) ? subname : {
        default: function _default() {
          return [subname];
        }
      })];

      var onClick = function onClick() {
        if (disabled || loading) {
          return;
        }

        if (callback) {
          callback(item);
        }

        emit('select', item, index);

        if (props.closeOnClickAction) {
          onUpdateShow(false);
        }
      };

      return (0, _vue.createVNode)("button", {
        "type": "button",
        "style": {
          color: color
        },
        "class": [bem('item', {
          loading: loading,
          disabled: disabled
        }), className],
        "onClick": onClick
      }, _isSlot(Content) ? Content : {
        default: function _default() {
          return [Content];
        }
      });
    };

    var renderDescription = function renderDescription() {
      if (props.description || slots.description) {
        var content = slots.description ? slots.description() : props.description;
        return (0, _vue.createVNode)("div", {
          "class": bem('description')
        }, _isSlot(content) ? content : {
          default: function _default() {
            return [content];
          }
        });
      }
    };

    var renderOptions = function renderOptions() {
      if (props.actions) {
        return props.actions.map(renderOption);
      }
    };

    return function () {
      return (0, _vue.createVNode)(_popup.default, (0, _vue.mergeProps)({
        "class": bem(),
        "round": props.round,
        "position": "bottom"
      }, (0, _extends2.default)({}, (0, _utils.pick)(props, popupPropKeys), {
        'onUpdate:show': onUpdateShow
      })), {
        default: function _default() {
          return [renderHeader(), renderDescription(), (0, _vue.createVNode)("div", {
            "class": bem('content')
          }, [renderOptions(), slots.default == null ? void 0 : slots.default()]), renderCancel()];
        }
      });
    };
  }
});

exports.default = _default2;