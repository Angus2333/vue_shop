import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
// Utils
import { createNamespace } from '../utils';
import { BORDER_SURROUND } from '../utils/constant';
import { useRoute, routeProps } from '../composables/use-route'; // Components

import Icon from '../icon';
import Loading from '../loading';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('button'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: _extends({}, routeProps, {
    text: String,
    icon: String,
    color: String,
    block: Boolean,
    plain: Boolean,
    round: Boolean,
    square: Boolean,
    loading: Boolean,
    hairline: Boolean,
    disabled: Boolean,
    iconPrefix: String,
    loadingText: String,
    loadingType: String,
    tag: {
      type: String,
      default: 'button'
    },
    type: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'normal'
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loadingSize: {
      type: String,
      default: '20px'
    },
    iconPosition: {
      type: String,
      default: 'left'
    }
  }),
  emits: ['click'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var route = useRoute();

    var renderLoadingIcon = function renderLoadingIcon() {
      if (slots.loading) {
        return slots.loading();
      }

      return _createVNode(Loading, {
        "class": bem('loading'),
        "size": props.loadingSize,
        "type": props.loadingType,
        "color": "currentColor"
      }, null);
    };

    var renderIcon = function renderIcon() {
      if (props.loading) {
        return renderLoadingIcon();
      }

      if (props.icon) {
        return _createVNode(Icon, {
          "name": props.icon,
          "class": bem('icon'),
          "classPrefix": props.iconPrefix
        }, null);
      }
    };

    var renderText = function renderText() {
      var text;

      if (props.loading) {
        text = props.loadingText;
      } else {
        text = slots.default ? slots.default() : props.text;
      }

      if (text) {
        return _createVNode("span", {
          "class": bem('text')
        }, _isSlot(text) ? text : {
          default: function _default() {
            return [text];
          }
        });
      }
    };

    var getStyle = function getStyle() {
      var color = props.color,
          plain = props.plain;

      if (color) {
        var style = {};
        style.color = plain ? color : 'white';

        if (!plain) {
          // Use background instead of backgroundColor to make linear-gradient work
          style.background = color;
        } // hide border when color is linear-gradient


        if (color.indexOf('gradient') !== -1) {
          style.border = 0;
        } else {
          style.borderColor = color;
        }

        return style;
      }
    };

    var onClick = function onClick(event) {
      if (!props.loading && !props.disabled) {
        emit('click', event);
        route();
      }
    };

    return function () {
      var _slot;

      var _ref2;

      var tag = props.tag,
          type = props.type,
          size = props.size,
          block = props.block,
          round = props.round,
          plain = props.plain,
          square = props.square,
          loading = props.loading,
          disabled = props.disabled,
          hairline = props.hairline,
          nativeType = props.nativeType,
          iconPosition = props.iconPosition;
      var classes = [bem([type, size, {
        plain: plain,
        block: block,
        round: round,
        square: square,
        loading: loading,
        disabled: disabled,
        hairline: hairline
      }]), (_ref2 = {}, _ref2[BORDER_SURROUND] = hairline, _ref2)];
      return _createVNode(tag, {
        "type": nativeType,
        "class": classes,
        "style": getStyle(),
        "disabled": disabled,
        "onClick": onClick
      }, _isSlot(_slot = _createVNode("div", {
        "class": bem('content')
      }, [iconPosition === 'left' && renderIcon(), renderText(), iconPosition === 'right' && renderIcon()])) ? _slot : {
        default: function _default() {
          return [_slot];
        }
      });
    };
  }
});