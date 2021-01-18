"use strict";

exports.__esModule = true;
exports.default = exports.TABBAR_KEY = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _constant = require("../utils/constant");

var _interceptor = require("../utils/interceptor");

var _use = require("@vant/use");

var _usePlaceholder = require("../composables/use-placeholder");

// Utils
// Composition
var _createNamespace = (0, _utils.createNamespace)('tabbar'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var TABBAR_KEY = 'vanTabbar';
exports.TABBAR_KEY = TABBAR_KEY;

var _default = createComponent({
  props: {
    route: Boolean,
    zIndex: [Number, String],
    placeholder: Boolean,
    activeColor: String,
    beforeChange: Function,
    inactiveColor: String,
    modelValue: {
      type: [Number, String],
      default: 0
    },
    border: {
      type: Boolean,
      default: true
    },
    fixed: {
      type: Boolean,
      default: true
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: null
    }
  },
  emits: ['change', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var root = (0, _vue.ref)();

    var _useChildren = (0, _use.useChildren)(TABBAR_KEY),
        linkChildren = _useChildren.linkChildren;

    var renderPlaceholder = (0, _usePlaceholder.usePlaceholder)(root, bem);

    var isUnfit = function isUnfit() {
      if ((0, _utils.isDef)(props.safeAreaInsetBottom)) {
        return !props.safeAreaInsetBottom;
      } // enable safe-area-inset-bottom by default when fixed


      return !props.fixed;
    };

    var renderTabbar = function renderTabbar() {
      var _ref2;

      var fixed = props.fixed,
          zIndex = props.zIndex,
          border = props.border;
      var unfit = isUnfit();
      return (0, _vue.createVNode)("div", {
        "ref": root,
        "style": {
          zIndex: zIndex
        },
        "class": [bem({
          unfit: unfit,
          fixed: fixed
        }), (_ref2 = {}, _ref2[_constant.BORDER_TOP_BOTTOM] = border, _ref2)]
      }, [slots.default == null ? void 0 : slots.default()]);
    };

    var setActive = function setActive(active) {
      if (active !== props.modelValue) {
        (0, _interceptor.callInterceptor)({
          interceptor: props.beforeChange,
          args: [active],
          done: function done() {
            emit('update:modelValue', active);
            emit('change', active);
          }
        });
      }
    };

    linkChildren({
      props: props,
      setActive: setActive
    });
    return function () {
      if (props.fixed && props.placeholder) {
        return renderPlaceholder(renderTabbar);
      }

      return renderTabbar();
    };
  }
});

exports.default = _default;