"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _constant = require("../utils/constant");

var _tag = _interopRequireDefault(require("../tag"));

var _icon = _interopRequireDefault(require("../icon"));

var _cell = _interopRequireDefault(require("../cell"));

var _radio = _interopRequireDefault(require("../radio"));

var _button = _interopRequireDefault(require("../button"));

var _radioGroup = _interopRequireDefault(require("../radio-group"));

// Utils
// Components
var _createNamespace = (0, _utils.createNamespace)('contact-list'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var _default2 = createComponent({
  props: {
    list: Array,
    addText: String,
    modelValue: null,
    defaultTagText: String
  },
  emits: ['add', 'edit', 'select', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit;

    var renderItem = function renderItem(item, index) {
      var onClick = function onClick() {
        emit('update:modelValue', item.id);
        emit('select', item, index);
      };

      var renderRightIcon = function renderRightIcon() {
        return (0, _vue.createVNode)(_radio.default, {
          "name": item.id,
          "iconSize": 16,
          "checkedColor": _constant.RED
        }, null);
      };

      var renderEditIcon = function renderEditIcon() {
        return (0, _vue.createVNode)(_icon.default, {
          "name": "edit",
          "class": bem('edit'),
          "onClick": function onClick(event) {
            event.stopPropagation();
            emit('edit', item, index);
          }
        }, null);
      };

      var renderContent = function renderContent() {
        var nodes = [item.name + "\uFF0C" + item.tel];

        if (item.isDefault && props.defaultTagText) {
          nodes.push((0, _vue.createVNode)(_tag.default, {
            "type": "danger",
            "round": true,
            "class": bem('item-tag')
          }, {
            default: function _default() {
              return [props.defaultTagText];
            }
          }));
        }

        return nodes;
      };

      return (0, _vue.createVNode)(_cell.default, {
        "key": item.id,
        "isLink": true,
        "center": true,
        "class": bem('item'),
        "valueClass": bem('item-value'),
        "onClick": onClick
      }, {
        icon: renderEditIcon,
        default: renderContent,
        'right-icon': renderRightIcon
      });
    };

    return function () {
      return (0, _vue.createVNode)("div", {
        "class": bem()
      }, [(0, _vue.createVNode)(_radioGroup.default, {
        "modelValue": props.modelValue,
        "class": bem('group')
      }, {
        default: function _default() {
          return [props.list && props.list.map(renderItem)];
        }
      }), (0, _vue.createVNode)("div", {
        "class": bem('bottom')
      }, [(0, _vue.createVNode)(_button.default, {
        "round": true,
        "block": true,
        "type": "danger",
        "class": bem('add'),
        "text": props.addText || t('addText'),
        "onClick": function onClick() {
          emit('add');
        }
      }, null)])]);
    };
  }
});

exports.default = _default2;