import { createVNode as _createVNode } from "vue";
import { ref } from 'vue'; // Utils

import { createNamespace } from '../utils';
import { BORDER_BOTTOM } from '../utils/constant'; // Composition

import { usePlaceholder } from '../composables/use-placeholder'; // Components

import Icon from '../icon';

var _createNamespace = createNamespace('nav-bar'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
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
    var navBarRef = ref();
    var renderPlaceholder = usePlaceholder(navBarRef, bem);

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

      return [props.leftArrow && _createVNode(Icon, {
        "class": bem('arrow'),
        "name": "arrow-left"
      }, null), props.leftText && _createVNode("span", {
        "class": bem('text')
      }, [props.leftText])];
    };

    var renderRight = function renderRight() {
      if (slots.right) {
        return slots.right();
      }

      return _createVNode("span", {
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
      return _createVNode("div", {
        "ref": navBarRef,
        "style": style,
        "class": [bem({
          fixed: fixed,
          'safe-area-inset-top': props.safeAreaInsetTop
        }), (_ref2 = {}, _ref2[BORDER_BOTTOM] = border, _ref2)]
      }, [_createVNode("div", {
        "class": bem('content')
      }, [hasLeft && _createVNode("div", {
        "class": bem('left'),
        "onClick": onClickLeft
      }, [renderLeft()]), _createVNode("div", {
        "class": [bem('title'), 'van-ellipsis']
      }, [slots.title ? slots.title() : title]), hasRight && _createVNode("div", {
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