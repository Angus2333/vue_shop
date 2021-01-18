"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = exports.cellProps = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _useRoute = require("../composables/use-route");

var _icon = _interopRequireDefault(require("../icon"));

// Utils
// Composition
// Components
var _createNamespace = (0, _utils.createNamespace)('cell'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var cellProps = {
  icon: String,
  size: String,
  title: [Number, String],
  value: [Number, String],
  label: [Number, String],
  center: Boolean,
  isLink: Boolean,
  required: Boolean,
  clickable: Boolean,
  iconPrefix: String,
  titleStyle: null,
  titleClass: null,
  valueClass: null,
  labelClass: null,
  arrowDirection: String,
  border: {
    type: Boolean,
    default: true
  }
};
exports.cellProps = cellProps;

var _default = createComponent({
  props: (0, _extends2.default)({}, cellProps, _useRoute.routeProps),
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var route = (0, _useRoute.useRoute)();

    var renderLabel = function renderLabel() {
      var showLabel = slots.label || (0, _utils.isDef)(props.label);

      if (showLabel) {
        return (0, _vue.createVNode)("div", {
          "class": [bem('label'), props.labelClass]
        }, [slots.label ? slots.label() : props.label]);
      }
    };

    var renderTitle = function renderTitle() {
      if (slots.title || (0, _utils.isDef)(props.title)) {
        return (0, _vue.createVNode)("div", {
          "class": [bem('title'), props.titleClass],
          "style": props.titleStyle
        }, [slots.title ? slots.title() : (0, _vue.createVNode)("span", null, [props.title]), renderLabel()]);
      }
    };

    var renderValue = function renderValue() {
      var hasTitle = slots.title || (0, _utils.isDef)(props.title);
      var hasValue = slots.default || (0, _utils.isDef)(props.value);

      if (hasValue) {
        return (0, _vue.createVNode)("div", {
          "class": [bem('value', {
            alone: !hasTitle
          }), props.valueClass]
        }, [slots.default ? slots.default() : (0, _vue.createVNode)("span", null, [props.value])]);
      }
    };

    var renderLeftIcon = function renderLeftIcon() {
      if (slots.icon) {
        return slots.icon();
      }

      if (props.icon) {
        return (0, _vue.createVNode)(_icon.default, {
          "name": props.icon,
          "class": bem('left-icon'),
          "classPrefix": props.iconPrefix
        }, null);
      }
    };

    var renderRightIcon = function renderRightIcon() {
      if (slots['right-icon']) {
        return slots['right-icon']();
      }

      if (props.isLink) {
        var name = props.arrowDirection ? "arrow-" + props.arrowDirection : 'arrow';
        return (0, _vue.createVNode)(_icon.default, {
          "name": name,
          "class": bem('right-icon')
        }, null);
      }
    };

    return function () {
      var size = props.size,
          center = props.center,
          border = props.border,
          isLink = props.isLink,
          required = props.required;
      var clickable = isLink || props.clickable;
      var classes = {
        center: center,
        required: required,
        clickable: clickable,
        borderless: !border
      };

      if (size) {
        classes[size] = !!size;
      }

      return (0, _vue.createVNode)("div", {
        "class": bem(classes),
        "role": clickable ? 'button' : undefined,
        "tabindex": clickable ? 0 : undefined,
        "onClick": route
      }, [renderLeftIcon(), renderTitle(), renderValue(), renderRightIcon(), slots.extra == null ? void 0 : slots.extra()]);
    };
  }
});

exports.default = _default;