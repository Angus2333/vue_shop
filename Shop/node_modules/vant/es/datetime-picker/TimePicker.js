import { createVNode as _createVNode } from "vue";
import { mergeProps as _mergeProps } from "vue";
import { resolveDirective as _resolveDirective } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { ref, watch, computed, nextTick, onMounted } from 'vue'; // Utils

import { pick, range, padZero, createNamespace } from '../utils';
import { times, sharedProps } from './utils'; // Composition

import { useExpose } from '../composables/use-expose'; // Components

import Picker from '../picker';
import { pickerProps } from '../picker/shared';

var _createNamespace = createNamespace('time-picker'),
    createComponent = _createNamespace[0];

export default createComponent({
  props: _extends({}, sharedProps, {
    minHour: {
      type: [Number, String],
      default: 0
    },
    maxHour: {
      type: [Number, String],
      default: 23
    },
    minMinute: {
      type: [Number, String],
      default: 0
    },
    maxMinute: {
      type: [Number, String],
      default: 59
    }
  }),
  emits: ['confirm', 'cancel', 'change', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var formatValue = function formatValue(value) {
      var minHour = props.minHour,
          maxHour = props.maxHour,
          maxMinute = props.maxMinute,
          minMinute = props.minMinute;

      if (!value) {
        value = padZero(minHour) + ":" + padZero(minMinute);
      }

      var _value$split = value.split(':'),
          hour = _value$split[0],
          minute = _value$split[1];

      hour = padZero(range(hour, minHour, maxHour));
      minute = padZero(range(minute, minMinute, maxMinute));
      return hour + ":" + minute;
    };

    var picker = ref();
    var currentDate = ref(formatValue(props.modelValue));
    var ranges = computed(function () {
      return [{
        type: 'hour',
        range: [+props.minHour, +props.maxHour]
      }, {
        type: 'minute',
        range: [+props.minMinute, +props.maxMinute]
      }];
    });
    var originColumns = computed(function () {
      return ranges.value.map(function (_ref2) {
        var type = _ref2.type,
            rangeArr = _ref2.range;
        var values = times(rangeArr[1] - rangeArr[0] + 1, function (index) {
          return padZero(rangeArr[0] + index);
        });

        if (props.filter) {
          values = props.filter(type, values);
        }

        return {
          type: type,
          values: values
        };
      });
    });
    var columns = computed(function () {
      return originColumns.value.map(function (column) {
        return {
          values: column.values.map(function (value) {
            return props.formatter(column.type, value);
          })
        };
      });
    });

    var updateColumnValue = function updateColumnValue() {
      var pair = currentDate.value.split(':');
      var values = [props.formatter('hour', pair[0]), props.formatter('minute', pair[1])];
      nextTick(function () {
        picker.value.setValues(values);
      });
    };

    var updateInnerValue = function updateInnerValue() {
      var _picker$value$getInde = picker.value.getIndexes(),
          hourIndex = _picker$value$getInde[0],
          minuteIndex = _picker$value$getInde[1];

      var _originColumns$value = originColumns.value,
          hourColumn = _originColumns$value[0],
          minuteColumn = _originColumns$value[1];
      var hour = hourColumn.values[hourIndex] || hourColumn.values[0];
      var minute = minuteColumn.values[minuteIndex] || minuteColumn.values[0];
      currentDate.value = formatValue(hour + ":" + minute);
      updateColumnValue();
    };

    var onConfirm = function onConfirm() {
      emit('confirm', currentDate.value);
    };

    var onCancel = function onCancel() {
      emit('cancel');
    };

    var onChange = function onChange() {
      updateInnerValue();
      nextTick(function () {
        nextTick(function () {
          emit('change', currentDate.value);
        });
      });
    };

    onMounted(function () {
      updateColumnValue();
      nextTick(updateInnerValue);
    });
    watch(columns, updateColumnValue);
    watch([function () {
      return props.filter;
    }, function () {
      return props.minHour;
    }, function () {
      return props.maxHour;
    }, function () {
      return props.minMinute;
    }, function () {
      return props.maxMinute;
    }], updateInnerValue);
    watch(currentDate, function (value) {
      emit('update:modelValue', value);
    });
    watch(function () {
      return props.modelValue;
    }, function (value) {
      value = formatValue(value);

      if (value !== currentDate.value) {
        currentDate.value = value;
        updateColumnValue();
      }
    });
    useExpose({
      getPicker: function getPicker() {
        return picker.value;
      }
    });
    return function () {
      return _createVNode(Picker, _mergeProps({
        "ref": picker,
        "columns": columns.value,
        "readonly": props.readonly,
        "onChange": onChange,
        "onCancel": onCancel,
        "onConfirm": onConfirm
      }, pick(props, Object.keys(pickerProps))), _extends({}, slots));
    };
  }
});