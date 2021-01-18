"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _cell = _interopRequireDefault(require("../cell"));

var _createNamespace = (0, _utils.createNamespace)('coupon-cell'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

function formatValue(props) {
  var coupons = props.coupons,
      chosenCoupon = props.chosenCoupon,
      currency = props.currency;
  var coupon = coupons[+chosenCoupon];

  if (coupon) {
    var value = 0;

    if ((0, _utils.isDef)(coupon.value)) {
      value = coupon.value;
    } else if ((0, _utils.isDef)(coupon.denominations)) {
      value = coupon.denominations;
    }

    return "-" + currency + " " + (value / 100).toFixed(2);
  }

  return coupons.length === 0 ? t('tips') : t('count', coupons.length);
}

var _default2 = createComponent({
  props: {
    title: String,
    coupons: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    currency: {
      type: String,
      default: '¥'
    },
    border: {
      type: Boolean,
      default: true
    },
    editable: {
      type: Boolean,
      default: true
    },
    chosenCoupon: {
      type: [Number, String],
      default: -1
    }
  },
  setup: function setup(props) {
    return function () {
      var selected = props.coupons[+props.chosenCoupon];
      var value = formatValue(props);
      return (0, _vue.createVNode)(_cell.default, {
        "class": bem(),
        "value": value,
        "title": props.title || t('title'),
        "border": props.border,
        "isLink": props.editable,
        "valueClass": bem('value', {
          selected: selected
        })
      }, null);
    };
  }
});

exports.default = _default2;