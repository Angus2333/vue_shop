import { mergeProps as _mergeProps } from "vue";
import { resolveDirective as _resolveDirective } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { ref } from 'vue'; // Utils

import { pick, createNamespace, preventDefault } from '../utils'; // Composition

import { useExpose } from '../composables/use-expose'; // Components

import Field from '../field';

var _createNamespace = createNamespace('search'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

export default createComponent({
  inheritAttrs: false,
  props: {
    label: String,
    rightIcon: String,
    modelValue: String,
    actionText: String,
    background: String,
    showAction: Boolean,
    clearTrigger: String,
    shape: {
      type: String,
      default: 'square'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    leftIcon: {
      type: String,
      default: 'search'
    }
  },
  emits: ['search', 'cancel'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots,
        attrs = _ref.attrs;
    var filedRef = ref();

    var onCancel = function onCancel() {
      if (!slots.action) {
        emit('update:modelValue', '');
        emit('cancel');
      }
    };

    var onKeypress = function onKeypress(event) {
      var ENTER_CODE = 13;

      if (event.keyCode === ENTER_CODE) {
        preventDefault(event);
        emit('search', props.modelValue);
      }
    };

    var renderLabel = function renderLabel() {
      if (slots.label || props.label) {
        return _createVNode("div", {
          "class": bem('label')
        }, [slots.label ? slots.label() : props.label]);
      }
    };

    var renderAction = function renderAction() {
      if (props.showAction) {
        var text = props.actionText || t('cancel');
        return _createVNode("div", {
          "class": bem('action'),
          "role": "button",
          "tabindex": "0",
          "onClick": onCancel
        }, [slots.action ? slots.action() : text]);
      }
    };

    var focus = function focus() {
      if (filedRef.value) {
        filedRef.value.focus();
      }
    };

    var blur = function blur() {
      if (filedRef.value) {
        filedRef.value.blur();
      }
    };

    var fieldPropNames = ['leftIcon', 'rightIcon', 'clearable', 'modelValue', 'clearTrigger'];

    var renderField = function renderField() {
      var fieldAttrs = _extends({}, attrs, pick(props, fieldPropNames), {
        style: null,
        class: null
      });

      return _createVNode(Field, _mergeProps({
        "ref": filedRef,
        "type": "search",
        "border": false,
        "onKeypress": onKeypress
      }, fieldAttrs), _extends({}, pick(slots, ['left-icon', 'right-icon'])));
    };

    useExpose({
      focus: focus,
      blur: blur
    });
    return function () {
      return _createVNode("div", {
        "class": [bem({
          'show-action': props.showAction
        }), attrs.class],
        "style": _extends({
          background: props.background
        }, attrs.style)
      }, [slots.left == null ? void 0 : slots.left(), _createVNode("div", {
        "class": bem('content', props.shape)
      }, [renderLabel(), renderField()]), renderAction()]);
    };
  }
});