import { createVNode as _createVNode } from "vue";
import { createNamespace, addUnit, getSizeStyle } from '../utils';

var _createNamespace = createNamespace('skeleton'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var DEFAULT_ROW_WIDTH = '100%';
var DEFAULT_LAST_ROW_WIDTH = '60%';
export default createComponent({
  props: {
    title: Boolean,
    round: Boolean,
    avatar: Boolean,
    avatarSize: [Number, String],
    titleWidth: [Number, String],
    row: {
      type: [Number, String],
      default: 0
    },
    loading: {
      type: Boolean,
      default: true
    },
    animate: {
      type: Boolean,
      default: true
    },
    avatarShape: {
      type: String,
      default: 'round'
    },
    rowWidth: {
      type: [Number, String, Array],
      default: DEFAULT_ROW_WIDTH
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;

    var renderAvatar = function renderAvatar() {
      if (props.avatar) {
        return _createVNode("div", {
          "class": bem('avatar', props.avatarShape),
          "style": getSizeStyle(props.avatarSize)
        }, null);
      }
    };

    var renderTitle = function renderTitle() {
      if (props.title) {
        return _createVNode("h3", {
          "class": bem('title'),
          "style": {
            width: addUnit(props.titleWidth)
          }
        }, null);
      }
    };

    var getRowWidth = function getRowWidth(index) {
      var rowWidth = props.rowWidth;

      if (rowWidth === DEFAULT_ROW_WIDTH && index === +props.row - 1) {
        return DEFAULT_LAST_ROW_WIDTH;
      }

      if (Array.isArray(rowWidth)) {
        return rowWidth[index];
      }

      return rowWidth;
    };

    var renderRows = function renderRows() {
      var Rows = [];

      for (var i = 0; i < props.row; i++) {
        Rows.push(_createVNode("div", {
          "class": bem('row'),
          "style": {
            width: addUnit(getRowWidth(i))
          }
        }, null));
      }

      return Rows;
    };

    return function () {
      if (!props.loading) {
        return slots.default == null ? void 0 : slots.default();
      }

      return _createVNode("div", {
        "class": bem({
          animate: props.animate,
          round: props.round
        })
      }, [renderAvatar(), _createVNode("div", {
        "class": bem('content')
      }, [renderTitle(), renderRows()])]);
    };
  }
});