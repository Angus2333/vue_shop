import { withDirectives as _withDirectives } from "vue";
import { createVNode as _createVNode } from "vue";
import { mergeProps as _mergeProps } from "vue";
import { vShow as _vShow } from "vue";
import { ref, watch, computed } from 'vue'; // Utils

import { isNaN } from '../utils/validate/number';
import { isDef, addUnit, resetScroll, formatNumber, getSizeStyle, preventDefault, createNamespace } from '../utils'; // Composition

import { useLinkField } from '../composables/use-link-field';
import { callInterceptor } from '../utils/interceptor';

var _createNamespace = createNamespace('stepper'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var LONG_PRESS_INTERVAL = 200;
var LONG_PRESS_START_TIME = 600;

function equal(value1, value2) {
  return String(value1) === String(value2);
} // add num and avoid float number


function add(num1, num2) {
  var cardinal = Math.pow(10, 10);
  return Math.round((num1 + num2) * cardinal) / cardinal;
}

export default createComponent({
  props: {
    theme: String,
    integer: Boolean,
    disabled: Boolean,
    allowEmpty: Boolean,
    modelValue: [Number, String],
    inputWidth: [Number, String],
    buttonSize: [Number, String],
    placeholder: String,
    disablePlus: Boolean,
    disableMinus: Boolean,
    disableInput: Boolean,
    beforeChange: Function,
    decimalLength: [Number, String],
    name: {
      type: [Number, String],
      default: ''
    },
    min: {
      type: [Number, String],
      default: 1
    },
    max: {
      type: [Number, String],
      default: Infinity
    },
    step: {
      type: [Number, String],
      default: 1
    },
    defaultValue: {
      type: [Number, String],
      default: 1
    },
    showPlus: {
      type: Boolean,
      default: true
    },
    showMinus: {
      type: Boolean,
      default: true
    },
    showInput: {
      type: Boolean,
      default: true
    },
    longPress: {
      type: Boolean,
      default: true
    }
  },
  emits: ['plus', 'blur', 'minus', 'focus', 'change', 'overlimit', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit;

    var format = function format(value) {
      var min = props.min,
          max = props.max,
          allowEmpty = props.allowEmpty,
          decimalLength = props.decimalLength;

      if (allowEmpty && value === '') {
        return value;
      }

      value = formatNumber(String(value), !props.integer);
      value = value === '' ? 0 : +value;
      value = isNaN(value) ? +min : value;
      value = Math.max(Math.min(+max, value), +min); // format decimal

      if (isDef(decimalLength)) {
        value = value.toFixed(+decimalLength);
      }

      return value;
    };

    var getInitialValue = function getInitialValue() {
      var _props$modelValue;

      var defaultValue = (_props$modelValue = props.modelValue) != null ? _props$modelValue : props.defaultValue;
      var value = format(defaultValue);

      if (!equal(value, props.modelValue)) {
        emit('update:modelValue', value);
      }

      return value;
    };

    var actionType;
    var inputRef = ref();
    var current = ref(getInitialValue());
    var minusDisabled = computed(function () {
      return props.disabled || props.disableMinus || current.value <= +props.min;
    });
    var plusDisabled = computed(function () {
      return props.disabled || props.disablePlus || current.value >= +props.max;
    });
    var inputStyle = computed(function () {
      return {
        width: addUnit(props.inputWidth),
        height: addUnit(props.buttonSize)
      };
    });
    var buttonStyle = computed(function () {
      return getSizeStyle(props.buttonSize);
    });

    var check = function check() {
      var value = format(current.value);

      if (!equal(value, current.value)) {
        current.value = value;
      }
    };

    var setValue = function setValue(value) {
      if (props.beforeChange) {
        callInterceptor({
          args: [value],
          interceptor: props.beforeChange,
          done: function done() {
            current.value = value;
          }
        });
      } else {
        current.value = value;
      }
    };

    var onChange = function onChange() {
      if (actionType === 'plus' && plusDisabled.value || actionType === 'minus' && minusDisabled.value) {
        emit('overlimit', actionType);
        return;
      }

      var diff = actionType === 'minus' ? -props.step : +props.step;
      var value = format(add(+current.value, diff));
      setValue(value);
      emit(actionType);
    };

    var onInput = function onInput(event) {
      var input = event.target;
      var value = input.value;
      var decimalLength = props.decimalLength;
      var formatted = formatNumber(String(value), !props.integer); // limit max decimal length

      if (isDef(decimalLength) && formatted.indexOf('.') !== -1) {
        var pair = formatted.split('.');
        formatted = pair[0] + "." + pair[1].slice(0, +decimalLength);
      }

      if (props.beforeChange) {
        input.value = String(current.value);
      } else if (!equal(value, formatted)) {
        input.value = formatted;
      } // perfer number type


      var isNumeric = formatted === String(+formatted);
      setValue(isNumeric ? +formatted : formatted);
    };

    var onFocus = function onFocus(event) {
      // readonly not work in lagacy mobile safari
      if (props.disableInput && inputRef.value) {
        inputRef.value.blur();
      } else {
        emit('focus', event);
      }
    };

    var onBlur = function onBlur(event) {
      var input = event.target;
      var value = format(input.value);
      input.value = String(value);
      current.value = value;
      emit('blur', event);
      resetScroll();
    };

    var isLongPress;
    var longPressTimer;

    var longPressStep = function longPressStep() {
      longPressTimer = setTimeout(function () {
        onChange();
        longPressStep();
      }, LONG_PRESS_INTERVAL);
    };

    var onTouchStart = function onTouchStart() {
      if (props.longPress) {
        isLongPress = false;
        clearTimeout(longPressTimer);
        longPressTimer = setTimeout(function () {
          isLongPress = true;
          onChange();
          longPressStep();
        }, LONG_PRESS_START_TIME);
      }
    };

    var onTouchEnd = function onTouchEnd(event) {
      if (props.longPress) {
        clearTimeout(longPressTimer);

        if (isLongPress) {
          preventDefault(event);
        }
      }
    };

    var onMousedown = function onMousedown(event) {
      // fix mobile safari page scroll down issue
      // see: https://github.com/youzan/vant/issues/7690
      if (props.disableInput) {
        event.preventDefault();
      }
    };

    var createListeners = function createListeners(type) {
      return {
        onClick: function onClick(event) {
          // disable double tap scrolling on mobile safari
          event.preventDefault();
          actionType = type;
          onChange();
        },
        onTouchstart: function onTouchstart() {
          actionType = type;
          onTouchStart();
        },
        onTouchend: onTouchEnd,
        onTouchcancel: onTouchEnd
      };
    };

    watch([function () {
      return props.max;
    }, function () {
      return props.min;
    }, function () {
      return props.integer;
    }, function () {
      return props.decimalLength;
    }], check);
    watch(function () {
      return props.modelValue;
    }, function (value) {
      if (!equal(value, current.value)) {
        current.value = format(value);
      }
    });
    watch(current, function (value) {
      emit('update:modelValue', value);
      emit('change', value, {
        name: props.name
      });
    });
    useLinkField(function () {
      return props.modelValue;
    });
    return function () {
      return _createVNode("div", {
        "class": bem([props.theme])
      }, [_withDirectives(_createVNode("button", _mergeProps({
        "type": "button",
        "style": buttonStyle.value,
        "class": bem('minus', {
          disabled: minusDisabled.value
        })
      }, createListeners('minus')), null), [[_vShow, props.showMinus]]), _withDirectives(_createVNode("input", {
        "ref": inputRef,
        "type": props.integer ? 'tel' : 'text',
        "role": "spinbutton",
        "class": bem('input'),
        "value": current.value,
        "style": inputStyle.value,
        "disabled": props.disabled,
        "readonly": props.disableInput,
        "inputmode": props.integer ? 'numeric' : 'decimal',
        "placeholder": props.placeholder,
        "aria-valuemax": +props.max,
        "aria-valuemin": +props.min,
        "aria-valuenow": +current.value,
        "onBlur": onBlur,
        "onInput": onInput,
        "onFocus": onFocus,
        "onMousedown": onMousedown
      }, null), [[_vShow, props.showInput]]), _withDirectives(_createVNode("button", _mergeProps({
        "type": "button",
        "style": buttonStyle.value,
        "class": bem('plus', {
          disabled: plusDisabled.value
        })
      }, createListeners('plus')), null), [[_vShow, props.showPlus]])]);
    };
  }
});