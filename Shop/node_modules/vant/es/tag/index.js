import { createVNode as _createVNode } from "vue";
import { Transition } from 'vue';
import { createNamespace } from '../utils';
import Icon from '../icon';

var _createNamespace = createNamespace('tag'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    size: String,
    mark: Boolean,
    color: String,
    plain: Boolean,
    round: Boolean,
    textColor: String,
    closeable: Boolean,
    type: {
      type: String,
      default: 'default'
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  setup: function setup(props, _ref) {
    var slots = _ref.slots,
        emit = _ref.emit;

    var onClose = function onClose(event) {
      event.stopPropagation();
      emit('close');
    };

    var getStyle = function getStyle() {
      if (props.plain) {
        return {
          color: props.textColor || props.color
        };
      }

      return {
        color: props.textColor,
        background: props.color
      };
    };

    return function () {
      var show = props.show,
          type = props.type,
          mark = props.mark,
          plain = props.plain,
          round = props.round,
          size = props.size,
          closeable = props.closeable;
      var classes = {
        mark: mark,
        plain: plain,
        round: round
      };

      if (size) {
        classes[size] = size;
      }

      var CloseIcon = closeable && _createVNode(Icon, {
        "name": "cross",
        "class": bem('close'),
        "onClick": onClose
      }, null);

      return _createVNode(Transition, {
        "name": closeable ? 'van-fade' : undefined
      }, {
        default: function _default() {
          return [show ? _createVNode("span", {
            "style": getStyle(),
            "class": bem([classes, type])
          }, [slots.default == null ? void 0 : slots.default(), CloseIcon]) : null];
        }
      });
    };
  }
});