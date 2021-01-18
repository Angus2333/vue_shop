"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _constant = require("../utils/constant");

var _useRoute = require("../composables/use-route");

var _icon = _interopRequireDefault(require("../icon"));

var _loading = _interopRequireDefault(require("../loading"));

// Utils
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('button'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: (0, _extends2.default)({}, _useRoute.routeProps, {
    text: String,
    icon: String,
    color: String,
    block: Boolean,
    plain: Boolean,
    round: Boolean,
    square: Boolean,
    loading: Boolean,
    hairline: Boolean,
    disabled: Boolean,
    iconPrefix: String,
    loadingText: String,
    loadingType: String,
    tag: {
      type: String,
      default: 'button'
    },
    type: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'normal'
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loadingSize: {
      type: String,
      default: '20px'
    },
    iconPosition: {
      type: String,
      default: 'left'
    }
  }),
  emits: ['click'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var route = (0, _useRoute.useRoute)();

    var renderLoadingIcon = function renderLoadingIcon() {
      if (slots.loading) {
        return slots.loading();
      }

      return (0, _vue.createVNode)(_loading.default, {
        "class": bem('loading'),
        "size": props.loadingSize,
        "type": props.loadingType,
        "color": "currentColor"
      }, null);
    };

    var renderIcon = function renderIcon() {
      if (props.loading) {
        return renderLoadingIcon();
      }

      if (props.icon) {
        return (0, _vue.createVNode)(_icon.default, {
          "name": props.icon,
          "class": bem('icon'),
          "classPrefix": props.iconPrefix
        }, null);
      }
    };

    var renderText = function renderText() {
      var text;

      if (props.loading) {
        text = props.loadingText;
      } else {
        text = slots.default ? slots.default() : props.text;
      }

      if (text) {
        return (0, _vue.createVNode)("span", {
          "class": bem('text')
        }, _isSlot(text) ? text : {
          default: function _default() {
            return [text];
          }
        });
      }
    };

    var getStyle = function getStyle() {
      var color = props.color,
          plain = props.plain;

      if (color) {
        var style = {};
        style.color = plain ? color : 'white';

        if (!plain) {
          // Use background instead of backgroundColor to make linear-gradient work
          style.background = color;
        } // hide border when color is linear-gradient


        if (color.indexOf('gradient') !== -1) {
          style.border = 0;
        } else {
          style.borderColor = color;
        }

        return style;
      }
    };

    var onClick = function onClick(event) {
      if (!props.loading && !props.disabled) {
        emit('click', event);
        route();
      }
    };

    return function () {
      var _slot;

      var _ref2;

      var tag = props.tag,
          type = props.type,
          size = props.size,
          block = props.block,
          round = props.round,
          plain = props.plain,
          square = props.square,
          loading = props.loading,
          disabled = props.disabled,
          hairline = props.hairline,
          nativeType = props.nativeType,
          iconPosition = props.iconPosition;
      var classes = [bem([type, size, {
        plain: plain,
        block: block,
        round: round,
        square: square,
        loading: loading,
        disabled: disabled,
        hairline: hairline
      }]), (_ref2 = {}, _ref2[_constant.BORDER_SURROUND] = hairline, _ref2)];
      return (0, _vue.createVNode)(tag, {
        "type": nativeType,
        "class": classes,
        "style": getStyle(),
        "disabled": disabled,
        "onClick": onClick
      }, _isSlot(_slot = (0, _vue.createVNode)("div", {
        "class": bem('content')
      }, [iconPosition === 'left' && renderIcon(), renderText(), iconPosition === 'right' && renderIcon()])) ? _slot : {
        default: function _default() {
          return [_slot];
        }
      });
    };
  }
});

exports.default = _default2;