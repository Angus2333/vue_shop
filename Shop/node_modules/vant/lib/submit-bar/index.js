"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _icon = _interopRequireDefault(require("../icon"));

var _button = _interopRequireDefault(require("../button"));

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('submit-bar'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var _default2 = createComponent({
  props: {
    tip: String,
    label: String,
    price: Number,
    tipIcon: String,
    loading: Boolean,
    disabled: Boolean,
    textAlign: String,
    buttonText: String,
    buttonColor: String,
    suffixLabel: String,
    safeAreaInsetBottom: {
      type: Boolean,
      default: true
    },
    decimalLength: {
      type: [Number, String],
      default: 2
    },
    currency: {
      type: String,
      default: '¥'
    },
    buttonType: {
      type: String,
      default: 'danger'
    }
  },
  emits: ['submit'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var renderText = function renderText() {
      var price = props.price,
          label = props.label,
          currency = props.currency,
          textAlign = props.textAlign,
          suffixLabel = props.suffixLabel,
          decimalLength = props.decimalLength;

      if (typeof price === 'number') {
        var pricePair = (price / 100).toFixed(decimalLength).split('.');
        var decimal = decimalLength ? "." + pricePair[1] : '';
        return (0, _vue.createVNode)("div", {
          "class": bem('text'),
          "style": {
            textAlign: textAlign
          }
        }, [(0, _vue.createVNode)("span", null, [label || t('label')]), (0, _vue.createVNode)("span", {
          "class": bem('price')
        }, [currency, (0, _vue.createVNode)("span", {
          "class": bem('price-integer')
        }, [pricePair[0]]), decimal]), suffixLabel && (0, _vue.createVNode)("span", {
          "class": bem('suffix-label')
        }, _isSlot(suffixLabel) ? suffixLabel : {
          default: function _default() {
            return [suffixLabel];
          }
        })]);
      }
    };

    var renderTip = function renderTip() {
      var tip = props.tip,
          tipIcon = props.tipIcon;

      if (slots.tip || tip) {
        return (0, _vue.createVNode)("div", {
          "class": bem('tip')
        }, [tipIcon && (0, _vue.createVNode)(_icon.default, {
          "class": bem('tip-icon'),
          "name": tipIcon
        }, null), tip && (0, _vue.createVNode)("span", {
          "class": bem('tip-text')
        }, _isSlot(tip) ? tip : {
          default: function _default() {
            return [tip];
          }
        }), slots.tip == null ? void 0 : slots.tip()]);
      }
    };

    var onClickButton = function onClickButton() {
      emit('submit');
    };

    var renderButton = function renderButton() {
      if (slots.button) {
        return slots.button();
      }

      return (0, _vue.createVNode)(_button.default, {
        "round": true,
        "type": props.buttonType,
        "text": props.buttonText,
        "class": bem('button', props.buttonType),
        "color": props.buttonColor,
        "loading": props.loading,
        "disabled": props.disabled,
        "onClick": onClickButton
      }, null);
    };

    return function () {
      return (0, _vue.createVNode)("div", {
        "class": bem({
          unfit: !props.safeAreaInsetBottom
        })
      }, [slots.top == null ? void 0 : slots.top(), renderTip(), (0, _vue.createVNode)("div", {
        "class": bem('bar')
      }, [slots.default == null ? void 0 : slots.default(), renderText(), renderButton()])]);
    };
  }
});

exports.default = _default2;