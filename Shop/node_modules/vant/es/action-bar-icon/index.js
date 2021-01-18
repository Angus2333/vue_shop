import { createVNode as _createVNode } from "vue";
import { isVNode as _isVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createNamespace } from '../utils';
import { ACTION_BAR_KEY } from '../action-bar'; // Composition

import { useParent } from '@vant/use';
import { useRoute, routeProps } from '../composables/use-route'; // Components

import Icon from '../icon';
import Badge from '../badge';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('action-bar-icon'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: _extends({}, routeProps, {
    dot: Boolean,
    text: String,
    icon: String,
    color: String,
    badge: [Number, String],
    iconClass: null
  }),
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var route = useRoute();
    useParent(ACTION_BAR_KEY);

    var renderIcon = function renderIcon() {
      var dot = props.dot,
          badge = props.badge,
          icon = props.icon,
          color = props.color,
          iconClass = props.iconClass;

      if (slots.icon) {
        var _slot;

        return _createVNode(Badge, {
          "dot": dot,
          "content": badge,
          "class": bem('icon')
        }, _isSlot(_slot = slots.icon()) ? _slot : {
          default: function _default() {
            return [_slot];
          }
        });
      }

      return _createVNode(Icon, {
        "tag": "div",
        "dot": dot,
        "name": icon,
        "badge": badge,
        "color": color,
        "class": [bem('icon'), iconClass]
      }, null);
    };

    return function () {
      return _createVNode("div", {
        "role": "button",
        "class": bem(),
        "tabindex": 0,
        "onClick": route
      }, [renderIcon(), slots.default ? slots.default() : props.text]);
    };
  }
});