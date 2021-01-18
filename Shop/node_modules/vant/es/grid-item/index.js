import { createVNode as _createVNode } from "vue";
import { isVNode as _isVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { computed } from 'vue'; // Utils

import { createNamespace, addUnit } from '../utils';
import { BORDER } from '../utils/constant';
import { GRID_KEY } from '../grid'; // Composition

import { useParent } from '@vant/use';
import { useRoute, routeProps } from '../composables/use-route'; // Components

import Icon from '../icon';
import Badge from '../badge';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('grid-item'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: _extends({}, routeProps, {
    dot: Boolean,
    text: String,
    icon: String,
    badge: [Number, String],
    iconPrefix: String
  }),
  setup: function setup(props, _ref) {
    var slots = _ref.slots;

    var _useParent = useParent(GRID_KEY),
        parent = _useParent.parent,
        index = _useParent.index;

    var route = useRoute();
    var rootStyle = computed(function () {
      var _parent$props = parent.props,
          square = _parent$props.square,
          gutter = _parent$props.gutter,
          columnNum = _parent$props.columnNum;
      var percent = 100 / columnNum + "%";
      var style = {
        flexBasis: percent
      };

      if (square) {
        style.paddingTop = percent;
      } else if (gutter) {
        var gutterValue = addUnit(gutter);
        style.paddingRight = gutterValue;

        if (index.value >= columnNum) {
          style.marginTop = gutterValue;
        }
      }

      return style;
    });
    var contentStyle = computed(function () {
      var _parent$props2 = parent.props,
          square = _parent$props2.square,
          gutter = _parent$props2.gutter;

      if (square && gutter) {
        var gutterValue = addUnit(gutter);
        return {
          right: gutterValue,
          bottom: gutterValue,
          height: 'auto'
        };
      }
    });

    var renderIcon = function renderIcon() {
      if (slots.icon) {
        var _slot;

        return _createVNode(Badge, {
          "dot": props.dot,
          "content": props.badge
        }, _isSlot(_slot = slots.icon()) ? _slot : {
          default: function _default() {
            return [_slot];
          }
        });
      }

      if (props.icon) {
        return _createVNode(Icon, {
          "dot": props.dot,
          "name": props.icon,
          "size": parent.props.iconSize,
          "badge": props.badge,
          "class": bem('icon'),
          "classPrefix": props.iconPrefix
        }, null);
      }
    };

    var renderText = function renderText() {
      if (slots.text) {
        return slots.text();
      }

      if (props.text) {
        return _createVNode("span", {
          "class": bem('text')
        }, [props.text]);
      }
    };

    var renderContent = function renderContent() {
      if (slots.default) {
        return slots.default();
      }

      return [renderIcon(), renderText()];
    };

    return function () {
      var _ref2;

      var _parent$props3 = parent.props,
          center = _parent$props3.center,
          border = _parent$props3.border,
          square = _parent$props3.square,
          gutter = _parent$props3.gutter,
          direction = _parent$props3.direction,
          clickable = _parent$props3.clickable;
      var classes = [bem('content', [direction, {
        center: center,
        square: square,
        clickable: clickable,
        surround: border && gutter
      }]), (_ref2 = {}, _ref2[BORDER] = border, _ref2)];
      return _createVNode("div", {
        "class": [bem({
          square: square
        })],
        "style": rootStyle.value
      }, [_createVNode("div", {
        "role": clickable ? 'button' : null,
        "class": classes,
        "style": contentStyle.value,
        "tabindex": clickable ? 0 : null,
        "onClick": route
      }, [renderContent()])]);
    };
  }
});