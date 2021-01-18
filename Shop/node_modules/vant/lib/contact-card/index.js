"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _cell = _interopRequireDefault(require("../cell"));

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('contact-card'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var _default2 = createComponent({
  props: {
    tel: String,
    name: String,
    addText: String,
    editable: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  emits: ['click'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit;

    var onClick = function onClick(event) {
      if (props.editable) {
        emit('click', event);
      }
    };

    var renderContent = function renderContent() {
      if (props.type === 'add') {
        return props.addText || t('addText');
      }

      return [(0, _vue.createVNode)("div", null, [t('name') + "\uFF1A" + props.name]), (0, _vue.createVNode)("div", null, [t('tel') + "\uFF1A" + props.tel])];
    };

    return function () {
      var _slot;

      return (0, _vue.createVNode)(_cell.default, {
        "center": true,
        "icon": props.type === 'edit' ? 'contact' : 'add-square',
        "class": bem([props.type]),
        "border": false,
        "isLink": props.editable,
        "valueClass": bem('value'),
        "onClick": onClick
      }, _isSlot(_slot = renderContent()) ? _slot : {
        default: function _default() {
          return [_slot];
        }
      });
    };
  }
});

exports.default = _default2;