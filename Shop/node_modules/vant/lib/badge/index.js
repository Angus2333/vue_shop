"use strict";

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _number = require("../utils/validate/number");

var _createNamespace = (0, _utils.createNamespace)('badge'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: {
    dot: Boolean,
    max: [Number, String],
    color: String,
    content: [Number, String],
    tag: {
      type: String,
      default: 'div'
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;

    var hasContent = function hasContent() {
      return !!(slots.content || (0, _utils.isDef)(props.content) && props.content !== '');
    };

    var renderContent = function renderContent() {
      var dot = props.dot,
          max = props.max,
          content = props.content;

      if (!dot && hasContent()) {
        if (slots.content) {
          return slots.content();
        }

        if ((0, _utils.isDef)(max) && (0, _number.isNumeric)(content) && +content > max) {
          return max + "+";
        }

        return content;
      }
    };

    var renderBadge = function renderBadge() {
      if (hasContent() || props.dot) {
        return (0, _vue.createVNode)("div", {
          "class": bem({
            dot: props.dot,
            fixed: !!slots.default
          }),
          "style": {
            background: props.color
          }
        }, [renderContent()]);
      }
    };

    return function () {
      if (slots.default) {
        var tag = props.tag;
        return (0, _vue.createVNode)(tag, {
          "class": bem('wrapper')
        }, {
          default: function _default() {
            return [slots.default(), renderBadge()];
          }
        });
      }

      return renderBadge();
    };
  }
});

exports.default = _default2;