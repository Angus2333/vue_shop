import { createVNode as _createVNode } from "vue";
import { ref } from 'vue'; // Utils

import { createNamespace, isDef } from '../utils';
import { BORDER_TOP_BOTTOM } from '../utils/constant';
import { callInterceptor } from '../utils/interceptor'; // Composition

import { useChildren } from '@vant/use';
import { usePlaceholder } from '../composables/use-placeholder';

var _createNamespace = createNamespace('tabbar'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export var TABBAR_KEY = 'vanTabbar';
export default createComponent({
  props: {
    route: Boolean,
    zIndex: [Number, String],
    placeholder: Boolean,
    activeColor: String,
    beforeChange: Function,
    inactiveColor: String,
    modelValue: {
      type: [Number, String],
      default: 0
    },
    border: {
      type: Boolean,
      default: true
    },
    fixed: {
      type: Boolean,
      default: true
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: null
    }
  },
  emits: ['change', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var root = ref();

    var _useChildren = useChildren(TABBAR_KEY),
        linkChildren = _useChildren.linkChildren;

    var renderPlaceholder = usePlaceholder(root, bem);

    var isUnfit = function isUnfit() {
      if (isDef(props.safeAreaInsetBottom)) {
        return !props.safeAreaInsetBottom;
      } // enable safe-area-inset-bottom by default when fixed


      return !props.fixed;
    };

    var renderTabbar = function renderTabbar() {
      var _ref2;

      var fixed = props.fixed,
          zIndex = props.zIndex,
          border = props.border;
      var unfit = isUnfit();
      return _createVNode("div", {
        "ref": root,
        "style": {
          zIndex: zIndex
        },
        "class": [bem({
          unfit: unfit,
          fixed: fixed
        }), (_ref2 = {}, _ref2[BORDER_TOP_BOTTOM] = border, _ref2)]
      }, [slots.default == null ? void 0 : slots.default()]);
    };

    var setActive = function setActive(active) {
      if (active !== props.modelValue) {
        callInterceptor({
          interceptor: props.beforeChange,
          args: [active],
          done: function done() {
            emit('update:modelValue', active);
            emit('change', active);
          }
        });
      }
    };

    linkChildren({
      props: props,
      setActive: setActive
    });
    return function () {
      if (props.fixed && props.placeholder) {
        return renderPlaceholder(renderTabbar);
      }

      return renderTabbar();
    };
  }
});