"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _button = _interopRequireDefault(require("../button"));

var _radioGroup = _interopRequireDefault(require("../radio-group"));

var _Item = _interopRequireDefault(require("./Item"));

// Utils
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('address-list'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var _default2 = createComponent({
  props: {
    list: Array,
    modelValue: [Number, String],
    disabledList: Array,
    disabledText: String,
    addButtonText: String,
    defaultTagText: String,
    switchable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['add', 'edit', 'select', 'click-item', 'edit-disabled', 'select-disabled', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var slots = _ref.slots,
        emit = _ref.emit;

    var renderItem = function renderItem(item, index, disabled) {
      var onEdit = function onEdit() {
        var name = disabled ? 'edit-disabled' : 'edit';
        emit(name, item, index);
      };

      var onClick = function onClick() {
        emit('click-item', item, index);
      };

      var onSelect = function onSelect() {
        var name = disabled ? 'select-disabled' : 'select';
        emit(name, item, index);

        if (!disabled) {
          emit('update:modelValue', item.id);
        }
      };

      return (0, _vue.createVNode)(_Item.default, {
        "key": item.id,
        "data": item,
        "disabled": disabled,
        "switchable": props.switchable,
        "defaultTagText": props.defaultTagText,
        "onEdit": onEdit,
        "onClick": onClick,
        "onSelect": onSelect
      }, {
        bottom: slots['item-bottom']
      });
    };

    var renderList = function renderList(list, disabled) {
      if (list) {
        return list.map(function (item, index) {
          return renderItem(item, index, disabled);
        });
      }
    };

    var renderBottom = function renderBottom() {
      var onClick = function onClick() {
        emit('add');
      };

      return (0, _vue.createVNode)("div", {
        "class": bem('bottom')
      }, [(0, _vue.createVNode)(_button.default, {
        "round": true,
        "block": true,
        "type": "danger",
        "text": props.addButtonText || t('add'),
        "class": bem('add'),
        "onClick": onClick
      }, null)]);
    };

    return function () {
      var List = renderList(props.list);
      var DisabledList = renderList(props.disabledList, true);
      var DisabledText = props.disabledText && (0, _vue.createVNode)("div", {
        "class": bem('disabled-text')
      }, [props.disabledText]);
      return (0, _vue.createVNode)("div", {
        "class": bem()
      }, [slots.top == null ? void 0 : slots.top(), (0, _vue.createVNode)(_radioGroup.default, {
        "modelValue": props.modelValue
      }, _isSlot(List) ? List : {
        default: function _default() {
          return [List];
        }
      }), DisabledText, DisabledList, slots.default == null ? void 0 : slots.default(), renderBottom()]);
    };
  }
});

exports.default = _default2;