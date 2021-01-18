import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import { createNamespace, getSizeStyle } from '../utils';
import { Network } from './Network';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('empty'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var PRESET_IMAGES = ['error', 'search', 'default'];
export default createComponent({
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
        return Network;
      }

      if (PRESET_IMAGES.indexOf(image) !== -1) {
        image = "https://img.yzcdn.cn/vant/empty-image-" + image + ".png";
      }

      return _createVNode("img", {
        "src": image
      }, null);
    };

    var renderDescription = function renderDescription() {
      var description = slots.description ? slots.description() : props.description;

      if (description) {
        return _createVNode("p", {
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
        return _createVNode("div", {
          "class": bem('bottom')
        }, [slots.default()]);
      }
    };

    return function () {
      return _createVNode("div", {
        "class": bem()
      }, [_createVNode("div", {
        "class": bem('image'),
        "style": getSizeStyle(props.imageSize)
      }, [renderImage()]), renderDescription(), renderBottom()]);
    };
  }
});