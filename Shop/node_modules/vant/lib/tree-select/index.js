"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _icon = _interopRequireDefault(require("../icon"));

var _sidebar = _interopRequireDefault(require("../sidebar"));

var _sidebarItem = _interopRequireDefault(require("../sidebar-item"));

// Utils
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('tree-select'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: {
    max: {
      type: [Number, String],
      default: Infinity
    },
    items: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    height: {
      type: [Number, String],
      default: 300
    },
    activeId: {
      type: [Number, String, Array],
      default: 0
    },
    selectedIcon: {
      type: String,
      default: 'success'
    },
    mainActiveIndex: {
      type: [Number, String],
      default: 0
    }
  },
  emits: ['click-nav', 'click-item', 'update:activeId', 'update:mainActiveIndex'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var isMultiple = function isMultiple() {
      return Array.isArray(props.activeId);
    };

    var isActiveItem = function isActiveItem(id) {
      return isMultiple() ? props.activeId.indexOf(id) !== -1 : props.activeId === id;
    };

    var renderSubItem = function renderSubItem(item) {
      var onClick = function onClick() {
        if (item.disabled) {
          return;
        }

        var activeId;

        if (isMultiple()) {
          activeId = props.activeId.slice();
          var index = activeId.indexOf(item.id);

          if (index !== -1) {
            activeId.splice(index, 1);
          } else if (activeId.length < props.max) {
            activeId.push(item.id);
          }
        } else {
          activeId = item.id;
        }

        emit('update:activeId', activeId);
        emit('click-item', item);
      };

      return (0, _vue.createVNode)("div", {
        "key": item.id,
        "class": ['van-ellipsis', bem('item', {
          active: isActiveItem(item.id),
          disabled: item.disabled
        })],
        "onClick": onClick
      }, [item.text, isActiveItem(item.id) && (0, _vue.createVNode)(_icon.default, {
        "name": props.selectedIcon,
        "class": bem('selected')
      }, null)]);
    };

    var renderSidebar = function renderSidebar() {
      var Items = props.items.map(function (item) {
        return (0, _vue.createVNode)(_sidebarItem.default, {
          "dot": item.dot,
          "title": item.text,
          "badge": item.badge,
          "disabled": item.disabled,
          "class": [bem('nav-item'), item.className]
        }, null);
      });
      return (0, _vue.createVNode)(_sidebar.default, {
        "class": bem('nav'),
        "modelValue": props.mainActiveIndex,
        "onChange": function onChange(index) {
          emit('update:mainActiveIndex', index);
          emit('click-nav', index);
        }
      }, _isSlot(Items) ? Items : {
        default: function _default() {
          return [Items];
        }
      });
    };

    var renderContent = function renderContent() {
      if (slots.content) {
        return slots.content();
      }

      var selected = props.items[+props.mainActiveIndex] || {};

      if (selected.children) {
        return selected.children.map(renderSubItem);
      }
    };

    return function () {
      return (0, _vue.createVNode)("div", {
        "class": bem(),
        "style": {
          height: (0, _utils.addUnit)(props.height)
        }
      }, [renderSidebar(), (0, _vue.createVNode)("div", {
        "class": bem('content')
      }, [renderContent()])]);
    };
  }
});

exports.default = _default2;