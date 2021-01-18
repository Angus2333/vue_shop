import { withDirectives as _withDirectives } from "vue";
import { vShow as _vShow } from "vue";
import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import { watch, computed, nextTick, onMounted, reactive } from 'vue'; // Utils

import { createNamespace } from '../utils'; // Composition

import { useWindowSize } from '@vant/use';
import { useRefs } from '../composables/use-refs'; // Components

import Tab from '../tab';
import Tabs from '../tabs';
import Field from '../field';
import Button from '../button';
import Coupon from '../coupon';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('coupon-list'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var EMPTY_IMAGE = 'https://img.yzcdn.cn/vant/coupon-empty.png';
export default createComponent({
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

    var _useRefs = useRefs(),
        couponRefs = _useRefs[0],
        setCouponRefs = _useRefs[1];

    var state = reactive({
      tab: 0,
      code: props.code || ''
    });

    var _useWindowSize = useWindowSize(),
        windowHeight = _useWindowSize.height;

    var buttonDisabled = computed(function () {
      return !props.exchangeButtonLoading && (props.exchangeButtonDisabled || !state.code || state.code.length < props.exchangeMinLength);
    });
    var listStyle = computed(function () {
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
      nextTick(function () {
        if (couponRefs.value[index]) {
          couponRefs.value[index].scrollIntoView();
        }
      });
    };

    var renderEmpty = function renderEmpty() {
      return _createVNode("div", {
        "class": bem('empty')
      }, [_createVNode("img", {
        "src": props.emptyImage
      }, null), _createVNode("p", null, [t('empty')])]);
    };

    var renderExchangeBar = function renderExchangeBar() {
      if (props.showExchangeBar) {
        return _createVNode("div", {
          "class": bem('exchange-bar')
        }, [_createVNode(Field, {
          "modelValue": state.code,
          "onUpdate:modelValue": function onUpdateModelValue($event) {
            return state.code = $event;
          },
          "clearable": true,
          "border": false,
          "class": bem('field'),
          "placeholder": props.inputPlaceholder || t('placeholder'),
          "maxlength": "20"
        }, null), _createVNode(Button, {
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
      return _createVNode(Tab, {
        "title": title
      }, _isSlot(_slot = _createVNode("div", {
        "class": bem('list', {
          'with-bottom': props.showCloseButton
        }),
        "style": listStyle.value
      }, [coupons.map(function (coupon, index) {
        return _createVNode(Coupon, {
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
      return _createVNode(Tab, {
        "title": title
      }, _isSlot(_slot2 = _createVNode("div", {
        "class": bem('list', {
          'with-bottom': props.showCloseButton
        }),
        "style": listStyle.value
      }, [disabledCoupons.map(function (coupon) {
        return _createVNode(Coupon, {
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

    watch(function () {
      return props.code;
    }, function (value) {
      state.code = value;
    });
    watch(function () {
      return state.code;
    }, function (value) {
      emit('update:code', value);
    });
    watch(function () {
      return props.displayedCouponIndex;
    }, scrollToCoupon);
    onMounted(function () {
      scrollToCoupon(props.displayedCouponIndex);
    });
    return function () {
      return _createVNode("div", {
        "class": bem()
      }, [renderExchangeBar(), _createVNode(Tabs, {
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
      }), _createVNode("div", {
        "class": bem('bottom')
      }, [_withDirectives(_createVNode(Button, {
        "round": true,
        "block": true,
        "type": "danger",
        "class": bem('close'),
        "text": props.closeButtonText || t('close'),
        "onClick": function onClick() {
          emit('change', -1);
        }
      }, null), [[_vShow, props.showCloseButton]])])]);
    };
  }
});