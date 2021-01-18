import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createNamespace } from '../utils';
import Popup, { popupSharedProps } from '../popup';

var _createNamespace = createNamespace('notify'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: _extends({}, popupSharedProps, {
    color: String,
    message: [Number, String],
    className: null,
    background: String,
    type: {
      type: String,
      default: 'danger'
    }
  }),
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    return function () {
      var style = {
        color: props.color,
        background: props.background
      };
      return _createVNode(Popup, {
        "show": props.show,
        "class": [bem([props.type]), props.className],
        "style": style,
        "overlay": false,
        "position": "top",
        "duration": 0.2,
        "lockScroll": false
      }, {
        default: function _default() {
          return [slots.default ? slots.default() : props.message];
        }
      });
    };
  }
});