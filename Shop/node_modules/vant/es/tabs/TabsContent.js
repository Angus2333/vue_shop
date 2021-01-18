import { createVNode as _createVNode } from "vue";
import { isVNode as _isVNode } from "vue";
import { ref, watch, onMounted } from 'vue';
import { createNamespace } from '../utils';
import Swipe from '../swipe';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('tabs'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    inited: Boolean,
    animated: Boolean,
    swipeable: Boolean,
    lazyRender: Boolean,
    count: {
      type: Number,
      required: true
    },
    duration: {
      type: [Number, String],
      required: true
    },
    currentIndex: {
      type: Number,
      required: true
    }
  },
  emits: ['change'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var swipeRef = ref();

    var onChange = function onChange(index) {
      emit('change', index);
    };

    var renderChildren = function renderChildren() {
      var Content = slots.default == null ? void 0 : slots.default();

      if (props.animated || props.swipeable) {
        return _createVNode(Swipe, {
          "ref": swipeRef,
          "loop": false,
          "class": bem('track'),
          "duration": +props.duration * 1000,
          "touchable": props.swipeable,
          "lazyRender": props.lazyRender,
          "showIndicators": false,
          "onChange": onChange
        }, _isSlot(Content) ? Content : {
          default: function _default() {
            return [Content];
          }
        });
      }

      return Content;
    };

    var swipeToCurrentTab = function swipeToCurrentTab(index) {
      var swipe = swipeRef.value;

      if (swipe && swipe.state.active !== index) {
        swipe.swipeTo(index, {
          immediate: !props.inited
        });
      }
    };

    watch(function () {
      return props.currentIndex;
    }, swipeToCurrentTab);
    onMounted(function () {
      swipeToCurrentTab(props.currentIndex);
    });
    return function () {
      return _createVNode("div", {
        "class": bem('content', {
          animated: props.animated || props.swipeable
        })
      }, [renderChildren()]);
    };
  }
});