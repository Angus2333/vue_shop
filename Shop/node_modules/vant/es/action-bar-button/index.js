import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { computed } from 'vue';
import { createNamespace } from '../utils';
import { ACTION_BAR_KEY } from '../action-bar'; // Composition

import { useParent } from '@vant/use';
import { useExpose } from '../composables/use-expose';
import { useRoute, routeProps } from '../composables/use-route'; // Components

import Button from '../button';

var _createNamespace = createNamespace('action-bar-button'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: _extends({}, routeProps, {
    type: String,
    text: String,
    icon: String,
    color: String,
    loading: Boolean,
    disabled: Boolean
  }),
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var route = useRoute();

    var _useParent = useParent(ACTION_BAR_KEY),
        parent = _useParent.parent,
        index = _useParent.index;

    var isFirst = computed(function () {
      if (parent) {
        var prev = parent.children[index.value - 1];
        return !(prev && 'isButton' in prev);
      }
    });
    var isLast = computed(function () {
      if (parent) {
        var next = parent.children[index.value + 1];
        return !(next && 'isButton' in next);
      }
    });
    useExpose({
      isButton: true
    });
    return function () {
      var type = props.type,
          icon = props.icon,
          text = props.text,
          color = props.color,
          loading = props.loading,
          disabled = props.disabled;
      return _createVNode(Button, {
        "class": bem([type, {
          last: isLast.value,
          first: isFirst.value
        }]),
        "size": "large",
        "type": type,
        "icon": icon,
        "color": color,
        "loading": loading,
        "disabled": disabled,
        "onClick": route
      }, {
        default: function _default() {
          return [slots.default ? slots.default() : text];
        }
      });
    };
  }
});