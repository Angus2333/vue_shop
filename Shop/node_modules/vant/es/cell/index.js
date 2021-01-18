import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
// Utils
import { createNamespace, isDef } from '../utils'; // Composition

import { useRoute, routeProps } from '../composables/use-route'; // Components

import Icon from '../icon';

var _createNamespace = createNamespace('cell'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export var cellProps = {
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
export default createComponent({
  props: _extends({}, cellProps, routeProps),
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var route = useRoute();

    var renderLabel = function renderLabel() {
      var showLabel = slots.label || isDef(props.label);

      if (showLabel) {
        return _createVNode("div", {
          "class": [bem('label'), props.labelClass]
        }, [slots.label ? slots.label() : props.label]);
      }
    };

    var renderTitle = function renderTitle() {
      if (slots.title || isDef(props.title)) {
        return _createVNode("div", {
          "class": [bem('title'), props.titleClass],
          "style": props.titleStyle
        }, [slots.title ? slots.title() : _createVNode("span", null, [props.title]), renderLabel()]);
      }
    };

    var renderValue = function renderValue() {
      var hasTitle = slots.title || isDef(props.title);
      var hasValue = slots.default || isDef(props.value);

      if (hasValue) {
        return _createVNode("div", {
          "class": [bem('value', {
            alone: !hasTitle
          }), props.valueClass]
        }, [slots.default ? slots.default() : _createVNode("span", null, [props.value])]);
      }
    };

    var renderLeftIcon = function renderLeftIcon() {
      if (slots.icon) {
        return slots.icon();
      }

      if (props.icon) {
        return _createVNode(Icon, {
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
        return _createVNode(Icon, {
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

      return _createVNode("div", {
        "class": bem(classes),
        "role": clickable ? 'button' : undefined,
        "tabindex": clickable ? 0 : undefined,
        "onClick": route
      }, [renderLeftIcon(), renderTitle(), renderValue(), renderRightIcon(), slots.extra == null ? void 0 : slots.extra()]);
    };
  }
});