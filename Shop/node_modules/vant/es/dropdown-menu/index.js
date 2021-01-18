import { createVNode as _createVNode } from "vue";
import { ref, computed } from 'vue'; // Utils

import { createNamespace, isDef } from '../utils'; // Composition

import { useRect, useChildren, useClickAway, useScrollParent, useEventListener } from '@vant/use';

var _createNamespace = createNamespace('dropdown-menu'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export var DROPDOWN_KEY = 'vanDropdownMenu';
export default createComponent({
  props: {
    zIndex: [Number, String],
    activeColor: String,
    overlay: {
      type: Boolean,
      default: true
    },
    duration: {
      type: [Number, String],
      default: 0.2
    },
    direction: {
      type: String,
      default: 'down'
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var root = ref();
    var offset = ref(0);
    var barRef = ref();

    var _useChildren = useChildren(DROPDOWN_KEY),
        children = _useChildren.children,
        linkChildren = _useChildren.linkChildren;

    var scrollParent = useScrollParent(root);
    var opened = computed(function () {
      return children.some(function (item) {
        return item.state.showWrapper;
      });
    });
    var barStyle = computed(function () {
      if (opened.value && isDef(props.zIndex)) {
        return {
          zIndex: 1 + props.zIndex
        };
      }
    });

    var onClickAway = function onClickAway() {
      if (props.closeOnClickOutside) {
        children.forEach(function (item) {
          item.toggle(false);
        });
      }
    };

    var updateOffset = function updateOffset() {
      if (barRef.value) {
        var rect = useRect(barRef);

        if (props.direction === 'down') {
          offset.value = rect.bottom;
        } else {
          offset.value = window.innerHeight - rect.top;
        }
      }
    };

    var onScroll = function onScroll() {
      if (opened.value) {
        updateOffset();
      }
    };

    var toggleItem = function toggleItem(active) {
      children.forEach(function (item, index) {
        if (index === active) {
          updateOffset();
          item.toggle();
        } else if (item.state.showPopup) {
          item.toggle(false, {
            immediate: true
          });
        }
      });
    };

    var renderTitle = function renderTitle(item, index) {
      var showPopup = item.state.showPopup;
      var disabled = item.disabled,
          titleClass = item.titleClass;
      return _createVNode("div", {
        "role": "button",
        "tabindex": disabled ? -1 : 0,
        "class": bem('item', {
          disabled: disabled
        }),
        "onClick": function onClick() {
          if (!disabled) {
            toggleItem(index);
          }
        }
      }, [_createVNode("span", {
        "class": [bem('title', {
          down: showPopup === (props.direction === 'down'),
          active: showPopup
        }), titleClass],
        "style": {
          color: showPopup ? props.activeColor : ''
        }
      }, [_createVNode("div", {
        "class": "van-ellipsis"
      }, [item.renderTitle()])])]);
    };

    linkChildren({
      props: props,
      offset: offset
    });
    useClickAway(root, onClickAway);
    useEventListener('scroll', onScroll, {
      target: scrollParent
    });
    return function () {
      return _createVNode("div", {
        "ref": root,
        "class": bem()
      }, [_createVNode("div", {
        "ref": barRef,
        "style": barStyle.value,
        "class": bem('bar', {
          opened: opened.value
        })
      }, [children.map(renderTitle)]), slots.default == null ? void 0 : slots.default()]);
    };
  }
});