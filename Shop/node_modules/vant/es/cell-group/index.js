import { Fragment as _Fragment } from "vue";
import { createVNode as _createVNode } from "vue";
import { mergeProps as _mergeProps } from "vue";
import { createNamespace } from '../utils';
import { BORDER_TOP_BOTTOM } from '../utils/constant';

var _createNamespace = createNamespace('cell-group'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  inheritAttrs: false,
  props: {
    title: String,
    border: {
      type: Boolean,
      default: true
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots,
        attrs = _ref.attrs;
    return function () {
      var _ref2;

      var title = props.title,
          border = props.border;

      var Group = _createVNode("div", _mergeProps({
        "class": [bem(), (_ref2 = {}, _ref2[BORDER_TOP_BOTTOM] = border, _ref2)]
      }, attrs), [slots.default == null ? void 0 : slots.default()]);

      if (title || slots.title) {
        return _createVNode(_Fragment, null, [_createVNode("div", {
          "class": bem('title')
        }, [slots.title ? slots.title() : title]), Group]);
      }

      return Group;
    };
  }
});