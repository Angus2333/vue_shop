import { createTextVNode as _createTextVNode } from "vue";
import { createVNode as _createVNode } from "vue";
// Utils
import { createNamespace, isDef } from '../utils'; // Components

import Tag from '../tag';
import Image from '../image';

var _createNamespace = createNamespace('card'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    tag: String,
    desc: String,
    thumb: String,
    title: String,
    centered: Boolean,
    lazyLoad: Boolean,
    thumbLink: String,
    num: [Number, String],
    price: [Number, String],
    originPrice: [Number, String],
    currency: {
      type: String,
      default: '¥'
    }
  },
  emits: ['click-thumb'],
  setup: function setup(props, _ref) {
    var slots = _ref.slots,
        emit = _ref.emit;

    var renderTitle = function renderTitle() {
      if (slots.title) {
        return slots.title();
      }

      if (props.title) {
        return _createVNode("div", {
          "class": [bem('title'), 'van-multi-ellipsis--l2']
        }, [props.title]);
      }
    };

    var renderThumbTag = function renderThumbTag() {
      if (slots.tag || props.tag) {
        return _createVNode("div", {
          "class": bem('tag')
        }, [slots.tag ? slots.tag() : _createVNode(Tag, {
          "mark": true,
          "type": "danger"
        }, {
          default: function _default() {
            return [props.tag];
          }
        })]);
      }
    };

    var renderThumbImage = function renderThumbImage() {
      if (slots.thumb) {
        return slots.thumb();
      }

      return _createVNode(Image, {
        "src": props.thumb,
        "width": "100%",
        "height": "100%",
        "fit": "cover",
        "lazyLoad": props.lazyLoad
      }, null);
    };

    var renderThumb = function renderThumb() {
      if (slots.thumb || props.thumb) {
        return _createVNode("a", {
          "href": props.thumbLink,
          "class": bem('thumb'),
          "onClick": function onClick(event) {
            emit('click-thumb', event);
          }
        }, [renderThumbImage(), renderThumbTag()]);
      }
    };

    var renderDesc = function renderDesc() {
      if (slots.desc) {
        return slots.desc();
      }

      if (props.desc) {
        return _createVNode("div", {
          "class": [bem('desc'), 'van-ellipsis']
        }, [props.desc]);
      }
    };

    var renderPriceText = function renderPriceText() {
      var priceArr = props.price.toString().split('.');
      return _createVNode("div", null, [_createVNode("span", {
        "class": bem('price-currency')
      }, [props.currency]), _createVNode("span", {
        "class": bem('price-integer')
      }, [priceArr[0]]), _createTextVNode("."), _createVNode("span", {
        "class": bem('price-decimal')
      }, [priceArr[1]])]);
    };

    return function () {
      var _slots$priceTop;

      var showNum = slots.num || isDef(props.num);
      var showPrice = slots.price || isDef(props.price);
      var showOriginPrice = slots['origin-price'] || isDef(props.originPrice);
      var showBottom = showNum || showPrice || showOriginPrice || slots.bottom;

      var Price = showPrice && _createVNode("div", {
        "class": bem('price')
      }, [slots.price ? slots.price() : renderPriceText()]);

      var OriginPrice = showOriginPrice && _createVNode("div", {
        "class": bem('origin-price')
      }, [slots['origin-price'] ? slots['origin-price']() : props.currency + " " + props.originPrice]);

      var Num = showNum && _createVNode("div", {
        "class": bem('num')
      }, [slots.num ? slots.num() : "x" + props.num]);

      var Footer = slots.footer && _createVNode("div", {
        "class": bem('footer')
      }, [slots.footer()]);

      var Bottom = showBottom && _createVNode("div", {
        "class": bem('bottom')
      }, [(_slots$priceTop = slots['price-top']) == null ? void 0 : _slots$priceTop.call(slots), Price, OriginPrice, Num, slots.bottom == null ? void 0 : slots.bottom()]);

      return _createVNode("div", {
        "class": bem()
      }, [_createVNode("div", {
        "class": bem('header')
      }, [renderThumb(), _createVNode("div", {
        "class": bem('content', {
          centered: props.centered
        })
      }, [_createVNode("div", null, [renderTitle(), renderDesc(), slots.tags == null ? void 0 : slots.tags()]), Bottom])]), Footer]);
    };
  }
});