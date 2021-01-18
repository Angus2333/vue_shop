"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _date = require("../utils/validate/date");

var _utils2 = require("./utils");

var _use = require("@vant/use");

var _useRefs2 = require("../composables/use-refs");

var _useExpose = require("../composables/use-expose");

var _popup = _interopRequireDefault(require("../popup"));

var _button = _interopRequireDefault(require("../button"));

var _toast = _interopRequireDefault(require("../toast"));

var _Month = _interopRequireDefault(require("./components/Month"));

var _Header = _interopRequireDefault(require("./components/Header"));

// Utils
// Composition
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _default2 = (0, _utils2.createComponent)({
  props: {
    show: Boolean,
    title: String,
    color: String,
    readonly: Boolean,
    teleport: [String, Object],
    formatter: Function,
    rowHeight: [Number, String],
    confirmText: String,
    rangePrompt: String,
    defaultDate: [Date, Array],
    allowSameDay: Boolean,
    confirmDisabledText: String,
    type: {
      type: String,
      default: 'single'
    },
    round: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      default: 'bottom'
    },
    poppable: {
      type: Boolean,
      default: true
    },
    maxRange: {
      type: [Number, String],
      default: null
    },
    lazyRender: {
      type: Boolean,
      default: true
    },
    showMark: {
      type: Boolean,
      default: true
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    showConfirm: {
      type: Boolean,
      default: true
    },
    showSubtitle: {
      type: Boolean,
      default: true
    },
    closeOnPopstate: {
      type: Boolean,
      default: true
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: true
    },
    minDate: {
      type: Date,
      validator: _date.isDate,
      default: function _default() {
        return new Date();
      }
    },
    maxDate: {
      type: Date,
      validator: _date.isDate,
      default: function _default() {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
      }
    },
    firstDayOfWeek: {
      type: [Number, String],
      default: 0,
      validator: function validator(val) {
        return val >= 0 && val <= 6;
      }
    }
  },
  emits: ['select', 'confirm', 'unselect', 'month-show', 'update:show'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var limitDateRange = function limitDateRange(date, minDate, maxDate) {
      if (minDate === void 0) {
        minDate = props.minDate;
      }

      if (maxDate === void 0) {
        maxDate = props.maxDate;
      }

      if ((0, _utils2.compareDay)(date, minDate) === -1) {
        return minDate;
      }

      if ((0, _utils2.compareDay)(date, maxDate) === 1) {
        return maxDate;
      }

      return date;
    };

    var getInitialDate = function getInitialDate(defaultDate) {
      if (defaultDate === void 0) {
        defaultDate = props.defaultDate;
      }

      var type = props.type,
          minDate = props.minDate,
          maxDate = props.maxDate;

      if (defaultDate === null) {
        return defaultDate;
      }

      var now = new Date();

      if (type === 'range') {
        if (!Array.isArray(defaultDate)) {
          defaultDate = [];
        }

        var start = limitDateRange(defaultDate[0] || now, minDate, (0, _utils2.getPrevDay)(maxDate));
        var end = limitDateRange(defaultDate[1] || now, (0, _utils2.getNextDay)(minDate));
        return [start, end];
      }

      if (type === 'multiple') {
        if (Array.isArray(defaultDate)) {
          return defaultDate.map(function (date) {
            return limitDateRange(date);
          });
        }

        return [limitDateRange(now)];
      }

      if (!defaultDate || Array.isArray(defaultDate)) {
        defaultDate = now;
      }

      return limitDateRange(defaultDate);
    };

    var bodyHeight;
    var bodyRef = (0, _vue.ref)();
    var state = (0, _vue.reactive)({
      subtitle: '',
      currentDate: getInitialDate()
    });

    var _useRefs = (0, _useRefs2.useRefs)(),
        monthRefs = _useRefs[0],
        setMonthRefs = _useRefs[1];

    var dayOffset = (0, _vue.computed)(function () {
      return props.firstDayOfWeek ? props.firstDayOfWeek % 7 : 0;
    });
    var months = (0, _vue.computed)(function () {
      var months = [];
      var cursor = new Date(props.minDate);
      cursor.setDate(1);

      do {
        months.push(new Date(cursor));
        cursor.setMonth(cursor.getMonth() + 1);
      } while ((0, _utils2.compareMonth)(cursor, props.maxDate) !== 1);

      return months;
    });
    var buttonDisabled = (0, _vue.computed)(function () {
      var currentDate = state.currentDate;

      if (currentDate) {
        if (props.type === 'range') {
          return !currentDate[0] || !currentDate[1];
        }

        if (props.type === 'multiple') {
          return !currentDate.length;
        }
      }

      return !currentDate;
    }); // calculate the position of the elements
    // and find the elements that needs to be rendered

    var onScroll = function onScroll() {
      var top = (0, _utils.getScrollTop)(bodyRef.value);
      var bottom = top + bodyHeight;
      var heights = months.value.map(function (item, index) {
        return monthRefs.value[index].getHeight();
      });
      var heightSum = heights.reduce(function (a, b) {
        return a + b;
      }, 0); // iOS scroll bounce may exceed the range

      if (bottom > heightSum && top > 0) {
        return;
      }

      var height = 0;
      var currentMonth;
      var visibleRange = [-1, -1];

      for (var i = 0; i < months.value.length; i++) {
        var month = monthRefs.value[i];
        var visible = height <= bottom && height + heights[i] >= top;

        if (visible) {
          visibleRange[1] = i;

          if (!currentMonth) {
            currentMonth = month;
            visibleRange[0] = i;
          }

          if (!monthRefs.value[i].showed) {
            monthRefs.value[i].showed = true;
            emit('month-show', {
              date: month.date,
              title: month.title
            });
          }
        }

        height += heights[i];
      }

      months.value.forEach(function (month, index) {
        var visible = index >= visibleRange[0] - 1 && index <= visibleRange[1] + 1;
        monthRefs.value[index].setVisible(visible);
      });
      /* istanbul ignore else */

      if (currentMonth) {
        state.subtitle = currentMonth.getTitle();
      }
    };

    var scrollToDate = function scrollToDate(targetDate) {
      (0, _use.raf)(function () {
        months.value.some(function (month, index) {
          if ((0, _utils2.compareMonth)(month, targetDate) === 0) {
            monthRefs.value[index].scrollIntoView(bodyRef.value);
            return true;
          }

          return false;
        });
        onScroll();
      });
    }; // scroll to current month


    var scrollIntoView = function scrollIntoView() {
      if (props.poppable && !props.show) {
        return;
      }

      var currentDate = state.currentDate;

      if (currentDate) {
        var targetDate = props.type === 'single' ? currentDate : currentDate[0];
        scrollToDate(targetDate);
      } else {
        (0, _use.raf)(onScroll);
      }
    };

    var init = function init() {
      if (props.poppable && !props.show) {
        return;
      }

      (0, _use.raf)(function () {
        // add Math.floor to avoid decimal height issues
        // https://github.com/youzan/vant/issues/5640
        bodyHeight = Math.floor((0, _use.useRect)(bodyRef).height);
        scrollIntoView();
      });
    };

    var reset = function reset() {
      state.currentDate = getInitialDate(state.currentDate);
      scrollIntoView();
    };

    var checkRange = function checkRange(date) {
      var maxRange = props.maxRange,
          rangePrompt = props.rangePrompt;

      if (maxRange && (0, _utils2.calcDateNum)(date) > maxRange) {
        (0, _toast.default)(rangePrompt || (0, _utils2.t)('rangePrompt', maxRange));
        return false;
      }

      return true;
    };

    var onConfirm = function onConfirm() {
      emit('confirm', (0, _utils2.copyDates)(state.currentDate));
    };

    var select = function select(date, complete) {
      var setCurrentDate = function setCurrentDate(date) {
        state.currentDate = date;
        emit('select', (0, _utils2.copyDates)(state.currentDate));
      };

      if (complete && props.type === 'range') {
        var valid = checkRange(date);

        if (!valid) {
          // auto selected to max range if showConfirm
          if (props.showConfirm) {
            setCurrentDate([date[0], (0, _utils2.getDayByOffset)(date[0], props.maxRange - 1)]);
          } else {
            setCurrentDate(date);
          }

          return;
        }
      }

      setCurrentDate(date);

      if (complete && !props.showConfirm) {
        onConfirm();
      }
    };

    var onClickDay = function onClickDay(item) {
      if (props.readonly) {
        return;
      }

      var date = item.date;
      var type = props.type;
      var currentDate = state.currentDate;

      if (type === 'range') {
        if (!currentDate) {
          select([date, null]);
          return;
        }

        var startDay = currentDate[0],
            endDay = currentDate[1];

        if (startDay && !endDay) {
          var compareToStart = (0, _utils2.compareDay)(date, startDay);

          if (compareToStart === 1) {
            select([startDay, date], true);
          } else if (compareToStart === -1) {
            select([date, null]);
          } else if (props.allowSameDay) {
            select([date, date], true);
          }
        } else {
          select([date, null]);
        }
      } else if (type === 'multiple') {
        if (!currentDate) {
          select([date]);
          return;
        }

        var selectedIndex;
        var selected = state.currentDate.some(function (dateItem, index) {
          var equal = (0, _utils2.compareDay)(dateItem, date) === 0;

          if (equal) {
            selectedIndex = index;
          }

          return equal;
        });

        if (selected) {
          var _currentDate$splice = currentDate.splice(selectedIndex, 1),
              unselectedDate = _currentDate$splice[0];

          emit('unselect', (0, _utils2.copyDate)(unselectedDate));
        } else if (props.maxRange && currentDate.length >= props.maxRange) {
          (0, _toast.default)(props.rangePrompt || (0, _utils2.t)('rangePrompt', props.maxRange));
        } else {
          select([].concat(currentDate, [date]));
        }
      } else {
        select(date, true);
      }
    };

    var togglePopup = function togglePopup(val) {
      emit('update:show', val);
    };

    var renderMonth = function renderMonth(date, index) {
      var showMonthTitle = index !== 0 || !props.showSubtitle;
      return (0, _vue.createVNode)(_Month.default, (0, _vue.mergeProps)({
        "ref": setMonthRefs(index),
        "date": date,
        "currentDate": state.currentDate,
        "showMonthTitle": showMonthTitle,
        "firstDayOfWeek": dayOffset.value
      }, (0, _utils.pick)(props, ['type', 'color', 'minDate', 'maxDate', 'showMark', 'formatter', 'rowHeight', 'lazyRender', 'showSubtitle', 'allowSameDay']), {
        "onClick": onClickDay
      }), null);
    };

    var renderFooterButton = function renderFooterButton() {
      if (slots.footer) {
        return slots.footer();
      }

      if (props.showConfirm) {
        var text = buttonDisabled.value ? props.confirmDisabledText : props.confirmText;
        return (0, _vue.createVNode)(_button.default, {
          "round": true,
          "block": true,
          "type": "danger",
          "color": props.color,
          "class": (0, _utils2.bem)('confirm'),
          "disabled": buttonDisabled.value,
          "nativeType": "button",
          "onClick": onConfirm
        }, {
          default: function _default() {
            return [text || (0, _utils2.t)('confirm')];
          }
        });
      }
    };

    var renderFooter = function renderFooter() {
      return (0, _vue.createVNode)("div", {
        "class": (0, _utils2.bem)('footer', {
          unfit: !props.safeAreaInsetBottom
        })
      }, [renderFooterButton()]);
    };

    var renderCalendar = function renderCalendar() {
      return (0, _vue.createVNode)("div", {
        "class": (0, _utils2.bem)()
      }, [(0, _vue.createVNode)(_Header.default, {
        "title": props.title,
        "showTitle": props.showTitle,
        "subtitle": state.subtitle,
        "showSubtitle": props.showSubtitle,
        "firstDayOfWeek": dayOffset.value
      }, {
        title: slots.title
      }), (0, _vue.createVNode)("div", {
        "ref": bodyRef,
        "class": (0, _utils2.bem)('body'),
        "onScroll": onScroll
      }, [months.value.map(renderMonth)]), renderFooter()]);
    };

    (0, _vue.watch)(function () {
      return props.show;
    }, init);
    (0, _vue.watch)([function () {
      return props.type;
    }, function () {
      return props.minDate;
    }, function () {
      return props.maxDate;
    }], reset);
    (0, _vue.watch)(function () {
      return props.defaultDate;
    }, function (value) {
      state.currentDate = value;
      scrollIntoView();
    });
    (0, _useExpose.useExpose)({
      reset: reset
    });
    (0, _use.onMountedOrActivated)(init);
    return function () {
      if (props.poppable) {
        var _slot;

        return (0, _vue.createVNode)(_popup.default, (0, _vue.mergeProps)({
          "show": props.show,
          "class": (0, _utils2.bem)('popup'),
          "round": props.round,
          "position": props.position,
          "closeable": props.showTitle || props.showSubtitle,
          "teleport": props.teleport,
          "closeOnPopstate": props.closeOnPopstate,
          "closeOnClickOverlay": props.closeOnClickOverlay
        }, {
          'onUpdate:show': togglePopup
        }), _isSlot(_slot = renderCalendar()) ? _slot : {
          default: function _default() {
            return [_slot];
          }
        });
      }

      return renderCalendar();
    };
  }
});

exports.default = _default2;