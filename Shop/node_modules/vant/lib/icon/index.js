"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _badge = _interopRequireDefault(require("../badge"));

var _createNamespace = (0, _utils.createNamespace)('icon'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

function isImage(name) {
  return name ? name.indexOf('/') !== -1 : false;
}

var _default2 = createComponent({
  props: {
    dot: Boolean,
    name: String,
    size: [Number, String],
    badge: [Number, String],
    color: String,
    tag: {
      type: String,
      default: 'i'
    },
    classPrefix: {
      type: String,
      default: bem()
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    return function () {
      var tag = props.tag,
          dot = props.dot,
          name = props.name,
          size = props.size,
          badge = props.badge,
          color = props.color,
          classPrefix = props.classPrefix;
      var isImageIcon = isImage(name);
      return (0, _vue.createVNode)(_badge.default, {
        "dot": dot,
        "tag": tag,
        "content": badge,
        "class": [classPrefix, isImageIcon ? '' : classPrefix + "-" + name],
        "style": {
          color: color,
          fontSize: (0, _utils.addUnit)(size)
        }
      }, {
        default: function _default() {
          return [slots.default == null ? void 0 : slots.default(), isImageIcon && (0, _vue.createVNode)("img", {
            "class": bem('image'),
            "src": name
          }, null)];
        }
      });
    };
  }
});

exports.default = _default2;