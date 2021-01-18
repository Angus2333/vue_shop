import { isVNode as _isVNode } from "vue";
import { withDirectives as _withDirectives } from "vue";
import { vShow as _vShow } from "vue";
import { createVNode as _createVNode } from "vue";
import { reactive, Teleport } from 'vue'; // Utils

import { createNamespace } from '../utils';
import { DROPDOWN_KEY } from '../dropdown-menu'; // Composition

import { useParent } from '@vant/use';
import { useExpose } from '../composables/use-expose'; // Components

import Cell from '../cell';
import Icon from '../icon';
import Popup from '../popup';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('dropdown-item'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    title: String,
    disabled: Boolean,
    teleport: [String, Object],
    modelValue: null,
    titleClass: String,
    options: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    lazyRender: {
      type: Boolean,
      default: true
    }
  },
  emits: ['open', 'opened', 'close', 'closed', 'change', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var state = reactive({
      showPopup: false,
      transition: true,
      showWrapper: false
    });

    var _useParent = useParent(DROPDOWN_KEY),
        parent = _useParent.parent;

    var createEmitter = function createEmitter(eventName) {
      return function () {
        return emit(eventName);
      };
    };

    var onOpen = createEmitter('open');
    var onClose = createEmitter('close');
    var onOpened = createEmitter('opened');

    var onClosed = function onClosed() {
      state.showWrapper = false;
      emit('closed');
    };

    var onClickWrapper = function onClickWrapper(event) {
      // prevent being identified as clicking outside and closed when using teleport
      if (props.teleport) {
        event.stopPropagation();
      }
    };

    var toggle = function toggle(show, options) {
      if (show === void 0) {
        show = !state.showPopup;
      }

      if (options === void 0) {
        options = {};
      }

      if (show === state.showPopup) {
        return;
      }

      state.showPopup = show;
      state.transition = !options.immediate;

      if (show) {
        state.showWrapper = true;
      }
    };

    var renderTitle = function renderTitle() {
      if (slots.title) {
        return slots.title();
      }

      if (props.title) {
        return props.title;
      }

      var match = props.options.filter(function (option) {
        return option.value === props.modelValue;
      });
      return match.length ? match[0].text : '';
    };

    var renderOption = function renderOption(option) {
      var activeColor = parent.props.activeColor;
      var active = option.value === props.modelValue;

      var onClick = function onClick() {
        state.showPopup = false;

        if (option.value !== props.modelValue) {
          emit('update:modelValue', option.value);
          emit('change', option.value);
        }
      };

      return _createVNode(Cell, {
        "clickable": true,
        "key": option.value,
        "icon": option.icon,
        "title": option.text,
        "class": bem('option', {
          active: active
        }),
        "style": {
          color: active ? activeColor : ''
        },
        "onClick": onClick
      }, {
        default: function _default() {
          return [active && _createVNode(Icon, {
            "class": bem('icon'),
            "color": activeColor,
            "name": "success"
          }, null)];
        }
      });
    };

    var renderContent = function renderContent() {
      var offset = parent.offset;
      var _parent$props = parent.props,
          zIndex = _parent$props.zIndex,
          overlay = _parent$props.overlay,
          duration = _parent$props.duration,
          direction = _parent$props.direction,
          closeOnClickOverlay = _parent$props.closeOnClickOverlay;
      var style = {
        zIndex: zIndex
      };

      if (direction === 'down') {
        style.top = offset.value + "px";
      } else {
        style.bottom = offset.value + "px";
      }

      return _withDirectives(_createVNode("div", {
        "style": style,
        "class": bem([direction]),
        "onClick": onClickWrapper
      }, [_createVNode(Popup, {
        "show": state.showPopup,
        "onUpdate:show": function onUpdateShow($event) {
          return state.showPopup = $event;
        },
        "class": bem('content'),
        "overlay": overlay,
        "position": direction === 'down' ? 'top' : 'bottom',
        "duration": state.transition ? duration : 0,
        "lazyRender": props.lazyRender,
        "overlayStyle": {
          position: 'absolute'
        },
        "closeOnClickOverlay": closeOnClickOverlay,
        "onOpen": onOpen,
        "onClose": onClose,
        "onOpened": onOpened,
        "onClosed": onClosed
      }, {
        default: function _default() {
          return [props.options.map(renderOption), slots.default == null ? void 0 : slots.default()];
        }
      })]), [[_vShow, state.showWrapper]]);
    };

    useExpose({
      state: state,
      toggle: toggle,
      renderTitle: renderTitle
    });
    return function () {
      if (props.teleport) {
        var _slot;

        return _createVNode(Teleport, {
          "to": props.teleport
        }, _isSlot(_slot = renderContent()) ? _slot : {
          default: function _default() {
            return [_slot];
          }
        });
      }

      return renderContent();
    };
  }
});