import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import { computed } from 'vue';
import { createNamespace, isDef } from '../utils';
import Badge from '../badge';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('tab'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    dot: Boolean,
    type: String,
    color: String,
    title: String,
    badge: [Number, String],
    isActive: Boolean,
    disabled: Boolean,
    scrollable: Boolean,
    activeColor: String,
    renderTitle: Function,
    inactiveColor: String
  },
  setup: function setup(props) {
    var style = computed(function () {
      var style = {};
      var type = props.type,
          color = props.color,
          disabled = props.disabled,
          isActive = props.isActive,
          activeColor = props.activeColor,
          inactiveColor = props.inactiveColor;
      var isCard = type === 'card'; // card theme color

      if (color && isCard) {
        style.borderColor = color;

        if (!disabled) {
          if (isActive) {
            style.backgroundColor = color;
          } else {
            style.color = color;
          }
        }
      }

      var titleColor = isActive ? activeColor : inactiveColor;

      if (titleColor) {
        style.color = titleColor;
      }

      return style;
    });

    var renderText = function renderText() {
      var Text = _createVNode("span", {
        "class": bem('text', {
          ellipsis: !props.scrollable
        })
      }, [props.renderTitle ? props.renderTitle() : props.title]);

      if (props.dot || isDef(props.badge) && props.badge !== '') {
        return _createVNode(Badge, {
          "dot": props.dot,
          "content": props.badge
        }, _isSlot(Text) ? Text : {
          default: function _default() {
            return [Text];
          }
        });
      }

      return Text;
    };

    return function () {
      return _createVNode("div", {
        "role": "tab",
        "class": [bem({
          active: props.isActive,
          disabled: props.disabled
        })],
        "style": style.value,
        "aria-selected": props.isActive
      }, [renderText()]);
    };
  }
});