"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _useExpose = require("../composables/use-expose");

var _field = _interopRequireDefault(require("../field"));

// Utils
// Composition
// Components
var _createNamespace = (0, _utils.createNamespace)('search'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var _default = createComponent({
  inheritAttrs: false,
  props: {
    label: String,
    rightIcon: String,
    modelValue: String,
    actionText: String,
    background: String,
    showAction: Boolean,
    clearTrigger: String,
    shape: {
      type: String,
      default: 'square'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    leftIcon: {
      type: String,
      default: 'search'
    }
  },
  emits: ['search', 'cancel'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots,
        attrs = _ref.attrs;
    var filedRef = (0, _vue.ref)();

    var onCancel = function onCancel() {
      if (!slots.action) {
        emit('update:modelValue', '');
        emit('cancel');
      }
    };

    var onKeypress = function onKeypress(event) {
      var ENTER_CODE = 13;

      if (event.keyCode === ENTER_CODE) {
        (0, _utils.preventDefault)(event);
        emit('search', props.modelValue);
      }
    };

    var renderLabel = function renderLabel() {
      if (slots.label || props.label) {
        return (0, _vue.createVNode)("div", {
          "class": bem('label')
        }, [slots.label ? slots.label() : props.label]);
      }
    };

    var renderAction = function renderAction() {
      if (props.showAction) {
        var text = props.actionText || t('cancel');
        return (0, _vue.createVNode)("div", {
          "class": bem('action'),
          "role": "button",
          "tabindex": "0",
          "onClick": onCancel
        }, [slots.action ? slots.action() : text]);
      }
    };

    var focus = function focus() {
      if (filedRef.value) {
        filedRef.value.focus();
      }
    };

    var blur = function blur() {
      if (filedRef.value) {
        filedRef.value.blur();
      }
    };

    var fieldPropNames = ['leftIcon', 'rightIcon', 'clearable', 'modelValue', 'clearTrigger'];

    var renderField = function renderField() {
      var fieldAttrs = (0, _extends2.default)({}, attrs, (0, _utils.pick)(props, fieldPropNames), {
        style: null,
        class: null
      });
      return (0, _vue.createVNode)(_field.default, (0, _vue.mergeProps)({
        "ref": filedRef,
        "type": "search",
        "border": false,
        "onKeypress": onKeypress
      }, fieldAttrs), (0, _extends2.default)({}, (0, _utils.pick)(slots, ['left-icon', 'right-icon'])));
    };

    (0, _useExpose.useExpose)({
      focus: focus,
      blur: blur
    });
    return function () {
      return (0, _vue.createVNode)("div", {
        "class": [bem({
          'show-action': props.showAction
        }), attrs.class],
        "style": (0, _extends2.default)({
          background: props.background
        }, attrs.style)
      }, [slots.left == null ? void 0 : slots.left(), (0, _vue.createVNode)("div", {
        "class": bem('content', props.shape)
      }, [renderLabel(), renderField()]), renderAction()]);
    };
  }
});

exports.default = _default;