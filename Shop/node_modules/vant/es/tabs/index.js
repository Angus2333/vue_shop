import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import { ref, watch, computed, reactive, nextTick, onActivated } from 'vue'; // Utils

import { isDef, addUnit, isHidden, unitToPx, getVisibleTop, getElementTop, createNamespace, getVisibleHeight, setRootScrollTop } from '../utils';
import { scrollLeftTo, scrollTopTo } from './utils';
import { BORDER_TOP_BOTTOM } from '../utils/constant';
import { callInterceptor } from '../utils/interceptor'; // Composition

import { useChildren, useWindowSize, useScrollParent, useEventListener, onMountedOrActivated } from '@vant/use';
import { route } from '../composables/use-route';
import { useRefs } from '../composables/use-refs';
import { useExpose } from '../composables/use-expose'; // Components

import Sticky from '../sticky';
import TabsTitle from './TabsTitle';
import TabsContent from './TabsContent';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('tabs'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export var TABS_KEY = 'vanTabs';
export default createComponent({
  props: {
    color: String,
    border: Boolean,
    sticky: Boolean,
    animated: Boolean,
    swipeable: Boolean,
    scrollspy: Boolean,
    background: String,
    lineWidth: [Number, String],
    lineHeight: [Number, String],
    beforeChange: Function,
    titleActiveColor: String,
    titleInactiveColor: String,
    type: {
      type: String,
      default: 'line'
    },
    active: {
      type: [Number, String],
      default: 0
    },
    ellipsis: {
      type: Boolean,
      default: true
    },
    duration: {
      type: [Number, String],
      default: 0.3
    },
    offsetTop: {
      type: [Number, String],
      default: 0
    },
    lazyRender: {
      type: Boolean,
      default: true
    },
    swipeThreshold: {
      type: [Number, String],
      default: 5
    }
  },
  emits: ['click', 'change', 'scroll', 'disabled', 'rendered', 'update:active'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var tabHeight;
    var lockScroll;
    var stickyFixed;
    var root = ref();
    var navRef = ref();
    var wrapRef = ref();
    var windowSize = useWindowSize();
    var scroller = useScrollParent(root);

    var _useRefs = useRefs(),
        titleRefs = _useRefs[0],
        setTitleRefs = _useRefs[1];

    var _useChildren = useChildren(TABS_KEY),
        children = _useChildren.children,
        linkChildren = _useChildren.linkChildren;

    var state = reactive({
      inited: false,
      position: '',
      currentIndex: -1,
      lineStyle: {
        backgroundColor: props.color
      }
    }); // whether the nav is scrollable

    var scrollable = computed(function () {
      return children.length > props.swipeThreshold || !props.ellipsis;
    });
    var navStyle = computed(function () {
      return {
        borderColor: props.color,
        background: props.background
      };
    });

    var getTabName = function getTabName(tab, index) {
      var _tab$name;

      return (_tab$name = tab.name) != null ? _tab$name : index;
    };

    var currentName = computed(function () {
      var activeTab = children[state.currentIndex];

      if (activeTab) {
        return getTabName(activeTab, state.currentIndex);
      }
    });
    var offsetTopPx = computed(function () {
      return unitToPx(props.offsetTop);
    });
    var scrollOffset = computed(function () {
      if (props.sticky) {
        return offsetTopPx.value + tabHeight;
      }

      return 0;
    }); // scroll active tab into view

    var scrollIntoView = function scrollIntoView(immediate) {
      var nav = navRef.value;
      var titles = titleRefs.value;

      if (!scrollable.value || !titles || !titles[state.currentIndex]) {
        return;
      }

      var title = titles[state.currentIndex].$el;
      var to = title.offsetLeft - (nav.offsetWidth - title.offsetWidth) / 2;
      scrollLeftTo(nav, to, immediate ? 0 : +props.duration);
    }; // update nav bar style


    var setLine = function setLine() {
      var shouldAnimate = state.inited;
      nextTick(function () {
        var titles = titleRefs.value;

        if (!titles || !titles[state.currentIndex] || props.type !== 'line' || isHidden(root.value)) {
          return;
        }

        var title = titles[state.currentIndex].$el;
        var lineWidth = props.lineWidth,
            lineHeight = props.lineHeight;
        var left = title.offsetLeft + title.offsetWidth / 2;
        var lineStyle = {
          width: addUnit(lineWidth),
          backgroundColor: props.color,
          transform: "translateX(" + left + "px) translateX(-50%)"
        };

        if (shouldAnimate) {
          lineStyle.transitionDuration = props.duration + "s";
        }

        if (isDef(lineHeight)) {
          var height = addUnit(lineHeight);
          lineStyle.height = height;
          lineStyle.borderRadius = height;
        }

        state.lineStyle = lineStyle;
      });
    };

    var findAvailableTab = function findAvailableTab(index) {
      var diff = index < state.currentIndex ? -1 : 1;

      while (index >= 0 && index < children.length) {
        if (!children[index].disabled) {
          return index;
        }

        index += diff;
      }
    };

    var setCurrentIndex = function setCurrentIndex(currentIndex) {
      var newIndex = findAvailableTab(currentIndex);

      if (!isDef(newIndex)) {
        return;
      }

      var newTab = children[newIndex];
      var newName = getTabName(newTab, newIndex);
      var shouldEmitChange = state.currentIndex !== null;
      state.currentIndex = newIndex;

      if (newName !== props.active) {
        emit('update:active', newName);

        if (shouldEmitChange) {
          emit('change', newName, newTab.title);
        }
      }
    }; // correct the index of active tab


    var setCurrentIndexByName = function setCurrentIndexByName(name) {
      var matched = children.filter(function (tab, index) {
        return getTabName(tab, index) === name;
      });
      var index = matched[0] ? children.indexOf(matched[0]) : 0;
      setCurrentIndex(index);
    };

    var scrollToCurrentContent = function scrollToCurrentContent(immediate) {
      if (immediate === void 0) {
        immediate = false;
      }

      if (props.scrollspy) {
        var target = children[state.currentIndex].$el;

        if (target) {
          var to = getElementTop(target, scroller.value) - scrollOffset.value;
          lockScroll = true;
          scrollTopTo(scroller.value, to, immediate ? 0 : +props.duration, function () {
            lockScroll = false;
          });
        }
      }
    }; // emit event when clicked


    var _onClick = function onClick(item, index) {
      var _children$index = children[index],
          title = _children$index.title,
          disabled = _children$index.disabled;
      var name = getTabName(children[index], index);

      if (disabled) {
        emit('disabled', name, title);
      } else {
        callInterceptor({
          interceptor: props.beforeChange,
          args: [name],
          done: function done() {
            setCurrentIndex(index);
            scrollToCurrentContent();
          }
        });
        emit('click', name, title);
        route(item);
      }
    };

    var onStickyScroll = function onStickyScroll(params) {
      stickyFixed = params.isFixed;
      emit('scroll', params);
    };

    var scrollTo = function scrollTo(name) {
      nextTick(function () {
        setCurrentIndexByName(name);
        scrollToCurrentContent(true);
      });
    };

    var getCurrentIndexOnScroll = function getCurrentIndexOnScroll() {
      for (var index = 0; index < children.length; index++) {
        var top = getVisibleTop(children[index].$el);

        if (top > scrollOffset.value) {
          return index === 0 ? 0 : index - 1;
        }
      }

      return children.length - 1;
    };

    var onScroll = function onScroll() {
      if (props.scrollspy && !lockScroll) {
        var index = getCurrentIndexOnScroll();
        setCurrentIndex(index);
      }
    };

    var renderNav = function renderNav() {
      return children.map(function (item, index) {
        return _createVNode(TabsTitle, {
          "ref": setTitleRefs(index),
          "dot": item.dot,
          "type": props.type,
          "badge": item.badge,
          "title": item.title,
          "color": props.color,
          "style": item.titleStyle,
          "class": item.titleClass,
          "isActive": index === state.currentIndex,
          "disabled": item.disabled,
          "scrollable": scrollable.value,
          "renderTitle": item.$slots.title,
          "activeColor": props.titleActiveColor,
          "inactiveColor": props.titleInactiveColor,
          "onClick": function onClick() {
            _onClick(item, index);
          }
        }, null);
      });
    };

    var renderHeader = function renderHeader() {
      var _ref2, _slots$navLeft, _slots$navRight;

      var type = props.type,
          border = props.border;
      return _createVNode("div", {
        "ref": wrapRef,
        "class": [bem('wrap', {
          scrollable: scrollable.value
        }), (_ref2 = {}, _ref2[BORDER_TOP_BOTTOM] = type === 'line' && border, _ref2)]
      }, [_createVNode("div", {
        "ref": navRef,
        "role": "tablist",
        "class": bem('nav', [type, {
          complete: scrollable.value
        }]),
        "style": navStyle.value
      }, [(_slots$navLeft = slots['nav-left']) == null ? void 0 : _slots$navLeft.call(slots), renderNav(), type === 'line' && _createVNode("div", {
        "class": bem('line'),
        "style": state.lineStyle
      }, null), (_slots$navRight = slots['nav-right']) == null ? void 0 : _slots$navRight.call(slots)])]);
    };

    watch([function () {
      return props.color;
    }, windowSize.width], setLine);
    watch(function () {
      return props.active;
    }, function (value) {
      if (value !== currentName.value) {
        setCurrentIndexByName(value);
      }
    });
    watch(function () {
      return children.length;
    }, function () {
      if (state.inited) {
        setCurrentIndexByName(props.active || currentName.value);
        setLine();
        nextTick(function () {
          scrollIntoView(true);
        });
      }
    });
    watch(function () {
      return state.currentIndex;
    }, function () {
      scrollIntoView();
      setLine(); // scroll to correct position

      if (stickyFixed && !props.scrollspy) {
        setRootScrollTop(Math.ceil(getElementTop(root.value) - offsetTopPx.value));
      }
    });

    var init = function init() {
      setCurrentIndexByName(props.active || currentName.value);
      nextTick(function () {
        state.inited = true;
        tabHeight = getVisibleHeight(wrapRef.value);
        scrollIntoView(true);
      });
    };

    useExpose({
      resize: setLine,
      scrollTo: scrollTo
    });
    onActivated(setLine);
    onMountedOrActivated(init);
    useEventListener('scroll', onScroll, {
      target: scroller.value
    });
    linkChildren({
      emit: emit,
      props: props,
      setLine: setLine,
      currentName: currentName,
      scrollIntoView: scrollIntoView
    });
    return function () {
      var _slot;

      return _createVNode("div", {
        "ref": root,
        "class": bem([props.type])
      }, [props.sticky ? _createVNode(Sticky, {
        "container": root.value,
        "offsetTop": offsetTopPx.value,
        "onScroll": onStickyScroll
      }, _isSlot(_slot = renderHeader()) ? _slot : {
        default: function _default() {
          return [_slot];
        }
      }) : renderHeader(), _createVNode(TabsContent, {
        "count": children.length,
        "inited": state.inited,
        "animated": props.animated,
        "duration": props.duration,
        "swipeable": props.swipeable,
        "lazyRender": props.lazyRender,
        "currentIndex": state.currentIndex,
        "onChange": setCurrentIndex
      }, {
        default: function _default() {
          return [slots.default == null ? void 0 : slots.default()];
        }
      })]);
    };
  }
});