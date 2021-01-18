import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
// Utils
import { createNamespace, addUnit } from '../utils'; // Components

import Icon from '../icon';
import Sidebar from '../sidebar';
import SidebarItem from '../sidebar-item';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('tree-select'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
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

      return _createVNode("div", {
        "key": item.id,
        "class": ['van-ellipsis', bem('item', {
          active: isActiveItem(item.id),
          disabled: item.disabled
        })],
        "onClick": onClick
      }, [item.text, isActiveItem(item.id) && _createVNode(Icon, {
        "name": props.selectedIcon,
        "class": bem('selected')
      }, null)]);
    };

    var renderSidebar = function renderSidebar() {
      var Items = props.items.map(function (item) {
        return _createVNode(SidebarItem, {
          "dot": item.dot,
          "title": item.text,
          "badge": item.badge,
          "disabled": item.disabled,
          "class": [bem('nav-item'), item.className]
        }, null);
      });
      return _createVNode(Sidebar, {
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
      return _createVNode("div", {
        "class": bem(),
        "style": {
          height: addUnit(props.height)
        }
      }, [renderSidebar(), _createVNode("div", {
        "class": bem('content')
      }, [renderContent()])]);
    };
  }
});