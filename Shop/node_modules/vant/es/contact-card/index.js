import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import { createNamespace } from '../utils';
import Cell from '../cell';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('contact-card'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

export default createComponent({
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

      return [_createVNode("div", null, [t('name') + "\uFF1A" + props.name]), _createVNode("div", null, [t('tel') + "\uFF1A" + props.tel])];
    };

    return function () {
      var _slot;

      return _createVNode(Cell, {
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