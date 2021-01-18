import { createVNode as _createVNode } from "vue";
import { ref, reactive, computed } from 'vue'; // Utils

import { range, createNamespace, preventDefault } from '../utils';
import { callInterceptor } from '../utils/interceptor'; // Composition

import { useRect, useClickAway } from '@vant/use';
import { useTouch } from '../composables/use-touch';
import { useExpose } from '../composables/use-expose';

var _createNamespace = createNamespace('swipe-cell'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    disabled: Boolean,
    leftWidth: [Number, String],
    rightWidth: [Number, String],
    beforeClose: Function,
    stopPropagation: Boolean,
    name: {
      type: [Number, String],
      default: ''
    }
  },
  emits: ['open', 'close', 'click'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var opened;
    var lockClick;
    var startOffset;
    var root = ref();
    var leftRef = ref();
    var rightRef = ref();
    var state = reactive({
      offset: 0,
      dragging: false
    });
    var touch = useTouch();

    var getWidthByRef = function getWidthByRef(ref) {
      return ref.value ? useRect(ref).width : 0;
    };

    var leftWidth = computed(function () {
      return +props.leftWidth || getWidthByRef(leftRef);
    });
    var rightWidth = computed(function () {
      return +props.rightWidth || getWidthByRef(rightRef);
    });

    var open = function open(position) {
      opened = true;
      state.offset = position === 'left' ? leftWidth.value : -rightWidth.value;
      emit('open', {
        name: props.name,
        position: position
      });
    };

    var close = function close(position) {
      state.offset = 0;

      if (opened) {
        opened = false;
        emit('close', {
          name: props.name,
          position: position
        });
      }
    };

    var toggle = function toggle(position) {
      var offset = Math.abs(state.offset);
      var THRESHOLD = 0.15;
      var threshold = opened ? 1 - THRESHOLD : THRESHOLD;

      if (position === 'left' || position === 'right') {
        var width = position === 'left' ? leftWidth.value : rightWidth.value;

        if (width && offset > width * threshold) {
          open(position);
          return;
        }
      }

      close();
    };

    var onTouchStart = function onTouchStart(event) {
      if (!props.disabled) {
        startOffset = state.offset;
        touch.start(event);
      }
    };

    var onTouchMove = function onTouchMove(event) {
      if (props.disabled) {
        return;
      }

      var deltaX = touch.deltaX;
      touch.move(event);

      if (touch.isHorizontal()) {
        lockClick = true;
        state.dragging = true;
        var isEdge = !opened || deltaX.value * startOffset < 0;

        if (isEdge) {
          preventDefault(event, props.stopPropagation);
        }

        state.offset = range(deltaX.value + startOffset, -rightWidth.value, leftWidth.value);
      }
    };

    var onTouchEnd = function onTouchEnd() {
      if (state.dragging) {
        state.dragging = false;
        toggle(state.offset > 0 ? 'left' : 'right'); // compatible with desktop scenario

        setTimeout(function () {
          lockClick = false;
        }, 0);
      }
    };

    var onClick = function onClick(position) {
      if (position === void 0) {
        position = 'outside';
      }

      emit('click', position);

      if (opened && !lockClick) {
        callInterceptor({
          interceptor: props.beforeClose,
          args: [{
            name: props.name,
            position: position
          }],
          done: function done() {
            close(position);
          }
        });
      }
    };

    var getClickHandler = function getClickHandler(position, stop) {
      return function (event) {
        if (stop) {
          event.stopPropagation();
        }

        onClick(position);
      };
    };

    var renderSideContent = function renderSideContent(position, ref) {
      if (slots[position]) {
        return _createVNode("div", {
          "ref": ref,
          "class": bem(position),
          "onClick": getClickHandler(position, true)
        }, [slots[position]()]);
      }
    };

    useExpose({
      open: open,
      close: close
    });
    useClickAway(root, onClick, {
      eventName: 'touchstart'
    });
    return function () {
      var wrapperStyle = {
        transform: "translate3d(" + state.offset + "px, 0, 0)",
        transitionDuration: state.dragging ? '0s' : '.6s'
      };
      return _createVNode("div", {
        "ref": root,
        "class": bem(),
        "onClick": getClickHandler('cell'),
        "onTouchstart": onTouchStart,
        "onTouchmove": onTouchMove,
        "onTouchend": onTouchEnd,
        "onTouchcancel": onTouchEnd
      }, [_createVNode("div", {
        "class": bem('wrapper'),
        "style": wrapperStyle
      }, [renderSideContent('left', leftRef), slots.default == null ? void 0 : slots.default(), renderSideContent('right', rightRef)])]);
    };
  }
});