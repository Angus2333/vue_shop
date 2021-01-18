import { createVNode as _createVNode } from "vue";
import { ref, reactive, computed } from 'vue'; // Utils

import { isHidden, unitToPx, getScrollTop, getElementTop, createNamespace } from '../utils'; // Composition

import { useScrollParent, useEventListener } from '@vant/use';
import { useVisibilityChange } from '../composables/use-visibility-change';

var _createNamespace = createNamespace('sticky'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    zIndex: [Number, String],
    container: null,
    offsetTop: {
      type: [Number, String],
      default: 0
    }
  },
  emits: ['scroll'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var root = ref();
    var scrollParent = useScrollParent(root);
    var state = reactive({
      fixed: false,
      height: 0,
      transform: 0
    });
    var offsetTop = computed(function () {
      return unitToPx(props.offsetTop);
    });
    var style = computed(function () {
      if (!state.fixed) {
        return;
      }

      var top = offsetTop.value ? offsetTop.value + "px" : undefined;
      var transform = state.transform ? "translate3d(0, " + state.transform + "px, 0)" : undefined;
      return {
        top: top,
        zIndex: props.zIndex !== undefined ? +props.zIndex : undefined,
        transform: transform
      };
    });

    var emitScrollEvent = function emitScrollEvent(scrollTop) {
      emit('scroll', {
        scrollTop: scrollTop,
        isFixed: state.fixed
      });
    };

    var onScroll = function onScroll() {
      if (!root.value || isHidden(root)) {
        return;
      }

      state.height = root.value.offsetHeight;
      var container = props.container;
      var scrollTop = getScrollTop(window);
      var topToPageTop = getElementTop(root.value); // The sticky component should be kept inside the container element

      if (container) {
        var bottomToPageTop = topToPageTop + container.offsetHeight;

        if (scrollTop + offsetTop.value + state.height > bottomToPageTop) {
          var distanceToBottom = state.height + scrollTop - bottomToPageTop;

          if (distanceToBottom < state.height) {
            state.fixed = true;
            state.transform = -(distanceToBottom + offsetTop.value);
          } else {
            state.fixed = false;
          }

          emitScrollEvent(scrollTop);
          return;
        }
      }

      if (scrollTop + offsetTop.value > topToPageTop) {
        state.fixed = true;
        state.transform = 0;
      } else {
        state.fixed = false;
      }

      emitScrollEvent(scrollTop);
    };

    useEventListener('scroll', onScroll, {
      target: scrollParent
    });
    useVisibilityChange(root, onScroll);
    return function () {
      var fixed = state.fixed,
          height = state.height;
      var rootStyle = {
        height: fixed ? height + "px" : undefined
      };
      return _createVNode("div", {
        "ref": root,
        "style": rootStyle
      }, [_createVNode("div", {
        "class": bem({
          fixed: fixed
        }),
        "style": style.value
      }, [slots.default == null ? void 0 : slots.default()])]);
    };
  }
});