import { createVNode as _createVNode } from "vue";
import { ref, computed } from 'vue'; // Utils

import { addUnit, getSizeStyle, preventDefault, stopPropagation, createNamespace } from '../utils'; // Composition

import { useRect } from '@vant/use';
import { useTouch } from '../composables/use-touch';
import { useLinkField } from '../composables/use-link-field';

var _createNamespace = createNamespace('slider'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    range: Boolean,
    disabled: Boolean,
    vertical: Boolean,
    barHeight: [Number, String],
    buttonSize: [Number, String],
    activeColor: String,
    inactiveColor: String,
    min: {
      type: [Number, String],
      default: 0
    },
    max: {
      type: [Number, String],
      default: 100
    },
    step: {
      type: [Number, String],
      default: 1
    },
    modelValue: {
      type: [Number, Array],
      default: 0
    }
  },
  emits: ['change', 'drag-end', 'drag-start', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var buttonIndex;
    var startValue;
    var currentValue;
    var root = ref();
    var dragStatus = ref();
    var touch = useTouch();
    var scope = computed(function () {
      return Number(props.max) - Number(props.min);
    });
    var wrapperStyle = computed(function () {
      var _ref2;

      var crossAxis = props.vertical ? 'width' : 'height';
      return _ref2 = {
        background: props.inactiveColor
      }, _ref2[crossAxis] = addUnit(props.barHeight), _ref2;
    });

    var isRange = function isRange(val) {
      return !!props.range && Array.isArray(val);
    }; // 计算选中条的长度百分比


    var calcMainAxis = function calcMainAxis() {
      var modelValue = props.modelValue,
          min = props.min;

      if (isRange(modelValue)) {
        return (modelValue[1] - modelValue[0]) * 100 / scope.value + "%";
      }

      return (modelValue - Number(min)) * 100 / scope.value + "%";
    }; // 计算选中条的开始位置的偏移量


    var calcOffset = function calcOffset() {
      var modelValue = props.modelValue,
          min = props.min;

      if (isRange(modelValue)) {
        return (modelValue[0] - Number(min)) * 100 / scope.value + "%";
      }

      return "0%";
    };

    var barStyle = computed(function () {
      var _ref3;

      var mainAxis = props.vertical ? 'height' : 'width';
      return _ref3 = {}, _ref3[mainAxis] = calcMainAxis(), _ref3.left = props.vertical ? undefined : calcOffset(), _ref3.top = props.vertical ? calcOffset() : undefined, _ref3.background = props.activeColor, _ref3.transition = dragStatus.value ? 'none' : undefined, _ref3;
    });

    var format = function format(value) {
      var min = props.min,
          max = props.max,
          step = props.step;
      value = Math.max(+min, Math.min(value, +max));
      return Math.round(value / +step) * +step;
    };

    var isSameValue = function isSameValue(newValue, oldValue) {
      return JSON.stringify(newValue) === JSON.stringify(oldValue);
    }; // 处理两个滑块重叠之后的情况


    var handleOverlap = function handleOverlap(value) {
      if (value[0] > value[1]) {
        return value.slice(0).reverse();
      }

      return value;
    };

    var updateValue = function updateValue(value, end) {
      if (isRange(value)) {
        value = handleOverlap(value).map(format);
      } else {
        value = format(value);
      }

      if (!isSameValue(value, props.modelValue)) {
        emit('update:modelValue', value);
      }

      if (end && !isSameValue(value, startValue)) {
        emit('change', value);
      }
    };

    var onClick = function onClick(event) {
      event.stopPropagation();

      if (props.disabled) {
        return;
      }

      var min = props.min,
          vertical = props.vertical,
          modelValue = props.modelValue;
      var rect = useRect(root);
      var delta = vertical ? event.clientY - rect.top : event.clientX - rect.left;
      var total = vertical ? rect.height : rect.width;
      var value = Number(min) + delta / total * scope.value;

      if (isRange(modelValue)) {
        var left = modelValue[0],
            right = modelValue[1];
        var middle = (left + right) / 2;

        if (value <= middle) {
          updateValue([value, right], true);
        } else {
          updateValue([left, value], true);
        }
      } else {
        updateValue(value, true);
      }
    };

    var onTouchStart = function onTouchStart(event) {
      if (props.disabled) {
        return;
      }

      touch.start(event);
      currentValue = props.modelValue;

      if (isRange(currentValue)) {
        startValue = currentValue.map(format);
      } else {
        startValue = format(currentValue);
      }

      dragStatus.value = 'start';
    };

    var onTouchMove = function onTouchMove(event) {
      if (props.disabled) {
        return;
      }

      if (dragStatus.value === 'start') {
        emit('drag-start');
      }

      preventDefault(event, true);
      touch.move(event);
      dragStatus.value = 'draging';
      var rect = useRect(root);
      var delta = props.vertical ? touch.deltaY.value : touch.deltaX.value;
      var total = props.vertical ? rect.height : rect.width;
      var diff = delta / total * scope.value;

      if (isRange(startValue)) {
        currentValue[buttonIndex] = startValue[buttonIndex] + diff;
      } else {
        currentValue = startValue + diff;
      }

      updateValue(currentValue);
    };

    var onTouchEnd = function onTouchEnd() {
      if (props.disabled) {
        return;
      }

      if (dragStatus.value === 'draging') {
        updateValue(currentValue, true);
        emit('drag-end');
      }

      dragStatus.value = '';
    };

    var renderButton = function renderButton(index) {
      var getClassName = function getClassName() {
        if (typeof index === 'number') {
          var position = ['left', 'right'];
          return "button-wrapper-" + position[index];
        }

        return "button-wrapper";
      };

      var currentValue = typeof index === 'number' ? props.modelValue[index] : props.modelValue;
      return _createVNode("div", {
        "role": "slider",
        "class": bem(getClassName()),
        "tabindex": props.disabled ? -1 : 0,
        "aria-valuemin": +props.min,
        "aria-valuenow": currentValue,
        "aria-valuemax": +props.max,
        "aria-orientation": props.vertical ? 'vertical' : 'horizontal',
        "onTouchstart": function onTouchstart(e) {
          if (typeof index === 'number') {
            // save index of current button
            buttonIndex = index;
          }

          onTouchStart(e);
        },
        "onTouchmove": onTouchMove,
        "onTouchend": onTouchEnd,
        "onTouchcancel": onTouchEnd,
        "onClick": stopPropagation
      }, [slots.button ? slots.button() : _createVNode("div", {
        "class": bem('button'),
        "style": getSizeStyle(props.buttonSize)
      }, null)]);
    }; // format initial value


    updateValue(props.modelValue);
    useLinkField(function () {
      return props.modelValue;
    });
    return function () {
      return _createVNode("div", {
        "ref": root,
        "style": wrapperStyle.value,
        "class": bem({
          vertical: props.vertical,
          disabled: props.disabled
        }),
        "onClick": onClick
      }, [_createVNode("div", {
        "class": bem('bar'),
        "style": barStyle.value
      }, [props.range ? [renderButton(0), renderButton(1)] : renderButton()])]);
    };
  }
});