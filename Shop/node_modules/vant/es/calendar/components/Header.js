import { createVNode as _createVNode } from "vue";
import { isVNode as _isVNode } from "vue";
import { createNamespace } from '../../utils';
import { t, bem } from '../utils';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('calendar-header'),
    createComponent = _createNamespace[0];

export default createComponent({
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
        var text = props.title || t('title');
        var title = slots.title ? slots.title() : text;
        return _createVNode("div", {
          "class": bem('header-title')
        }, _isSlot(title) ? title : {
          default: function _default() {
            return [title];
          }
        });
      }
    };

    var renderSubtitle = function renderSubtitle() {
      if (props.showSubtitle) {
        return _createVNode("div", {
          "class": bem('header-subtitle')
        }, [props.subtitle]);
      }
    };

    var renderWeekDays = function renderWeekDays() {
      var firstDayOfWeek = props.firstDayOfWeek;
      var weekdays = t('weekdays');
      var renderWeekDays = [].concat(weekdays.slice(firstDayOfWeek, 7), weekdays.slice(0, firstDayOfWeek));
      return _createVNode("div", {
        "class": bem('weekdays')
      }, [renderWeekDays.map(function (text) {
        return _createVNode("span", {
          "class": bem('weekday')
        }, _isSlot(text) ? text : {
          default: function _default() {
            return [text];
          }
        });
      })]);
    };

    return function () {
      return _createVNode("div", {
        "class": bem('header')
      }, [renderTitle(), renderSubtitle(), renderWeekDays()]);
    };
  }
});