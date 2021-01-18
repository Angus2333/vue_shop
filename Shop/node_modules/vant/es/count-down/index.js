import { createVNode as _createVNode } from "vue";
import { watch, computed } from 'vue'; // Utils

import { createNamespace } from '../utils';
import { parseFormat } from './utils'; // Composition

import { useCountDown } from '@vant/use';
import { useExpose } from '../composables/use-expose';

var _createNamespace = createNamespace('count-down'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    millisecond: Boolean,
    time: {
      type: [Number, String],
      default: 0
    },
    format: {
      type: String,
      default: 'HH:mm:ss'
    },
    autoStart: {
      type: Boolean,
      default: true
    }
  },
  emits: ['change', 'finish'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var _useCountDown = useCountDown({
      time: +props.time,
      millisecond: props.millisecond,
      onChange: function onChange(current) {
        emit('change', current);
      },
      onFinish: function onFinish() {
        emit('finish');
      }
    }),
        start = _useCountDown.start,
        pause = _useCountDown.pause,
        reset = _useCountDown.reset,
        current = _useCountDown.current;

    var timeText = computed(function () {
      return parseFormat(props.format, current.value);
    });

    var resetTime = function resetTime() {
      reset(+props.time);

      if (props.autoStart) {
        start();
      }
    };

    watch(function () {
      return props.time;
    }, resetTime, {
      immediate: true
    });
    useExpose({
      start: start,
      pause: pause,
      reset: resetTime
    });
    return function () {
      return _createVNode("div", {
        "class": bem()
      }, [slots.default ? slots.default(current.value) : timeText.value]);
    };
  }
});