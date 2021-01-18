"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _constant = require("../utils/constant");

var _usePlaceholder = require("../composables/use-placeholder");

var _icon = _interopRequireDefault(require("../icon"));

// Utils
// Composition
// Components
var _createNamespace = (0, _utils.createNamespace)('nav-bar'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default = createComponent({
  props: {
    title: String,
    fixed: Boolean,
    zIndex: [Number, String],
    leftText: String,
    rightText: String,
    leftArrow: Boolean,
    placeholder: Boolean,
    safeAreaInsetTop: Boolean,
    border: {
      type: Boolean,
      default: true
    }
  },
  emits: ['click-left', 'click-right'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var navBarRef = (0, _vue.ref)();
    var renderPlaceholder = (0, _usePlaceholder.usePlaceholder)(navBarRef, bem);

    var onClickLeft = function onClickLeft(event) {
      emit('click-left', event);
    };

    var onClickRight = function onClickRight(event) {
      emit('click-right', event);
    };

    var renderLeft = function renderLeft() {
      if (slots.left) {
        return slots.left();
      }

      return [props.leftArrow && (0, _vue.createVNode)(_icon.default, {
        "class": bem('arrow'),
        "name": "arrow-left"
      }, null), props.leftText && (0, _vue.createVNode)("span", {
        "class": bem('text')
      }, [props.leftText])];
    };

    var renderRight = function renderRight() {
      if (slots.right) {
        return slots.right();
      }

      return (0, _vue.createVNode)("span", {
        "class": bem('text')
      }, [props.rightText]);
    };

    var renderNavBar = function renderNavBar() {
      var _ref2;

      var title = props.title,
          fixed = props.fixed,
          border = props.border,
          zIndex = props.zIndex;
      var style = {
        zIndex: zIndex !== undefined ? +zIndex : undefined
      };
      var hasLeft = props.leftArrow || props.leftText || slots.left;
      var hasRight = props.rightText || slots.right;
      return (0, _vue.createVNode)("div", {
        "ref": navBarRef,
        "style": style,
        "class": [bem({
          fixed: fixed,
          'safe-area-inset-top': props.safeAreaInsetTop
        }), (_ref2 = {}, _ref2[_constant.BORDER_BOTTOM] = border, _ref2)]
      }, [(0, _vue.createVNode)("div", {
        "class": bem('content')
      }, [hasLeft && (0, _vue.createVNode)("div", {
        "class": bem('left'),
        "onClick": onClickLeft
      }, [renderLeft()]), (0, _vue.createVNode)("div", {
        "class": [bem('title'), 'van-ellipsis']
      }, [slots.title ? slots.title() : title]), hasRight && (0, _vue.createVNode)("div", {
        "class": bem('right'),
        "onClick": onClickRight
      }, [renderRight()])])]);
    };

    return function () {
      if (props.fixed && props.placeholder) {
        return renderPlaceholder(renderNavBar);
      }

      return renderNavBar();
    };
  }
});

exports.default = _default;