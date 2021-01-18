"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _use = require("@vant/use");

var _useExpose = require("../composables/use-expose");

var _loading = _interopRequireDefault(require("../loading"));

// Utils
// Composition
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('list'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var _default2 = createComponent({
  props: {
    error: Boolean,
    loading: Boolean,
    finished: Boolean,
    errorText: String,
    loadingText: String,
    finishedText: String,
    offset: {
      type: [Number, String],
      default: 300
    },
    direction: {
      type: String,
      default: 'down'
    },
    immediateCheck: {
      type: Boolean,
      default: true
    }
  },
  emits: ['load', 'update:error', 'update:loading'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    // use sync innerLoading state to avoid repeated loading in some edge cases
    var loading = (0, _vue.ref)(false);
    var root = (0, _vue.ref)();
    var placeholder = (0, _vue.ref)();
    var scrollParent = (0, _use.useScrollParent)(root);

    var check = function check() {
      (0, _vue.nextTick)(function () {
        if (loading.value || props.finished || props.error) {
          return;
        }

        var offset = props.offset,
            direction = props.direction;
        var scrollParentRect = (0, _use.useRect)(scrollParent);

        if (!scrollParentRect.height || (0, _utils.isHidden)(root)) {
          return false;
        }

        var isReachEdge = false;
        var placeholderRect = (0, _use.useRect)(placeholder);

        if (direction === 'up') {
          isReachEdge = scrollParentRect.top - placeholderRect.top <= offset;
        } else {
          isReachEdge = placeholderRect.bottom - scrollParentRect.bottom <= offset;
        }

        if (isReachEdge) {
          loading.value = true;
          emit('update:loading', true);
          emit('load');
        }
      });
    };

    var renderFinishedText = function renderFinishedText() {
      if (props.finished) {
        var text = slots.finished ? slots.finished() : props.finishedText;

        if (text) {
          return (0, _vue.createVNode)("div", {
            "class": bem('finished-text')
          }, _isSlot(text) ? text : {
            default: function _default() {
              return [text];
            }
          });
        }
      }
    };

    var clickErrorText = function clickErrorText() {
      emit('update:error', false);
      check();
    };

    var renderErrorText = function renderErrorText() {
      if (props.error) {
        var text = slots.error ? slots.error() : props.errorText;

        if (text) {
          return (0, _vue.createVNode)("div", {
            "class": bem('error-text'),
            "onClick": clickErrorText
          }, _isSlot(text) ? text : {
            default: function _default() {
              return [text];
            }
          });
        }
      }
    };

    var renderLoading = function renderLoading() {
      if (loading.value && !props.finished) {
        return (0, _vue.createVNode)("div", {
          "class": bem('loading')
        }, [slots.loading ? slots.loading() : (0, _vue.createVNode)(_loading.default, {
          "size": 16
        }, {
          default: function _default() {
            return [props.loadingText || t('loading')];
          }
        })]);
      }
    };

    (0, _vue.watch)([function () {
      return props.loading;
    }, function () {
      return props.finished;
    }], check);
    (0, _vue.onUpdated)(function () {
      loading.value = props.loading;
    });
    (0, _vue.onMounted)(function () {
      if (props.immediateCheck) {
        check();
      }
    });
    (0, _useExpose.useExpose)({
      check: check
    });
    (0, _use.useEventListener)('scroll', check, {
      target: scrollParent
    });
    return function () {
      var Content = slots.default == null ? void 0 : slots.default();
      var Placeholder = (0, _vue.createVNode)("div", {
        "ref": placeholder,
        "class": bem('placeholder')
      }, null);
      return (0, _vue.createVNode)("div", {
        "ref": root,
        "role": "feed",
        "class": bem(),
        "aria-busy": loading.value
      }, [props.direction === 'down' ? Content : Placeholder, renderLoading(), renderFinishedText(), renderErrorText(), props.direction === 'up' ? Content : Placeholder]);
    };
  }
});

exports.default = _default2;