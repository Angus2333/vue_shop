"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _utils2 = require("./utils");

var _useExpose = require("../composables/use-expose");

var _picker = _interopRequireDefault(require("../picker"));

var _shared = require("../picker/shared");

// Utils
// Composition
// Components
var _createNamespace = (0, _utils.createNamespace)('time-picker'),
    createComponent = _createNamespace[0];

var _default = createComponent({
  props: (0, _extends2.default)({}, _utils2.sharedProps, {
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
        value = (0, _utils.padZero)(minHour) + ":" + (0, _utils.padZero)(minMinute);
      }

      var _value$split = value.split(':'),
          hour = _value$split[0],
          minute = _value$split[1];

      hour = (0, _utils.padZero)((0, _utils.range)(hour, minHour, maxHour));
      minute = (0, _utils.padZero)((0, _utils.range)(minute, minMinute, maxMinute));
      return hour + ":" + minute;
    };

    var picker = (0, _vue.ref)();
    var currentDate = (0, _vue.ref)(formatValue(props.modelValue));
    var ranges = (0, _vue.computed)(function () {
      return [{
        type: 'hour',
        range: [+props.minHour, +props.maxHour]
      }, {
        type: 'minute',
        range: [+props.minMinute, +props.maxMinute]
      }];
    });
    var originColumns = (0, _vue.computed)(function () {
      return ranges.value.map(function (_ref2) {
        var type = _ref2.type,
            rangeArr = _ref2.range;
        var values = (0, _utils2.times)(rangeArr[1] - rangeArr[0] + 1, function (index) {
          return (0, _utils.padZero)(rangeArr[0] + index);
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
    var columns = (0, _vue.computed)(function () {
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
      (0, _vue.nextTick)(function () {
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
      (0, _vue.nextTick)(function () {
        (0, _vue.nextTick)(function () {
          emit('change', currentDate.value);
        });
      });
    };

    (0, _vue.onMounted)(function () {
      updateColumnValue();
      (0, _vue.nextTick)(updateInnerValue);
    });
    (0, _vue.watch)(columns, updateColumnValue);
    (0, _vue.watch)([function () {
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
    (0, _vue.watch)(currentDate, function (value) {
      emit('update:modelValue', value);
    });
    (0, _vue.watch)(function () {
      return props.modelValue;
    }, function (value) {
      value = formatValue(value);

      if (value !== currentDate.value) {
        currentDate.value = value;
        updateColumnValue();
      }
    });
    (0, _useExpose.useExpose)({
      getPicker: function getPicker() {
        return picker.value;
      }
    });
    return function () {
      return (0, _vue.createVNode)(_picker.default, (0, _vue.mergeProps)({
        "ref": picker,
        "columns": columns.value,
        "readonly": props.readonly,
        "onChange": onChange,
        "onCancel": onCancel,
        "onConfirm": onConfirm
      }, (0, _utils.pick)(props, Object.keys(_shared.pickerProps))), (0, _extends2.default)({}, slots));
    };
  }
});

exports.default = _default;