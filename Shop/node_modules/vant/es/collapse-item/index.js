import { withDirectives as _withDirectives } from "vue";
import { vShow as _vShow } from "vue";
import { createVNode as _createVNode } from "vue";
import { mergeProps as _mergeProps } from "vue";
import { resolveDirective as _resolveDirective } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { ref, watch, computed, nextTick } from 'vue'; // Utils

import { createNamespace } from '../utils'; // Composition

import { raf, doubleRaf, useParent } from '@vant/use';
import { useExpose } from '../composables/use-expose';
import { useLazyRender } from '../composables/use-lazy-render'; // Components

import Cell, { cellProps } from '../cell';
import { COLLAPSE_KEY } from '../collapse';

var _createNamespace = createNamespace('collapse-item'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: _extends({}, cellProps, {
    name: [Number, String],
    disabled: Boolean,
    isLink: {
      type: Boolean,
      default: true
    }
  }),
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var wrapperRef = ref();
    var contentRef = ref();

    var _useParent = useParent(COLLAPSE_KEY),
        parent = _useParent.parent,
        index = _useParent.index;

    var currentName = computed(function () {
      var _props$name;

      return (_props$name = props.name) != null ? _props$name : index.value;
    });
    var expanded = computed(function () {
      if (parent) {
        return parent.isExpanded(currentName.value);
      }

      return null;
    });
    var show = ref(expanded.value);
    var lazyRender = useLazyRender(show);

    var onTransitionEnd = function onTransitionEnd() {
      if (!expanded.value) {
        show.value = false;
      } else {
        wrapperRef.value.style.height = '';
      }
    };

    watch(expanded, function (value, oldValue) {
      if (oldValue === null) {
        return;
      }

      if (value) {
        show.value = true;
      } // Use raf: flick when opened in safari
      // Use nextTick: closing animation failed when set `user-select: none`


      var tick = value ? nextTick : raf;
      tick(function () {
        if (!contentRef.value || !wrapperRef.value) {
          return;
        }

        var offsetHeight = contentRef.value.offsetHeight;

        if (offsetHeight) {
          var contentHeight = offsetHeight + "px";
          wrapperRef.value.style.height = value ? 0 : contentHeight; // use double raf to ensure animation can start

          doubleRaf(function () {
            wrapperRef.value.style.height = value ? contentHeight : 0;
          });
        } else {
          onTransitionEnd();
        }
      });
    });

    var toggle = function toggle(value) {
      if (value === void 0) {
        value = !expanded.value;
      }

      parent.toggle(currentName.value, value);
    };

    var onClickTitle = function onClickTitle() {
      if (!props.disabled) {
        toggle();
      }
    };

    var renderTitle = function renderTitle() {
      var border = props.border,
          disabled = props.disabled;
      return _createVNode(Cell, _mergeProps({
        "role": "button",
        "class": bem('title', {
          disabled: disabled,
          expanded: expanded.value,
          borderless: !border
        }),
        "tabindex": disabled ? -1 : 0,
        "aria-expanded": String(expanded.value),
        "onClick": onClickTitle
      }, props), {
        icon: slots.icon,
        title: slots.title,
        default: slots.value,
        'right-icon': slots['right-icon']
      });
    };

    var renderContent = lazyRender(function () {
      return _withDirectives(_createVNode("div", {
        "ref": wrapperRef,
        "class": bem('wrapper'),
        "onTransitionend": onTransitionEnd
      }, [_createVNode("div", {
        "ref": contentRef,
        "class": bem('content')
      }, [slots.default == null ? void 0 : slots.default()])]), [[_vShow, show.value]]);
    });
    useExpose({
      toggle: toggle
    });
    return function () {
      return _createVNode("div", {
        "class": [bem({
          border: index.value && props.border
        })]
      }, [renderTitle(), renderContent()]);
    };
  }
});