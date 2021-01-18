import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import { computed } from 'vue';
import { padZero, createNamespace } from '../utils';
import { RED } from '../utils/constant';
import Checkbox from '../checkbox';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('coupon'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

function getDate(timeStamp) {
  var date = new Date(timeStamp * 1000);
  return date.getFullYear() + "." + padZero(date.getMonth() + 1) + "." + padZero(date.getDate());
}

function formatDiscount(discount) {
  return (discount / 10).toFixed(discount % 10 === 0 ? 0 : 1);
}

function formatAmount(amount) {
  return (amount / 100).toFixed(amount % 100 === 0 ? 0 : amount % 10 === 0 ? 1 : 2);
}

export default createComponent({
  props: {
    coupon: Object,
    chosen: Boolean,
    disabled: Boolean,
    currency: {
      type: String,
      default: '¥'
    }
  },
  setup: function setup(props) {
    var validPeriod = computed(function () {
      var _props$coupon = props.coupon,
          startAt = _props$coupon.startAt,
          endAt = _props$coupon.endAt;
      return getDate(startAt) + " - " + getDate(endAt);
    });
    var faceAmount = computed(function () {
      var coupon = props.coupon,
          currency = props.currency;

      if (coupon.valueDesc) {
        return [coupon.valueDesc, _createVNode("span", null, [coupon.unitDesc || ''])];
      }

      if (coupon.denominations) {
        var denominations = formatAmount(coupon.denominations);
        return [_createVNode("span", null, _isSlot(currency) ? currency : {
          default: function _default() {
            return [currency];
          }
        }), " " + denominations];
      }

      if (coupon.discount) {
        return t('discount', formatDiscount(coupon.discount));
      }

      return '';
    });
    var conditionMessage = computed(function () {
      var condition = formatAmount(props.coupon.originCondition);
      return condition === '0' ? t('unlimited') : t('condition', condition);
    });
    return function () {
      var chosen = props.chosen,
          coupon = props.coupon,
          disabled = props.disabled;
      var description = disabled && coupon.reason || coupon.description;
      return _createVNode("div", {
        "class": bem({
          disabled: disabled
        })
      }, [_createVNode("div", {
        "class": bem('content')
      }, [_createVNode("div", {
        "class": bem('head')
      }, [_createVNode("h2", {
        "class": bem('amount')
      }, [faceAmount.value]), _createVNode("p", {
        "class": bem('condition')
      }, [coupon.condition || conditionMessage.value])]), _createVNode("div", {
        "class": bem('body')
      }, [_createVNode("p", {
        "class": bem('name')
      }, [coupon.name]), _createVNode("p", {
        "class": bem('valid')
      }, [validPeriod.value]), !disabled && _createVNode(Checkbox, {
        "size": 18,
        "class": bem('corner'),
        "modelValue": chosen,
        "checkedColor": RED
      }, null)])]), description && _createVNode("p", {
        "class": bem('description')
      }, _isSlot(description) ? description : {
        default: function _default() {
          return [description];
        }
      })]);
    };
  }
});