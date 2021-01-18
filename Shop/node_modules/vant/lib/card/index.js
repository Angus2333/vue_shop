"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _tag = _interopRequireDefault(require("../tag"));

var _image = _interopRequireDefault(require("../image"));

// Utils
// Components
var _createNamespace = (0, _utils.createNamespace)('card'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
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
        return (0, _vue.createVNode)("div", {
          "class": [bem('title'), 'van-multi-ellipsis--l2']
        }, [props.title]);
      }
    };

    var renderThumbTag = function renderThumbTag() {
      if (slots.tag || props.tag) {
        return (0, _vue.createVNode)("div", {
          "class": bem('tag')
        }, [slots.tag ? slots.tag() : (0, _vue.createVNode)(_tag.default, {
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

      return (0, _vue.createVNode)(_image.default, {
        "src": props.thumb,
        "width": "100%",
        "height": "100%",
        "fit": "cover",
        "lazyLoad": props.lazyLoad
      }, null);
    };

    var renderThumb = function renderThumb() {
      if (slots.thumb || props.thumb) {
        return (0, _vue.createVNode)("a", {
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
        return (0, _vue.createVNode)("div", {
          "class": [bem('desc'), 'van-ellipsis']
        }, [props.desc]);
      }
    };

    var renderPriceText = function renderPriceText() {
      var priceArr = props.price.toString().split('.');
      return (0, _vue.createVNode)("div", null, [(0, _vue.createVNode)("span", {
        "class": bem('price-currency')
      }, [props.currency]), (0, _vue.createVNode)("span", {
        "class": bem('price-integer')
      }, [priceArr[0]]), (0, _vue.createTextVNode)("."), (0, _vue.createVNode)("span", {
        "class": bem('price-decimal')
      }, [priceArr[1]])]);
    };

    return function () {
      var _slots$priceTop;

      var showNum = slots.num || (0, _utils.isDef)(props.num);
      var showPrice = slots.price || (0, _utils.isDef)(props.price);
      var showOriginPrice = slots['origin-price'] || (0, _utils.isDef)(props.originPrice);
      var showBottom = showNum || showPrice || showOriginPrice || slots.bottom;
      var Price = showPrice && (0, _vue.createVNode)("div", {
        "class": bem('price')
      }, [slots.price ? slots.price() : renderPriceText()]);
      var OriginPrice = showOriginPrice && (0, _vue.createVNode)("div", {
        "class": bem('origin-price')
      }, [slots['origin-price'] ? slots['origin-price']() : props.currency + " " + props.originPrice]);
      var Num = showNum && (0, _vue.createVNode)("div", {
        "class": bem('num')
      }, [slots.num ? slots.num() : "x" + props.num]);
      var Footer = slots.footer && (0, _vue.createVNode)("div", {
        "class": bem('footer')
      }, [slots.footer()]);
      var Bottom = showBottom && (0, _vue.createVNode)("div", {
        "class": bem('bottom')
      }, [(_slots$priceTop = slots['price-top']) == null ? void 0 : _slots$priceTop.call(slots), Price, OriginPrice, Num, slots.bottom == null ? void 0 : slots.bottom()]);
      return (0, _vue.createVNode)("div", {
        "class": bem()
      }, [(0, _vue.createVNode)("div", {
        "class": bem('header')
      }, [renderThumb(), (0, _vue.createVNode)("div", {
        "class": bem('content', {
          centered: props.centered
        })
      }, [(0, _vue.createVNode)("div", null, [renderTitle(), renderDesc(), slots.tags == null ? void 0 : slots.tags()]), Bottom])]), Footer]);
    };
  }
});

exports.default = _default2;