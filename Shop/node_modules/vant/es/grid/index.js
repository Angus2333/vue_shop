import { createVNode as _createVNode } from "vue";
import { createNamespace, addUnit } from '../utils';
import { BORDER_TOP } from '../utils/constant';
import { useChildren } from '@vant/use';

var _createNamespace = createNamespace('grid'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export var GRID_KEY = 'vanGrid';
export default createComponent({
  props: {
    square: Boolean,
    gutter: [Number, String],
    iconSize: [Number, String],
    direction: String,
    clickable: Boolean,
    columnNum: {
      type: [Number, String],
      default: 4
    },
    center: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;

    var _useChildren = useChildren(GRID_KEY),
        linkChildren = _useChildren.linkChildren;

    linkChildren({
      props: props
    });
    return function () {
      var _ref2;

      return _createVNode("div", {
        "style": {
          paddingLeft: addUnit(props.gutter)
        },
        "class": [bem(), (_ref2 = {}, _ref2[BORDER_TOP] = props.border && !props.gutter, _ref2)]
      }, [slots.default == null ? void 0 : slots.default()]);
    };
  }
});