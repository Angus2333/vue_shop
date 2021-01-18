import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { computed, getCurrentInstance } from 'vue';
import { TABBAR_KEY } from '../tabbar'; // Utils

import { createNamespace, isObject, isDef } from '../utils'; // Composition

import { useParent } from '@vant/use';
import { routeProps, useRoute } from '../composables/use-route'; // Components

import Icon from '../icon';
import Badge from '../badge';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('tabbar-item'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: _extends({}, routeProps, {
    dot: Boolean,
    icon: String,
    name: [Number, String],
    badge: [Number, String],
    iconPrefix: String
  }),
  emits: ['click'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var route = useRoute();
    var vm = getCurrentInstance().proxy;

    var _useParent = useParent(TABBAR_KEY),
        parent = _useParent.parent,
        index = _useParent.index;

    var active = computed(function () {
      var _parent$props = parent.props,
          route = _parent$props.route,
          modelValue = _parent$props.modelValue;

      if (route && '$route' in vm) {
        var $route = vm.$route;
        var to = props.to;
        var config = isObject(to) ? to : {
          path: to
        };
        var pathMatched = config.path === $route.path;
        var nameMatched = isDef(config.name) && config.name === $route.name;
        return pathMatched || nameMatched;
      }

      return (props.name || index.value) === modelValue;
    });

    var onClick = function onClick(event) {
      parent.setActive(props.name || index.value);
      emit('click', event);
      route();
    };

    var renderIcon = function renderIcon() {
      if (slots.icon) {
        return slots.icon({
          active: active.value
        });
      }

      if (props.icon) {
        return _createVNode(Icon, {
          "name": props.icon,
          "classPrefix": props.iconPrefix
        }, null);
      }
    };

    return function () {
      var _slot;

      var dot = props.dot,
          badge = props.badge;
      var _parent$props2 = parent.props,
          activeColor = _parent$props2.activeColor,
          inactiveColor = _parent$props2.inactiveColor;
      var color = active.value ? activeColor : inactiveColor;
      return _createVNode("div", {
        "class": bem({
          active: active.value
        }),
        "style": {
          color: color
        },
        "onClick": onClick
      }, [_createVNode(Badge, {
        "dot": dot,
        "content": badge,
        "class": bem('icon')
      }, _isSlot(_slot = renderIcon()) ? _slot : {
        default: function _default() {
          return [_slot];
        }
      }), _createVNode("div", {
        "class": bem('text')
      }, [slots.default == null ? void 0 : slots.default({
        active: active.value
      })])]);
    };
  }
});