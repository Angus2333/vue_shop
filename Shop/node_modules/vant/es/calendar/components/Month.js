import { createVNode as _createVNode } from "vue";
import { ref, computed } from 'vue'; // Utils

import { addUnit, setScrollTop, createNamespace } from '../../utils';
import { getMonthEndDay } from '../../datetime-picker/utils';
import { t, bem, compareDay, getPrevDay, getNextDay, formatMonthTitle } from '../utils'; // Composition

import { useToggle } from '@vant/use';
import { useExpose } from '../../composables/use-expose';
import { useHeight } from '../../composables/use-height'; // Components

import Day from './Day';

var _createNamespace = createNamespace('calendar-month'),
    createComponent = _createNamespace[0];

export default createComponent({
  props: {
    date: Date,
    type: String,
    color: String,
    minDate: Date,
    maxDate: Date,
    showMark: Boolean,
    rowHeight: [Number, String],
    formatter: Function,
    lazyRender: Boolean,
    currentDate: [Date, Array],
    allowSameDay: Boolean,
    showSubtitle: Boolean,
    showMonthTitle: Boolean,
    firstDayOfWeek: Number
  },
  emits: ['click', 'update-height'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit;

    var _useToggle = useToggle(),
        visible = _useToggle[0],
        setVisible = _useToggle[1];

    var daysRef = ref();
    var monthRef = ref();
    var height = useHeight(monthRef);
    var title = computed(function () {
      return formatMonthTitle(props.date);
    });
    var rowHeight = computed(function () {
      return addUnit(props.rowHeight);
    });
    var offset = computed(function () {
      var realDay = props.date.getDay();

      if (props.firstDayOfWeek) {
        return (realDay + 7 - props.firstDayOfWeek) % 7;
      }

      return realDay;
    });
    var totalDay = computed(function () {
      return getMonthEndDay(props.date.getFullYear(), props.date.getMonth() + 1);
    });
    var shouldRender = computed(function () {
      return visible.value || !props.lazyRender;
    });

    var getTitle = function getTitle() {
      return title.value;
    };

    var scrollIntoView = function scrollIntoView(body) {
      var el = props.showSubtitle ? daysRef.value : monthRef.value;
      var scrollTop = el.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop;
      setScrollTop(body, scrollTop);
    };

    var getMultipleDayType = function getMultipleDayType(day) {
      var isSelected = function isSelected(date) {
        return props.currentDate.some(function (item) {
          return compareDay(item, date) === 0;
        });
      };

      if (isSelected(day)) {
        var prevDay = getPrevDay(day);
        var nextDay = getNextDay(day);
        var prevSelected = isSelected(prevDay);
        var nextSelected = isSelected(nextDay);

        if (prevSelected && nextSelected) {
          return 'multiple-middle';
        }

        if (prevSelected) {
          return 'end';
        }

        if (nextSelected) {
          return 'start';
        }

        return 'multiple-selected';
      }

      return '';
    };

    var getRangeDayType = function getRangeDayType(day) {
      var _props$currentDate = props.currentDate,
          startDay = _props$currentDate[0],
          endDay = _props$currentDate[1];

      if (!startDay) {
        return '';
      }

      var compareToStart = compareDay(day, startDay);

      if (!endDay) {
        return compareToStart === 0 ? 'start' : '';
      }

      var compareToEnd = compareDay(day, endDay);

      if (props.allowSameDay && compareToStart === 0 && compareToEnd === 0) {
        return 'start-end';
      }

      if (compareToStart === 0) {
        return 'start';
      }

      if (compareToEnd === 0) {
        return 'end';
      }

      if (compareToStart > 0 && compareToEnd < 0) {
        return 'middle';
      }
    };

    var getDayType = function getDayType(day) {
      var type = props.type,
          minDate = props.minDate,
          maxDate = props.maxDate,
          currentDate = props.currentDate;

      if (compareDay(day, minDate) < 0 || compareDay(day, maxDate) > 0) {
        return 'disabled';
      }

      if (currentDate === null) {
        return;
      }

      if (Array.isArray(currentDate)) {
        if (type === 'multiple') {
          return getMultipleDayType(day);
        }

        if (type === 'range') {
          return getRangeDayType(day);
        }
      } else if (type === 'single') {
        return compareDay(day, currentDate) === 0 ? 'selected' : '';
      }
    };

    var getBottomInfo = function getBottomInfo(dayType) {
      if (props.type === 'range') {
        if (dayType === 'start' || dayType === 'end') {
          return t(dayType);
        }

        if (dayType === 'start-end') {
          return t('startEnd');
        }
      }
    };

    var renderTitle = function renderTitle() {
      if (props.showMonthTitle) {
        return _createVNode("div", {
          "class": bem('month-title')
        }, [title.value]);
      }
    };

    var renderMark = function renderMark() {
      if (props.showMark && shouldRender.value) {
        return _createVNode("div", {
          "class": bem('month-mark')
        }, [props.date.getMonth() + 1]);
      }
    };

    var placeholders = computed(function () {
      var rows = [];
      var count = Math.ceil((totalDay.value + offset.value) / 7);

      for (var day = 1; day <= count; day++) {
        rows.push({
          type: 'placeholder'
        });
      }

      return rows;
    });
    var days = computed(function () {
      var days = [];
      var year = props.date.getFullYear();
      var month = props.date.getMonth();

      for (var day = 1; day <= totalDay.value; day++) {
        var date = new Date(year, month, day);
        var type = getDayType(date);
        var config = {
          date: date,
          type: type,
          text: day,
          bottomInfo: getBottomInfo(type)
        };

        if (props.formatter) {
          config = props.formatter(config);
        }

        days.push(config);
      }

      return days;
    });

    var renderDay = function renderDay(item, index) {
      return _createVNode(Day, {
        "item": item,
        "index": index,
        "color": props.color,
        "offset": offset.value,
        "rowHeight": rowHeight.value,
        "onClick": function onClick(item) {
          emit('click', item);
        }
      }, null);
    };

    var renderDays = function renderDays() {
      return _createVNode("div", {
        "ref": daysRef,
        "role": "grid",
        "class": bem('days')
      }, [renderMark(), (shouldRender.value ? days : placeholders).value.map(renderDay)]);
    };

    useExpose({
      getTitle: getTitle,
      getHeight: function getHeight() {
        return height.value;
      },
      setVisible: setVisible,
      scrollIntoView: scrollIntoView
    });
    return function () {
      return _createVNode("div", {
        "class": bem('month'),
        "ref": monthRef
      }, [renderTitle(), renderDays()]);
    };
  }
});