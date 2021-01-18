"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _vue = require("vue");

var _utils = require("../utils");

var _tag = _interopRequireDefault(require("../tag"));

var _icon = _interopRequireDefault(require("../icon"));

var _cell = _interopRequireDefault(require("../cell"));

var _radio = _interopRequireDefault(require("../radio"));

// Utils
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('address-item'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: {
    data: Object,
    disabled: Boolean,
    switchable: Boolean,
    defaultTagText: String
  },
  emits: ['edit', 'click', 'select'],
  setup: function setup(props, _ref) {
    var slots = _ref.slots,
        emit = _ref.emit;

    var onClick = function onClick() {
      if (props.switchable) {
        emit('select');
      }

      emit('click');
    };

    var renderRightIcon = function renderRightIcon() {
      return (0, _vue.createVNode)(_icon.default, {
        "name": "edit",
        "class": bem('edit'),
        "onClick": function onClick(event) {
          event.stopPropagation();
          emit('edit');
          emit('click');
        }
      }, null);
    };

    var renderTag = function renderTag() {
      if (props.data.isDefault && props.defaultTagText) {
        return (0, _vue.createVNode)(_tag.default, {
          "type": "danger",
          "round": true,
          "class": bem('tag')
        }, {
          default: function _default() {
            return [props.defaultTagText];
          }
        });
      }
    };

    var renderContent = function renderContent() {
      var data = props.data,
          disabled = props.disabled,
          switchable = props.switchable;
      var Info = [(0, _vue.createVNode)("div", {
        "class": bem('name')
      }, [data.name + " " + data.tel, renderTag()]), (0, _vue.createVNode)("div", {
        "class": bem('address')
      }, [data.address])];

      if (switchable && !disabled) {
        return (0, _vue.createVNode)(_radio.default, {
          "name": data.id,
          "iconSize": 18
        }, _isSlot(Info) ? Info : {
          default: function _default() {
            return [Info];
          }
        });
      }

      return Info;
    };

    return function () {
      var disabled = props.disabled;
      return (0, _vue.createVNode)("div", {
        "class": bem({
          disabled: disabled
        }),
        "onClick": onClick
      }, [(0, _vue.createVNode)(_cell.default, {
        "border": false,
        "valueClass": bem('value')
      }, {
        default: renderContent,
        'right-icon': renderRightIcon
      }), slots.bottom == null ? void 0 : slots.bottom((0, _extends2.default)({}, props.data, {
        disabled: disabled
      }))]);
    };
  }
});

exports.default = _default2;