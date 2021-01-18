"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _use = require("@vant/use");

var _useRefs2 = require("../composables/use-refs");

var _tab = _interopRequireDefault(require("../tab"));

var _tabs = _interopRequireDefault(require("../tabs"));

var _field = _interopRequireDefault(require("../field"));

var _button = _interopRequireDefault(require("../button"));

var _coupon = _interopRequireDefault(require("../coupon"));

// Utils
// Composition
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('coupon-list'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var EMPTY_IMAGE = 'https://img.yzcdn.cn/vant/coupon-empty.png';

var _default2 = createComponent({
  props: {
    code: String,
    enabledTitle: String,
    disabledTitle: String,
    closeButtonText: String,
    inputPlaceholder: String,
    exchangeButtonText: String,
    exchangeButtonLoading: Boolean,
    exchangeButtonDisabled: Boolean,
    exchangeMinLength: {
      type: Number,
      default: 1
    },
    chosenCoupon: {
      type: Number,
      default: -1
    },
    coupons: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    disabledCoupons: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    displayedCouponIndex: {
      type: Number,
      default: -1
    },
    showExchangeBar: {
      type: Boolean,
      default: true
    },
    showCloseButton: {
      type: Boolean,
      default: true
    },
    showCount: {
      type: Boolean,
      default: true
    },
    currency: {
      type: String,
      default: '¥'
    },
    emptyImage: {
      type: String,
      default: EMPTY_IMAGE
    }
  },
  emits: ['change', 'exchange', 'update:code'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit;

    var _useRefs = (0, _useRefs2.useRefs)(),
        couponRefs = _useRefs[0],
        setCouponRefs = _useRefs[1];

    var state = (0, _vue.reactive)({
      tab: 0,
      code: props.code || ''
    });

    var _useWindowSize = (0, _use.useWindowSize)(),
        windowHeight = _useWindowSize.height;

    var buttonDisabled = (0, _vue.computed)(function () {
      return !props.exchangeButtonLoading && (props.exchangeButtonDisabled || !state.code || state.code.length < props.exchangeMinLength);
    });
    var listStyle = (0, _vue.computed)(function () {
      return {
        height: windowHeight.value - (props.showExchangeBar ? 140 : 94) + 'px'
      };
    });

    var onExchange = function onExchange() {
      emit('exchange', state.code); // auto clear currentCode when not use vModel

      if (!props.code) {
        state.code = '';
      }
    };

    var scrollToCoupon = function scrollToCoupon(index) {
      (0, _vue.nextTick)(function () {
        if (couponRefs.value[index]) {
          couponRefs.value[index].scrollIntoView();
        }
      });
    };

    var renderEmpty = function renderEmpty() {
      return (0, _vue.createVNode)("div", {
        "class": bem('empty')
      }, [(0, _vue.createVNode)("img", {
        "src": props.emptyImage
      }, null), (0, _vue.createVNode)("p", null, [t('empty')])]);
    };

    var renderExchangeBar = function renderExchangeBar() {
      if (props.showExchangeBar) {
        return (0, _vue.createVNode)("div", {
          "class": bem('exchange-bar')
        }, [(0, _vue.createVNode)(_field.default, {
          "modelValue": state.code,
          "onUpdate:modelValue": function onUpdateModelValue($event) {
            return state.code = $event;
          },
          "clearable": true,
          "border": false,
          "class": bem('field'),
          "placeholder": props.inputPlaceholder || t('placeholder'),
          "maxlength": "20"
        }, null), (0, _vue.createVNode)(_button.default, {
          "plain": true,
          "type": "danger",
          "class": bem('exchange'),
          "text": props.exchangeButtonText || t('exchange'),
          "loading": props.exchangeButtonLoading,
          "disabled": buttonDisabled.value,
          "onClick": onExchange
        }, null)]);
      }
    };

    var renderCouponTab = function renderCouponTab() {
      var _slot;

      var coupons = props.coupons;
      var count = props.showCount ? " (" + coupons.length + ")" : '';
      var title = (props.enabledTitle || t('enable')) + count;
      return (0, _vue.createVNode)(_tab.default, {
        "title": title
      }, _isSlot(_slot = (0, _vue.createVNode)("div", {
        "class": bem('list', {
          'with-bottom': props.showCloseButton
        }),
        "style": listStyle.value
      }, [coupons.map(function (coupon, index) {
        return (0, _vue.createVNode)(_coupon.default, {
          "key": coupon.id,
          "ref": setCouponRefs(index),
          "coupon": coupon,
          "chosen": index === props.chosenCoupon,
          "currency": props.currency,
          "onClick": function onClick() {
            return emit('change', index);
          }
        }, null);
      }), !coupons.length && renderEmpty()])) ? _slot : {
        default: function _default() {
          return [_slot];
        }
      });
    };

    var renderDisabledTab = function renderDisabledTab() {
      var _slot2;

      var disabledCoupons = props.disabledCoupons;
      var count = props.showCount ? " (" + disabledCoupons.length + ")" : '';
      var title = (props.disabledTitle || t('disabled')) + count;
      return (0, _vue.createVNode)(_tab.default, {
        "title": title
      }, _isSlot(_slot2 = (0, _vue.createVNode)("div", {
        "class": bem('list', {
          'with-bottom': props.showCloseButton
        }),
        "style": listStyle.value
      }, [disabledCoupons.map(function (coupon) {
        return (0, _vue.createVNode)(_coupon.default, {
          "disabled": true,
          "key": coupon.id,
          "coupon": coupon,
          "currency": props.currency
        }, null);
      }), !disabledCoupons.length && renderEmpty()])) ? _slot2 : {
        default: function _default() {
          return [_slot2];
        }
      });
    };

    (0, _vue.watch)(function () {
      return props.code;
    }, function (value) {
      state.code = value;
    });
    (0, _vue.watch)(function () {
      return state.code;
    }, function (value) {
      emit('update:code', value);
    });
    (0, _vue.watch)(function () {
      return props.displayedCouponIndex;
    }, scrollToCoupon);
    (0, _vue.onMounted)(function () {
      scrollToCoupon(props.displayedCouponIndex);
    });
    return function () {
      return (0, _vue.createVNode)("div", {
        "class": bem()
      }, [renderExchangeBar(), (0, _vue.createVNode)(_tabs.default, {
        "modelValue": state.tab,
        "onUpdate:modelValue": function onUpdateModelValue($event) {
          return state.tab = $event;
        },
        "class": bem('tab'),
        "border": false
      }, {
        default: function _default() {
          return [renderCouponTab(), renderDisabledTab()];
        }
      }), (0, _vue.createVNode)("div", {
        "class": bem('bottom')
      }, [(0, _vue.withDirectives)((0, _vue.createVNode)(_button.default, {
        "round": true,
        "block": true,
        "type": "danger",
        "class": bem('close'),
        "text": props.closeButtonText || t('close'),
        "onClick": function onClick() {
          emit('change', -1);
        }
      }, null), [[_vue.vShow, props.showCloseButton]])])]);
    };
  }
});

exports.default = _default2;