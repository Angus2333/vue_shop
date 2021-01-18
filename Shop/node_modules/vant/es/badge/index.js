import { createVNode as _createVNode } from "vue";
import { isDef, createNamespace } from '../utils';
import { isNumeric } from '../utils/validate/number';

var _createNamespace = createNamespace('badge'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    dot: Boolean,
    max: [Number, String],
    color: String,
    content: [Number, String],
    tag: {
      type: String,
      default: 'div'
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;

    var hasContent = function hasContent() {
      return !!(slots.content || isDef(props.content) && props.content !== '');
    };

    var renderContent = function renderContent() {
      var dot = props.dot,
          max = props.max,
          content = props.content;

      if (!dot && hasContent()) {
        if (slots.content) {
          return slots.content();
        }

        if (isDef(max) && isNumeric(content) && +content > max) {
          return max + "+";
        }

        return content;
      }
    };

    var renderBadge = function renderBadge() {
      if (hasContent() || props.dot) {
        return _createVNode("div", {
          "class": bem({
            dot: props.dot,
            fixed: !!slots.default
          }),
          "style": {
            background: props.color
          }
        }, [renderContent()]);
      }
    };

    return function () {
      if (slots.default) {
        var tag = props.tag;
        return _createVNode(tag, {
          "class": bem('wrapper')
        }, {
          default: function _default() {
            return [slots.default(), renderBadge()];
          }
        });
      }

      return renderBadge();
    };
  }
});