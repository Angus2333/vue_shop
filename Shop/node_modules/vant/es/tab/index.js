import { withDirectives as _withDirectives } from "vue";
import { vShow as _vShow } from "vue";
import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { ref, watch, nextTick } from 'vue';
import { createNamespace } from '../utils';
import { TABS_KEY } from '../tabs'; // Composition

import { useParent } from '@vant/use';
import { routeProps } from '../composables/use-route'; // Components

import SwipeItem from '../swipe-item';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('tab'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: _extends({}, routeProps, {
    dot: Boolean,
    name: [Number, String],
    badge: [Number, String],
    title: String,
    titleStyle: null,
    titleClass: null,
    disabled: Boolean
  }),
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var inited = ref(false);

    var _useParent = useParent(TABS_KEY),
        parent = _useParent.parent,
        index = _useParent.index;

    if (!parent) {
      throw new Error('[Vant] Tabs: <van-tab> must be used inside <van-tabs>');
    }

    var getName = function getName() {
      var _props$name;

      return (_props$name = props.name) != null ? _props$name : index.value;
    };

    var init = function init() {
      inited.value = true;

      if (parent.props.lazyRender) {
        nextTick(function () {
          parent.emit('rendered', getName(), props.title);
        });
      }
    };

    var isActive = function isActive() {
      var active = getName() === parent.currentName.value;

      if (active && !inited.value) {
        init();
      }

      return active;
    };

    watch(function () {
      return props.title;
    }, function () {
      parent.setLine();
      parent.scrollIntoView();
    });
    return function () {
      var _parent$props = parent.props,
          animated = _parent$props.animated,
          swipeable = _parent$props.swipeable,
          scrollspy = _parent$props.scrollspy,
          lazyRender = _parent$props.lazyRender;

      if (!slots.default && !animated) {
        return;
      }

      var active = isActive();
      var show = scrollspy || active;

      if (animated || swipeable) {
        var _slot;

        return _createVNode(SwipeItem, {
          "role": "tabpanel",
          "aria-hidden": !active,
          "class": bem('pane-wrapper', {
            inactive: !active
          })
        }, _isSlot(_slot = _createVNode("div", {
          "class": bem('pane')
        }, [slots.default == null ? void 0 : slots.default()])) ? _slot : {
          default: function _default() {
            return [_slot];
          }
        });
      }

      var shouldRender = inited.value || scrollspy || !lazyRender;
      var Content = shouldRender ? slots.default == null ? void 0 : slots.default() : null;
      return _withDirectives(_createVNode("div", {
        "role": "tabpanel",
        "class": bem('pane')
      }, _isSlot(Content) ? Content : {
        default: function _default() {
          return [Content];
        }
      }), [[_vShow, show]]);
    };
  }
});