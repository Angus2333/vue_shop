"use strict";

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _use = require("@vant/use");

var _row = require("../row");

var _createNamespace = (0, _utils.createNamespace)('col'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: {
    offset: [Number, String],
    tag: {
      type: String,
      default: 'div'
    },
    span: {
      type: [Number, String],
      default: 0
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;

    var _useParent = (0, _use.useParent)(_row.ROW_KEY),
        parent = _useParent.parent,
        index = _useParent.index;

    var style = (0, _vue.computed)(function () {
      if (!parent) {
        return;
      }

      var spaces = parent.spaces;

      if (spaces && spaces.value && spaces.value[index.value]) {
        var _spaces$value$value = spaces.value[index.value],
            left = _spaces$value$value.left,
            right = _spaces$value$value.right;
        return {
          paddingLeft: left ? left + "px" : null,
          paddingRight: right ? right + "px" : null
        };
      }
    });
    return function () {
      var _bem;

      var tag = props.tag,
          span = props.span,
          offset = props.offset;
      return (0, _vue.createVNode)(tag, {
        "style": style.value,
        "class": bem((_bem = {}, _bem[span] = span, _bem["offset-" + offset] = offset, _bem))
      }, {
        default: function _default() {
          return [slots.default == null ? void 0 : slots.default()];
        }
      });
    };
  }
});

exports.default = _default2;