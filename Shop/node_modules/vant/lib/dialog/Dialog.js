"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _interceptor = require("../utils/interceptor");

var _utils = require("../utils");

var _constant = require("../utils/constant");

var _popup = _interopRequireWildcard(require("../popup"));

var _button = _interopRequireDefault(require("../button"));

var _actionBar = _interopRequireDefault(require("../action-bar"));

var _actionBarButton = _interopRequireDefault(require("../action-bar-button"));

// Utils
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('dialog'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var popupKeys = [].concat(Object.keys(_popup.popupSharedProps), ['transition', 'closeOnPopstate']);

var _default2 = createComponent({
  props: (0, _extends2.default)({}, _popup.popupSharedProps, {
    title: String,
    theme: String,
    width: [Number, String],
    message: String,
    callback: Function,
    allowHtml: Boolean,
    className: null,
    beforeClose: Function,
    messageAlign: String,
    showCancelButton: Boolean,
    cancelButtonText: String,
    cancelButtonColor: String,
    confirmButtonText: String,
    confirmButtonColor: String,
    closeOnClickOverlay: Boolean,
    transition: {
      type: String,
      default: 'van-dialog-bounce'
    },
    showConfirmButton: {
      type: Boolean,
      default: true
    },
    closeOnPopstate: {
      type: Boolean,
      default: true
    }
  }),
  emits: ['confirm', 'cancel', 'update:show'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var loading = (0, _vue.reactive)({
      confirm: false,
      cancel: false
    });

    var onUpdateShow = function onUpdateShow(value) {
      emit('update:show', value);
    };

    var close = function close(action) {
      onUpdateShow(false);

      if (props.callback) {
        props.callback(action);
      }
    };

    var handleAction = function handleAction(action) {
      // should not trigger close event when hidden
      if (!props.show) {
        return;
      }

      emit(action);

      if (props.beforeClose) {
        loading[action] = true;
        (0, _interceptor.callInterceptor)({
          interceptor: props.beforeClose,
          args: [action],
          done: function done() {
            close(action);
            loading[action] = false;
          },
          canceled: function canceled() {
            loading[action] = false;
          }
        });
      } else {
        close(action);
      }
    };

    var renderTitle = function renderTitle() {
      var title = slots.title ? slots.title() : props.title;

      if (title) {
        return (0, _vue.createVNode)("div", {
          "class": bem('header', {
            isolated: !props.message && !slots.default
          })
        }, _isSlot(title) ? title : {
          default: function _default() {
            return [title];
          }
        });
      }
    };

    var renderContent = function renderContent() {
      if (slots.default) {
        return (0, _vue.createVNode)("div", {
          "class": bem('content')
        }, [slots.default()]);
      }

      var title = props.title,
          message = props.message,
          allowHtml = props.allowHtml,
          messageAlign = props.messageAlign;

      if (message) {
        var _bem, _ref2;

        var hasTitle = title || slots.title;
        return (0, _vue.createVNode)("div", {
          "class": bem('content', {
            isolated: !hasTitle
          })
        }, [(0, _vue.createVNode)("div", (0, _vue.mergeProps)({
          "class": bem('message', (_bem = {
            'has-title': hasTitle
          }, _bem[messageAlign] = messageAlign, _bem))
        }, (_ref2 = {}, _ref2[allowHtml ? 'innerHTML' : 'textContent'] = message, _ref2)), null)]);
      }
    };

    var renderButtons = function renderButtons() {
      var _ref3;

      return (0, _vue.createVNode)("div", {
        "class": [_constant.BORDER_TOP, bem('footer')]
      }, [props.showCancelButton && (0, _vue.createVNode)(_button.default, {
        "size": "large",
        "text": props.cancelButtonText || t('cancel'),
        "class": bem('cancel'),
        "style": {
          color: props.cancelButtonColor
        },
        "loading": loading.cancel,
        "onClick": function onClick() {
          handleAction('cancel');
        }
      }, null), props.showConfirmButton && (0, _vue.createVNode)(_button.default, {
        "size": "large",
        "text": props.confirmButtonText || t('confirm'),
        "class": [bem('confirm'), (_ref3 = {}, _ref3[_constant.BORDER_LEFT] = props.showCancelButton, _ref3)],
        "style": {
          color: props.confirmButtonColor
        },
        "loading": loading.confirm,
        "onClick": function onClick() {
          handleAction('confirm');
        }
      }, null)]);
    };

    var renderRoundButtons = function renderRoundButtons() {
      return (0, _vue.createVNode)(_actionBar.default, {
        "class": bem('footer')
      }, {
        default: function _default() {
          return [props.showCancelButton && (0, _vue.createVNode)(_actionBarButton.default, {
            "size": "large",
            "type": "warning",
            "text": props.cancelButtonText || t('cancel'),
            "class": bem('cancel'),
            "color": props.cancelButtonColor,
            "loading": loading.cancel,
            "onClick": function onClick() {
              handleAction('cancel');
            }
          }, null), props.showConfirmButton && (0, _vue.createVNode)(_actionBarButton.default, {
            "size": "large",
            "type": "danger",
            "text": props.confirmButtonText || t('confirm'),
            "class": bem('confirm'),
            "color": props.confirmButtonColor,
            "loading": loading.confirm,
            "onClick": function onClick() {
              handleAction('confirm');
            }
          }, null)];
        }
      });
    };

    return function () {
      var width = props.width,
          title = props.title,
          theme = props.theme,
          message = props.message,
          className = props.className;
      return (0, _vue.createVNode)(_popup.default, (0, _vue.mergeProps)({
        "role": "dialog",
        "class": [bem([theme]), className],
        "style": {
          width: (0, _utils.addUnit)(width)
        },
        "aria-labelledby": title || message
      }, (0, _extends2.default)({}, (0, _utils.pick)(props, popupKeys), {
        'onUpdate:show': onUpdateShow
      })), {
        default: function _default() {
          return [renderTitle(), renderContent(), theme === 'round-button' ? renderRoundButtons() : renderButtons()];
        }
      });
    };
  }
});

exports.default = _default2;