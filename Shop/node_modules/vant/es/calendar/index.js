import { isVNode as _isVNode } from "vue";
import { resolveDirective as _resolveDirective } from "vue";
import { createVNode as _createVNode } from "vue";
import { mergeProps as _mergeProps } from "vue";
import { ref, watch, reactive, computed } from 'vue'; // Utils

import { pick, getScrollTop } from '../utils';
import { isDate } from '../utils/validate/date';
import { t, bem, copyDate, copyDates, getPrevDay, getNextDay, compareDay, calcDateNum, compareMonth, createComponent, getDayByOffset } from './utils'; // Composition

import { raf, useRect, onMountedOrActivated } from '@vant/use';
import { useRefs } from '../composables/use-refs';
import { useExpose } from '../composables/use-expose'; // Components

import Popup from '../popup';
import Button from '../button';
import Toast from '../toast';
import Month from './components/Month';
import Header from './components/Header';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

export default createComponent({
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
      validator: isDate,
      default: function _default() {
        return new Date();
      }
    },
    maxDate: {
      type: Date,
      validator: isDate,
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

      if (compareDay(date, minDate) === -1) {
        return minDate;
      }

      if (compareDay(date, maxDate) === 1) {
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

        var start = limitDateRange(defaultDate[0] || now, minDate, getPrevDay(maxDate));
        var end = limitDateRange(defaultDate[1] || now, getNextDay(minDate));
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
    var bodyRef = ref();
    var state = reactive({
      subtitle: '',
      currentDate: getInitialDate()
    });

    var _useRefs = useRefs(),
        monthRefs = _useRefs[0],
        setMonthRefs = _useRefs[1];

    var dayOffset = computed(function () {
      return props.firstDayOfWeek ? props.firstDayOfWeek % 7 : 0;
    });
    var months = computed(function () {
      var months = [];
      var cursor = new Date(props.minDate);
      cursor.setDate(1);

      do {
        months.push(new Date(cursor));
        cursor.setMonth(cursor.getMonth() + 1);
      } while (compareMonth(cursor, props.maxDate) !== 1);

      return months;
    });
    var buttonDisabled = computed(function () {
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
      var top = getScrollTop(bodyRef.value);
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
      raf(function () {
        months.value.some(function (month, index) {
          if (compareMonth(month, targetDate) === 0) {
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
        raf(onScroll);
      }
    };

    var init = function init() {
      if (props.poppable && !props.show) {
        return;
      }

      raf(function () {
        // add Math.floor to avoid decimal height issues
        // https://github.com/youzan/vant/issues/5640
        bodyHeight = Math.floor(useRect(bodyRef).height);
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

      if (maxRange && calcDateNum(date) > maxRange) {
        Toast(rangePrompt || t('rangePrompt', maxRange));
        return false;
      }

      return true;
    };

    var onConfirm = function onConfirm() {
      emit('confirm', copyDates(state.currentDate));
    };

    var select = function select(date, complete) {
      var setCurrentDate = function setCurrentDate(date) {
        state.currentDate = date;
        emit('select', copyDates(state.currentDate));
      };

      if (complete && props.type === 'range') {
        var valid = checkRange(date);

        if (!valid) {
          // auto selected to max range if showConfirm
          if (props.showConfirm) {
            setCurrentDate([date[0], getDayByOffset(date[0], props.maxRange - 1)]);
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
          var compareToStart = compareDay(date, startDay);

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
          var equal = compareDay(dateItem, date) === 0;

          if (equal) {
            selectedIndex = index;
          }

          return equal;
        });

        if (selected) {
          var _currentDate$splice = currentDate.splice(selectedIndex, 1),
              unselectedDate = _currentDate$splice[0];

          emit('unselect', copyDate(unselectedDate));
        } else if (props.maxRange && currentDate.length >= props.maxRange) {
          Toast(props.rangePrompt || t('rangePrompt', props.maxRange));
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
      return _createVNode(Month, _mergeProps({
        "ref": setMonthRefs(index),
        "date": date,
        "currentDate": state.currentDate,
        "showMonthTitle": showMonthTitle,
        "firstDayOfWeek": dayOffset.value
      }, pick(props, ['type', 'color', 'minDate', 'maxDate', 'showMark', 'formatter', 'rowHeight', 'lazyRender', 'showSubtitle', 'allowSameDay']), {
        "onClick": onClickDay
      }), null);
    };

    var renderFooterButton = function renderFooterButton() {
      if (slots.footer) {
        return slots.footer();
      }

      if (props.showConfirm) {
        var text = buttonDisabled.value ? props.confirmDisabledText : props.confirmText;
        return _createVNode(Button, {
          "round": true,
          "block": true,
          "type": "danger",
          "color": props.color,
          "class": bem('confirm'),
          "disabled": buttonDisabled.value,
          "nativeType": "button",
          "onClick": onConfirm
        }, {
          default: function _default() {
            return [text || t('confirm')];
          }
        });
      }
    };

    var renderFooter = function renderFooter() {
      return _createVNode("div", {
        "class": bem('footer', {
          unfit: !props.safeAreaInsetBottom
        })
      }, [renderFooterButton()]);
    };

    var renderCalendar = function renderCalendar() {
      return _createVNode("div", {
        "class": bem()
      }, [_createVNode(Header, {
        "title": props.title,
        "showTitle": props.showTitle,
        "subtitle": state.subtitle,
        "showSubtitle": props.showSubtitle,
        "firstDayOfWeek": dayOffset.value
      }, {
        title: slots.title
      }), _createVNode("div", {
        "ref": bodyRef,
        "class": bem('body'),
        "onScroll": onScroll
      }, [months.value.map(renderMonth)]), renderFooter()]);
    };

    watch(function () {
      return props.show;
    }, init);
    watch([function () {
      return props.type;
    }, function () {
      return props.minDate;
    }, function () {
      return props.maxDate;
    }], reset);
    watch(function () {
      return props.defaultDate;
    }, function (value) {
      state.currentDate = value;
      scrollIntoView();
    });
    useExpose({
      reset: reset
    });
    onMountedOrActivated(init);
    return function () {
      if (props.poppable) {
        var _slot;

        return _createVNode(Popup, _mergeProps({
          "show": props.show,
          "class": bem('popup'),
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