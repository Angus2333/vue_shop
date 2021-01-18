import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective } from "vue";
import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
// Utils
import { createNamespace } from '../utils'; // Components

import Tag from '../tag';
import Icon from '../icon';
import Cell from '../cell';
import Radio from '../radio';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('address-item'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
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
      return _createVNode(Icon, {
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
        return _createVNode(Tag, {
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
      var Info = [_createVNode("div", {
        "class": bem('name')
      }, [data.name + " " + data.tel, renderTag()]), _createVNode("div", {
        "class": bem('address')
      }, [data.address])];

      if (switchable && !disabled) {
        return _createVNode(Radio, {
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
      return _createVNode("div", {
        "class": bem({
          disabled: disabled
        }),
        "onClick": onClick
      }, [_createVNode(Cell, {
        "border": false,
        "valueClass": bem('value')
      }, {
        default: renderContent,
        'right-icon': renderRightIcon
      }), slots.bottom == null ? void 0 : slots.bottom(_extends({}, props.data, {
        disabled: disabled
      }))]);
    };
  }
});