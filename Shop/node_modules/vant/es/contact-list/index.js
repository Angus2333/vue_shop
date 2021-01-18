import { resolveDirective as _resolveDirective } from "vue";
import { createVNode as _createVNode } from "vue";
// Utils
import { createNamespace } from '../utils';
import { RED } from '../utils/constant'; // Components

import Tag from '../tag';
import Icon from '../icon';
import Cell from '../cell';
import Radio from '../radio';
import Button from '../button';
import RadioGroup from '../radio-group';

var _createNamespace = createNamespace('contact-list'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

export default createComponent({
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
        return _createVNode(Radio, {
          "name": item.id,
          "iconSize": 16,
          "checkedColor": RED
        }, null);
      };

      var renderEditIcon = function renderEditIcon() {
        return _createVNode(Icon, {
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
          nodes.push(_createVNode(Tag, {
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

      return _createVNode(Cell, {
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
      return _createVNode("div", {
        "class": bem()
      }, [_createVNode(RadioGroup, {
        "modelValue": props.modelValue,
        "class": bem('group')
      }, {
        default: function _default() {
          return [props.list && props.list.map(renderItem)];
        }
      }), _createVNode("div", {
        "class": bem('bottom')
      }, [_createVNode(Button, {
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