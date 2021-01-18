"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _date = require("../utils/validate/date");

var _utils = require("../utils");

var _utils2 = require("./utils");

var _useExpose = require("../composables/use-expose");

var _picker = _interopRequireDefault(require("../picker"));

var _shared = require("../picker/shared");

// Utils
// Composition
// Components
var currentYear = new Date().getFullYear();

var _createNamespace = (0, _utils.createNamespace)('date-picker'),
    createComponent = _createNamespace[0];

var _default2 = createComponent({
  props: (0, _extends2.default)({}, _utils2.sharedProps, {
    type: {
      type: String,
      default: 'datetime'
    },
    minDate: {
      type: Date,
      default: function _default() {
        return new Date(currentYear - 10, 0, 1);
      },
      validator: _date.isDate
    },
    maxDate: {
      type: Date,
      default: function _default() {
        return new Date(currentYear + 10, 11, 31);
      },
      validator: _date.isDate
    }
  }),
  emits: ['confirm', 'cancel', 'change', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var formatValue = function formatValue(value) {
      if (!(0, _date.isDate)(value)) {
        value = props.minDate;
      }

      value = Math.max(value, props.minDate.getTime());
      value = Math.min(value, props.maxDate.getTime());
      return new Date(value);
    };

    var picker = (0, _vue.ref)();
    var currentDate = (0, _vue.ref)(formatValue(props.modelValue));

    var getBoundary = function getBoundary(type, value) {
      var _ref2;

      var boundary = props[type + "Date"];
      var year = boundary.getFullYear();
      var month = 1;
      var date = 1;
      var hour = 0;
      var minute = 0;

      if (type === 'max') {
        month = 12;
        date = (0, _utils2.getMonthEndDay)(value.getFullYear(), value.getMonth() + 1);
        hour = 23;
        minute = 59;
      }

      if (value.getFullYear() === year) {
        month = boundary.getMonth() + 1;

        if (value.getMonth() + 1 === month) {
          date = boundary.getDate();

          if (value.getDate() === date) {
            hour = boundary.getHours();

            if (value.getHours() === hour) {
              minute = boundary.getMinutes();
            }
          }
        }
      }

      return _ref2 = {}, _ref2[type + "Year"] = year, _ref2[type + "Month"] = month, _ref2[type + "Date"] = date, _ref2[type + "Hour"] = hour, _ref2[type + "Minute"] = minute, _ref2;
    };

    var ranges = (0, _vue.computed)(function () {
      var _getBoundary = getBoundary('max', currentDate.value),
          maxYear = _getBoundary.maxYear,
          maxDate = _getBoundary.maxDate,
          maxMonth = _getBoundary.maxMonth,
          maxHour = _getBoundary.maxHour,
          maxMinute = _getBoundary.maxMinute;

      var _getBoundary2 = getBoundary('min', currentDate.value),
          minYear = _getBoundary2.minYear,
          minDate = _getBoundary2.minDate,
          minMonth = _getBoundary2.minMonth,
          minHour = _getBoundary2.minHour,
          minMinute = _getBoundary2.minMinute;

      var result = [{
        type: 'year',
        range: [minYear, maxYear]
      }, {
        type: 'month',
        range: [minMonth, maxMonth]
      }, {
        type: 'day',
        range: [minDate, maxDate]
      }, {
        type: 'hour',
        range: [minHour, maxHour]
      }, {
        type: 'minute',
        range: [minMinute, maxMinute]
      }];

      switch (props.type) {
        case 'date':
          result = result.slice(0, 3);
          break;

        case 'year-month':
          result = result.slice(0, 2);
          break;

        case 'month-day':
          result = result.slice(1, 3);
          break;

        case 'datehour':
          result = result.slice(0, 4);
          break;
      }

      if (props.columnsOrder) {
        var columnsOrder = props.columnsOrder.concat(result.map(function (column) {
          return column.type;
        }));
        result.sort(function (a, b) {
          return columnsOrder.indexOf(a.type) - columnsOrder.indexOf(b.type);
        });
      }

      return result;
    });
    var originColumns = (0, _vue.computed)(function () {
      return ranges.value.map(function (_ref3) {
        var type = _ref3.type,
            rangeArr = _ref3.range;
        var values = (0, _utils2.times)(rangeArr[1] - rangeArr[0] + 1, function (index) {
          var value = (0, _utils.padZero)(rangeArr[0] + index);
          return value;
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
      var value = currentDate.value;
      var formatter = props.formatter;
      var values = originColumns.value.map(function (column) {
        switch (column.type) {
          case 'year':
            return formatter('year', "" + value.getFullYear());

          case 'month':
            return formatter('month', (0, _utils.padZero)(value.getMonth() + 1));

          case 'day':
            return formatter('day', (0, _utils.padZero)(value.getDate()));

          case 'hour':
            return formatter('hour', (0, _utils.padZero)(value.getHours()));

          case 'minute':
            return formatter('minute', (0, _utils.padZero)(value.getMinutes()));

          default:
            // no default
            return null;
        }
      });
      (0, _vue.nextTick)(function () {
        picker.value.setValues(values);
      });
    };

    var updateInnerValue = function updateInnerValue() {
      var type = props.type;
      var indexes = picker.value.getIndexes();

      var getValue = function getValue(type) {
        var index = 0;
        originColumns.value.forEach(function (column, columnIndex) {
          if (type === column.type) {
            index = columnIndex;
          }
        });
        var values = originColumns.value[index].values;
        return (0, _utils2.getTrueValue)(values[indexes[index]]);
      };

      var year;
      var month;
      var day;

      if (type === 'month-day') {
        year = currentDate.value.getFullYear();
        month = getValue('month');
        day = getValue('day');
      } else {
        year = getValue('year');
        month = getValue('month');
        day = type === 'year-month' ? 1 : getValue('day');
      }

      var maxDay = (0, _utils2.getMonthEndDay)(year, month);
      day = day > maxDay ? maxDay : day;
      var hour = 0;
      var minute = 0;

      if (type === 'datehour') {
        hour = getValue('hour');
      }

      if (type === 'datetime') {
        hour = getValue('hour');
        minute = getValue('minute');
      }

      var value = new Date(year, month - 1, day, hour, minute);
      currentDate.value = formatValue(value);
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
    (0, _vue.watch)(currentDate, function (value) {
      emit('update:modelValue', value);
    });
    (0, _vue.watch)([function () {
      return props.filter;
    }, function () {
      return props.minDate;
    }, function () {
      return props.maxDate;
    }], updateInnerValue);
    (0, _vue.watch)(function () {
      return props.modelValue;
    }, function (value) {
      value = formatValue(value);

      if (value.valueOf() !== currentDate.value.valueOf()) {
        currentDate.value = value;
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

exports.default = _default2;