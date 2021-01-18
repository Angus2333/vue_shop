"use strict";

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../../utils");

var _utils2 = require("../utils");

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('calendar-header'),
    createComponent = _createNamespace[0];

var _default2 = createComponent({
  props: {
    title: String,
    subtitle: String,
    showTitle: Boolean,
    showSubtitle: Boolean,
    firstDayOfWeek: Number
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;

    var renderTitle = function renderTitle() {
      if (props.showTitle) {
        var text = props.title || (0, _utils2.t)('title');
        var title = slots.title ? slots.title() : text;
        return (0, _vue.createVNode)("div", {
          "class": (0, _utils2.bem)('header-title')
        }, _isSlot(title) ? title : {
          default: function _default() {
            return [title];
          }
        });
      }
    };

    var renderSubtitle = function renderSubtitle() {
      if (props.showSubtitle) {
        return (0, _vue.createVNode)("div", {
          "class": (0, _utils2.bem)('header-subtitle')
        }, [props.subtitle]);
      }
    };

    var renderWeekDays = function renderWeekDays() {
      var firstDayOfWeek = props.firstDayOfWeek;
      var weekdays = (0, _utils2.t)('weekdays');
      var renderWeekDays = [].concat(weekdays.slice(firstDayOfWeek, 7), weekdays.slice(0, firstDayOfWeek));
      return (0, _vue.createVNode)("div", {
        "class": (0, _utils2.bem)('weekdays')
      }, [renderWeekDays.map(function (text) {
        return (0, _vue.createVNode)("span", {
          "class": (0, _utils2.bem)('weekday')
        }, _isSlot(text) ? text : {
          default: function _default() {
            return [text];
          }
        });
      })]);
    };

    return function () {
      return (0, _vue.createVNode)("div", {
        "class": (0, _utils2.bem)('header')
      }, [renderTitle(), renderSubtitle(), renderWeekDays()]);
    };
  }
});

exports.default = _default2;