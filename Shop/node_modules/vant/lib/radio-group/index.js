"use strict";

exports.__esModule = true;
exports.default = exports.RADIO_KEY = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _use = require("@vant/use");

var _useLinkField = require("../composables/use-link-field");

var _createNamespace = (0, _utils.createNamespace)('radio-group'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var RADIO_KEY = 'vanRadio';
exports.RADIO_KEY = RADIO_KEY;

var _default = createComponent({
  props: {
    disabled: Boolean,
    iconSize: [Number, String],
    direction: String,
    modelValue: null,
    checkedColor: String
  },
  emits: ['change', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var _useChildren = (0, _use.useChildren)(RADIO_KEY),
        linkChildren = _useChildren.linkChildren;

    (0, _vue.watch)(function () {
      return props.modelValue;
    }, function (value) {
      emit('change', value);
    });
    linkChildren({
      emit: emit,
      props: props
    });
    (0, _useLinkField.useLinkField)(function () {
      return props.modelValue;
    });
    return function () {
      return (0, _vue.createVNode)("div", {
        "class": bem([props.direction]),
        "role": "radiogroup"
      }, [slots.default == null ? void 0 : slots.default()]);
    };
  }
});

exports.default = _default;