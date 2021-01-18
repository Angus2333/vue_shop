"use strict";

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../../utils");

var _utils2 = require("../utils");

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('calendar-day'),
    createComponent = _createNamespace[0];

var _default2 = createComponent({
  props: {
    item: Object,
    color: String,
    index: Number,
    offset: Number,
    rowHeight: String
  },
  emits: ['click'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit;
    var style = (0, _vue.computed)(function () {
      var item = props.item,
          index = props.index,
          color = props.color,
          offset = props.offset,
          rowHeight = props.rowHeight;
      var style = {
        height: rowHeight
      };

      if (item.type === 'placeholder') {
        style.width = '100%';
        return style;
      }

      if (index === 0) {
        style.marginLeft = 100 * offset / 7 + "%";
      }

      if (color) {
        switch (item.type) {
          case 'end':
          case 'start':
          case 'start-end':
          case 'multiple-middle':
          case 'multiple-selected':
            style.background = color;
            break;

          case 'middle':
            style.color = color;
            break;
        }
      }

      return style;
    });

    var onClick = function onClick() {
      if (props.item.type !== 'disabled') {
        emit('click', props.item);
      }
    };

    var renderContent = function renderContent() {
      var item = props.item,
          color = props.color,
          rowHeight = props.rowHeight;
      var type = item.type,
          text = item.text,
          topInfo = item.topInfo,
          bottomInfo = item.bottomInfo;
      var TopInfo = topInfo && (0, _vue.createVNode)("div", {
        "class": (0, _utils2.bem)('top-info')
      }, _isSlot(topInfo) ? topInfo : {
        default: function _default() {
          return [topInfo];
        }
      });
      var BottomInfo = bottomInfo && (0, _vue.createVNode)("div", {
        "class": (0, _utils2.bem)('bottom-info')
      }, _isSlot(bottomInfo) ? bottomInfo : {
        default: function _default() {
          return [bottomInfo];
        }
      });
      var Nodes = [TopInfo, text, BottomInfo];

      if (type === 'selected') {
        return (0, _vue.createVNode)("div", {
          "class": (0, _utils2.bem)('selected-day'),
          "style": {
            width: rowHeight,
            height: rowHeight,
            background: color
          }
        }, _isSlot(Nodes) ? Nodes : {
          default: function _default() {
            return [Nodes];
          }
        });
      }

      return Nodes;
    };

    return function () {
      var _props$item = props.item,
          type = _props$item.type,
          className = _props$item.className;
      return (0, _vue.createVNode)("div", {
        "role": "gridcell",
        "style": style.value,
        "class": [(0, _utils2.bem)('day', type), className],
        "tabindex": type === 'disabled' ? null : -1,
        "onClick": onClick
      }, [renderContent()]);
    };
  }
});

exports.default = _default2;