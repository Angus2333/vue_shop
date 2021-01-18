"use strict";

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _Network = require("./Network");

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('empty'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var PRESET_IMAGES = ['error', 'search', 'default'];

var _default2 = createComponent({
  props: {
    imageSize: [Number, String],
    description: String,
    image: {
      type: String,
      default: 'default'
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;

    var renderImage = function renderImage() {
      if (slots.image) {
        return slots.image();
      }

      var image = props.image;

      if (image === 'network') {
        return _Network.Network;
      }

      if (PRESET_IMAGES.indexOf(image) !== -1) {
        image = "https://img.yzcdn.cn/vant/empty-image-" + image + ".png";
      }

      return (0, _vue.createVNode)("img", {
        "src": image
      }, null);
    };

    var renderDescription = function renderDescription() {
      var description = slots.description ? slots.description() : props.description;

      if (description) {
        return (0, _vue.createVNode)("p", {
          "class": bem('description')
        }, _isSlot(description) ? description : {
          default: function _default() {
            return [description];
          }
        });
      }
    };

    var renderBottom = function renderBottom() {
      if (slots.default) {
        return (0, _vue.createVNode)("div", {
          "class": bem('bottom')
        }, [slots.default()]);
      }
    };

    return function () {
      return (0, _vue.createVNode)("div", {
        "class": bem()
      }, [(0, _vue.createVNode)("div", {
        "class": bem('image'),
        "style": (0, _utils.getSizeStyle)(props.imageSize)
      }, [renderImage()]), renderDescription(), renderBottom()]);
    };
  }
});

exports.default = _default2;