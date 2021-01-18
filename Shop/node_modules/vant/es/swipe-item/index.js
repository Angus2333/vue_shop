import { createVNode as _createVNode } from "vue";
import { computed, nextTick, onMounted, reactive } from 'vue';
import { SWIPE_KEY } from '../swipe';
import { createNamespace } from '../utils';
import { useParent } from '@vant/use';
import { useExpose } from '../composables/use-expose';

var _createNamespace = createNamespace('swipe-item'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var rendered;
    var state = reactive({
      offset: 0,
      inited: false,
      mounted: false
    });

    var _useParent = useParent(SWIPE_KEY),
        parent = _useParent.parent,
        index = _useParent.index;

    var style = computed(function () {
      var style = {};
      var vertical = parent.props.vertical;

      if (parent.size.value) {
        style[vertical ? 'height' : 'width'] = parent.size.value + "px";
      }

      if (state.offset) {
        style.transform = "translate" + (vertical ? 'Y' : 'X') + "(" + state.offset + "px)";
      }

      return style;
    });
    var shouldRender = computed(function () {
      var _parent$props = parent.props,
          loop = _parent$props.loop,
          lazyRender = _parent$props.lazyRender;

      if (!lazyRender || rendered) {
        return true;
      } // wait for all item to mount, so we can get the exact count


      if (!state.mounted) {
        return false;
      }

      var active = parent.activeIndicator.value;
      var maxActive = parent.count.value - 1;
      var prevActive = active === 0 && loop ? maxActive : active - 1;
      var nextActive = active === maxActive && loop ? 0 : active + 1;
      rendered = index.value === active || index.value === prevActive || index.value === nextActive;
      return rendered;
    });

    var setOffset = function setOffset(offset) {
      state.offset = offset;
    };

    onMounted(function () {
      nextTick(function () {
        state.mounted = true;
      });
    });
    useExpose({
      setOffset: setOffset
    });
    return function () {
      return _createVNode("div", {
        "class": bem(),
        "style": style.value
      }, [shouldRender.value ? slots.default == null ? void 0 : slots.default() : null]);
    };
  }
});