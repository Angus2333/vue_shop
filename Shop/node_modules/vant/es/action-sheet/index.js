import { mergeProps as _mergeProps } from "vue";
import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
// Utils
import { createNamespace, pick } from '../utils'; // Components

import Icon from '../icon';
import Popup, { popupSharedProps } from '../popup';
import Loading from '../loading';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('action-sheet'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: _extends({}, popupSharedProps, {
    title: String,
    actions: Array,
    cancelText: String,
    description: String,
    closeOnPopstate: Boolean,
    closeOnClickAction: Boolean,
    round: {
      type: Boolean,
      default: true
    },
    closeable: {
      type: Boolean,
      default: true
    },
    closeIcon: {
      type: String,
      default: 'cross'
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: true
    }
  }),
  emits: ['select', 'cancel', 'update:show'],
  setup: function setup(props, _ref) {
    var slots = _ref.slots,
        emit = _ref.emit;
    var popupPropKeys = Object.keys(popupSharedProps);

    var onUpdateShow = function onUpdateShow(show) {
      emit('update:show', show);
    };

    var onCancel = function onCancel() {
      onUpdateShow(false);
      emit('cancel');
    };

    var renderHeader = function renderHeader() {
      if (props.title) {
        return _createVNode("div", {
          "class": bem('header')
        }, [props.title, props.closeable && _createVNode(Icon, {
          "name": props.closeIcon,
          "class": bem('close'),
          "onClick": onCancel
        }, null)]);
      }
    };

    var renderCancel = function renderCancel() {
      if (props.cancelText) {
        return [_createVNode("div", {
          "class": bem('gap')
        }, null), _createVNode("button", {
          "type": "button",
          "class": bem('cancel'),
          "onClick": onCancel
        }, [props.cancelText])];
      }
    };

    var renderOption = function renderOption(item, index) {
      var name = item.name,
          color = item.color,
          subname = item.subname,
          loading = item.loading,
          callback = item.callback,
          disabled = item.disabled,
          className = item.className;
      var Content = loading ? _createVNode(Loading, {
        "class": bem('loading-icon')
      }, null) : [_createVNode("span", {
        "class": bem('name')
      }, _isSlot(name) ? name : {
        default: function _default() {
          return [name];
        }
      }), subname && _createVNode("div", {
        "class": bem('subname')
      }, _isSlot(subname) ? subname : {
        default: function _default() {
          return [subname];
        }
      })];

      var onClick = function onClick() {
        if (disabled || loading) {
          return;
        }

        if (callback) {
          callback(item);
        }

        emit('select', item, index);

        if (props.closeOnClickAction) {
          onUpdateShow(false);
        }
      };

      return _createVNode("button", {
        "type": "button",
        "style": {
          color: color
        },
        "class": [bem('item', {
          loading: loading,
          disabled: disabled
        }), className],
        "onClick": onClick
      }, _isSlot(Content) ? Content : {
        default: function _default() {
          return [Content];
        }
      });
    };

    var renderDescription = function renderDescription() {
      if (props.description || slots.description) {
        var content = slots.description ? slots.description() : props.description;
        return _createVNode("div", {
          "class": bem('description')
        }, _isSlot(content) ? content : {
          default: function _default() {
            return [content];
          }
        });
      }
    };

    var renderOptions = function renderOptions() {
      if (props.actions) {
        return props.actions.map(renderOption);
      }
    };

    return function () {
      return _createVNode(Popup, _mergeProps({
        "class": bem(),
        "round": props.round,
        "position": "bottom"
      }, _extends({}, pick(props, popupPropKeys), {
        'onUpdate:show': onUpdateShow
      })), {
        default: function _default() {
          return [renderHeader(), renderDescription(), _createVNode("div", {
            "class": bem('content')
          }, [renderOptions(), slots.default == null ? void 0 : slots.default()]), renderCancel()];
        }
      });
    };
  }
});