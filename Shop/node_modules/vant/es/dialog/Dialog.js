import { mergeProps as _mergeProps } from "vue";
import { createVNode as _createVNode } from "vue";
import { isVNode as _isVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { reactive } from 'vue'; // Utils

import { callInterceptor } from '../utils/interceptor';
import { createNamespace, addUnit, pick } from '../utils';
import { BORDER_TOP, BORDER_LEFT } from '../utils/constant'; // Components

import Popup, { popupSharedProps } from '../popup';
import Button from '../button';
import ActionBar from '../action-bar';
import ActionBarButton from '../action-bar-button';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('dialog'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var popupKeys = [].concat(Object.keys(popupSharedProps), ['transition', 'closeOnPopstate']);
export default createComponent({
  props: _extends({}, popupSharedProps, {
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
    var loading = reactive({
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
        callInterceptor({
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
        return _createVNode("div", {
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
        return _createVNode("div", {
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
        return _createVNode("div", {
          "class": bem('content', {
            isolated: !hasTitle
          })
        }, [_createVNode("div", _mergeProps({
          "class": bem('message', (_bem = {
            'has-title': hasTitle
          }, _bem[messageAlign] = messageAlign, _bem))
        }, (_ref2 = {}, _ref2[allowHtml ? 'innerHTML' : 'textContent'] = message, _ref2)), null)]);
      }
    };

    var renderButtons = function renderButtons() {
      var _ref3;

      return _createVNode("div", {
        "class": [BORDER_TOP, bem('footer')]
      }, [props.showCancelButton && _createVNode(Button, {
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
      }, null), props.showConfirmButton && _createVNode(Button, {
        "size": "large",
        "text": props.confirmButtonText || t('confirm'),
        "class": [bem('confirm'), (_ref3 = {}, _ref3[BORDER_LEFT] = props.showCancelButton, _ref3)],
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
      return _createVNode(ActionBar, {
        "class": bem('footer')
      }, {
        default: function _default() {
          return [props.showCancelButton && _createVNode(ActionBarButton, {
            "size": "large",
            "type": "warning",
            "text": props.cancelButtonText || t('cancel'),
            "class": bem('cancel'),
            "color": props.cancelButtonColor,
            "loading": loading.cancel,
            "onClick": function onClick() {
              handleAction('cancel');
            }
          }, null), props.showConfirmButton && _createVNode(ActionBarButton, {
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
      return _createVNode(Popup, _mergeProps({
        "role": "dialog",
        "class": [bem([theme]), className],
        "style": {
          width: addUnit(width)
        },
        "aria-labelledby": title || message
      }, _extends({}, pick(props, popupKeys), {
        'onUpdate:show': onUpdateShow
      })), {
        default: function _default() {
          return [renderTitle(), renderContent(), theme === 'round-button' ? renderRoundButtons() : renderButtons()];
        }
      });
    };
  }
});