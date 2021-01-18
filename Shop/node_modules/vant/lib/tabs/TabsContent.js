"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _swipe = _interopRequireDefault(require("../swipe"));

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('tabs'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: {
    inited: Boolean,
    animated: Boolean,
    swipeable: Boolean,
    lazyRender: Boolean,
    count: {
      type: Number,
      required: true
    },
    duration: {
      type: [Number, String],
      required: true
    },
    currentIndex: {
      type: Number,
      required: true
    }
  },
  emits: ['change'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var swipeRef = (0, _vue.ref)();

    var onChange = function onChange(index) {
      emit('change', index);
    };

    var renderChildren = function renderChildren() {
      var Content = slots.default == null ? void 0 : slots.default();

      if (props.animated || props.swipeable) {
        return (0, _vue.createVNode)(_swipe.default, {
          "ref": swipeRef,
          "loop": false,
          "class": bem('track'),
          "duration": +props.duration * 1000,
          "touchable": props.swipeable,
          "lazyRender": props.lazyRender,
          "showIndicators": false,
          "onChange": onChange
        }, _isSlot(Content) ? Content : {
          default: function _default() {
            return [Content];
          }
        });
      }

      return Content;
    };

    var swipeToCurrentTab = function swipeToCurrentTab(index) {
      var swipe = swipeRef.value;

      if (swipe && swipe.state.active !== index) {
        swipe.swipeTo(index, {
          immediate: !props.inited
        });
      }
    };

    (0, _vue.watch)(function () {
      return props.currentIndex;
    }, swipeToCurrentTab);
    (0, _vue.onMounted)(function () {
      swipeToCurrentTab(props.currentIndex);
    });
    return function () {
      return (0, _vue.createVNode)("div", {
        "class": bem('content', {
          animated: props.animated || props.swipeable
        })
      }, [renderChildren()]);
    };
  }
});

exports.default = _default2;