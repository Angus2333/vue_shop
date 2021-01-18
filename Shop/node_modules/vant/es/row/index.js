import { createVNode as _createVNode } from "vue";
import { computed } from 'vue';
import { createNamespace } from '../utils';
import { useChildren } from '@vant/use';

var _createNamespace = createNamespace('row'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export var ROW_KEY = 'vanRow';
export default createComponent({
  props: {
    align: String,
    justify: String,
    tag: {
      type: String,
      default: 'div'
    },
    gutter: {
      type: [Number, String],
      default: 0
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;

    var _useChildren = useChildren(ROW_KEY),
        children = _useChildren.children,
        linkChildren = _useChildren.linkChildren;

    var groups = computed(function () {
      var groups = [[]];
      var totalSpan = 0;
      children.forEach(function (child, index) {
        // TODO
        // @ts-ignore
        totalSpan += Number(child.span);

        if (totalSpan > 24) {
          groups.push([index]);
          totalSpan -= 24;
        } else {
          groups[groups.length - 1].push(index);
        }
      });
      return groups;
    });
    var spaces = computed(function () {
      var gutter = Number(props.gutter);
      var spaces = [];

      if (!gutter) {
        return spaces;
      }

      groups.value.forEach(function (group) {
        var averagePadding = gutter * (group.length - 1) / group.length;
        group.forEach(function (item, index) {
          if (index === 0) {
            spaces.push({
              right: averagePadding
            });
          } else {
            var left = gutter - spaces[item - 1].right;
            var right = averagePadding - left;
            spaces.push({
              left: left,
              right: right
            });
          }
        });
      });
      return spaces;
    });
    linkChildren({
      spaces: spaces
    });
    return function () {
      var _bem;

      var tag = props.tag,
          align = props.align,
          justify = props.justify;
      return _createVNode(tag, {
        "class": bem((_bem = {}, _bem["align-" + align] = align, _bem["justify-" + justify] = justify, _bem))
      }, {
        default: function _default() {
          return [slots.default == null ? void 0 : slots.default()];
        }
      });
    };
  }
});