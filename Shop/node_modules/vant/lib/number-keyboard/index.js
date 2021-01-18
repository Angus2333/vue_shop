"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _use = require("@vant/use");

var _Key = _interopRequireDefault(require("./Key"));

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('number-keyboard'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: {
    show: Boolean,
    title: String,
    zIndex: [Number, String],
    teleport: [String, Object],
    randomKeyOrder: Boolean,
    closeButtonText: String,
    deleteButtonText: String,
    closeButtonLoading: Boolean,
    theme: {
      type: String,
      default: 'default'
    },
    modelValue: {
      type: String,
      default: ''
    },
    extraKey: {
      type: [String, Array],
      default: ''
    },
    maxlength: {
      type: [Number, String],
      default: Number.MAX_VALUE
    },
    transition: {
      type: Boolean,
      default: true
    },
    showDeleteKey: {
      type: Boolean,
      default: true
    },
    hideOnClickOutside: {
      type: Boolean,
      default: true
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: true
    }
  },
  emits: ['show', 'hide', 'blur', 'input', 'close', 'delete', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var root = (0, _vue.ref)();

    var genBasicKeys = function genBasicKeys() {
      var keys = [];

      for (var i = 1; i <= 9; i++) {
        keys.push({
          text: i
        });
      }

      if (props.randomKeyOrder) {
        keys.sort(function () {
          return Math.random() > 0.5 ? 1 : -1;
        });
      }

      return keys;
    };

    var genDefaultKeys = function genDefaultKeys() {
      return [].concat(genBasicKeys(), [{
        text: props.extraKey,
        type: 'extra'
      }, {
        text: 0
      }, {
        text: props.showDeleteKey ? props.deleteButtonText : '',
        type: props.showDeleteKey ? 'delete' : ''
      }]);
    };

    var genCustomKeys = function genCustomKeys() {
      var keys = genBasicKeys();
      var extraKey = props.extraKey;
      var extraKeys = Array.isArray(extraKey) ? extraKey : [extraKey];

      if (extraKeys.length === 1) {
        keys.push({
          text: 0,
          wider: true
        }, {
          text: extraKeys[0],
          type: 'extra'
        });
      } else if (extraKeys.length === 2) {
        keys.push({
          text: extraKeys[0],
          type: 'extra'
        }, {
          text: 0
        }, {
          text: extraKeys[1],
          type: 'extra'
        });
      }

      return keys;
    };

    var keys = (0, _vue.computed)(function () {
      return props.theme === 'custom' ? genCustomKeys() : genDefaultKeys();
    });

    var onBlur = function onBlur() {
      if (props.show) {
        emit('blur');
      }
    };

    var onClose = function onClose() {
      emit('close');
      onBlur();
    };

    var onAnimationEnd = function onAnimationEnd() {
      emit(props.show ? 'show' : 'hide');
    };

    var onPress = function onPress(text, type) {
      if (text === '') {
        if (type === 'extra') {
          onBlur();
        }

        return;
      }

      var value = props.modelValue;

      if (type === 'delete') {
        emit('delete');
        emit('update:modelValue', value.slice(0, value.length - 1));
      } else if (type === 'close') {
        onClose();
      } else if (value.length < props.maxlength) {
        emit('input', text);
        emit('update:modelValue', value + text);
      }
    };

    var renderTitle = function renderTitle() {
      var title = props.title,
          theme = props.theme,
          closeButtonText = props.closeButtonText;
      var leftSlot = slots['title-left'];
      var showClose = closeButtonText && theme === 'default';
      var showTitle = title || showClose || leftSlot;

      if (!showTitle) {
        return;
      }

      return (0, _vue.createVNode)("div", {
        "class": bem('header')
      }, [leftSlot && (0, _vue.createVNode)("span", {
        "class": bem('title-left')
      }, [leftSlot()]), title && (0, _vue.createVNode)("h2", {
        "class": bem('title')
      }, _isSlot(title) ? title : {
        default: function _default() {
          return [title];
        }
      }), showClose && (0, _vue.createVNode)("button", {
        "type": "button",
        "class": bem('close'),
        "onClick": onClose
      }, _isSlot(closeButtonText) ? closeButtonText : {
        default: function _default() {
          return [closeButtonText];
        }
      })]);
    };

    var renderKeys = function renderKeys() {
      return keys.value.map(function (key) {
        var slots = {};

        if (key.type === 'delete') {
          slots.default = slots.delete;
        }

        if (key.type === 'extra') {
          slots.default = slots['extra-key'];
        }

        return (0, _vue.createVNode)(_Key.default, {
          "key": key.text,
          "text": key.text,
          "type": key.type,
          "wider": key.wider,
          "color": key.color,
          "onPress": onPress
        }, (0, _extends2.default)({}, slots));
      });
    };

    var renderSidebar = function renderSidebar() {
      if (props.theme === 'custom') {
        return (0, _vue.createVNode)("div", {
          "class": bem('sidebar')
        }, [props.showDeleteKey && (0, _vue.createVNode)(_Key.default, {
          "large": true,
          "text": props.deleteButtonText,
          "type": "delete",
          "onPress": onPress
        }, {
          delete: slots.delete
        }), (0, _vue.createVNode)(_Key.default, {
          "large": true,
          "text": props.closeButtonText,
          "type": "close",
          "color": "blue",
          "loading": props.closeButtonLoading,
          "onPress": onPress
        }, null)]);
      }
    };

    (0, _vue.watch)(function () {
      return props.show;
    }, function (value) {
      if (!props.transition) {
        emit(value ? 'show' : 'hide');
      }
    });

    if (props.hideOnClickOutside) {
      (0, _use.useClickAway)(root, onClose, {
        eventName: 'touchstart'
      });
    }

    return function () {
      var _slot;

      var Title = renderTitle();
      var Content = (0, _vue.createVNode)(_vue.Transition, {
        "name": props.transition ? 'van-slide-up' : ''
      }, _isSlot(_slot = (0, _vue.withDirectives)((0, _vue.createVNode)("div", {
        "ref": root,
        "style": {
          zIndex: props.zIndex
        },
        "class": bem({
          unfit: !props.safeAreaInsetBottom,
          'with-title': !!Title
        }),
        "onTouchstart": _utils.stopPropagation,
        "onAnimationend": onAnimationEnd,
        "onWebkitAnimationEnd": onAnimationEnd
      }, [Title, (0, _vue.createVNode)("div", {
        "class": bem('body')
      }, [(0, _vue.createVNode)("div", {
        "class": bem('keys')
      }, [renderKeys()]), renderSidebar()])]), [[_vue.vShow, props.show]])) ? _slot : {
        default: function _default() {
          return [_slot];
        }
      });

      if (props.teleport) {
        return (0, _vue.createVNode)(_vue.Teleport, {
          "to": props.teleport
        }, _isSlot(Content) ? Content : {
          default: function _default() {
            return [Content];
          }
        });
      }

      return Content;
    };
  }
});

exports.default = _default2;