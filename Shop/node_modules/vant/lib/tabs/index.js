"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = exports.TABS_KEY = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _utils2 = require("./utils");

var _constant = require("../utils/constant");

var _interceptor = require("../utils/interceptor");

var _use = require("@vant/use");

var _useRoute = require("../composables/use-route");

var _useRefs2 = require("../composables/use-refs");

var _useExpose = require("../composables/use-expose");

var _sticky = _interopRequireDefault(require("../sticky"));

var _TabsTitle = _interopRequireDefault(require("./TabsTitle"));

var _TabsContent = _interopRequireDefault(require("./TabsContent"));

// Utils
// Composition
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('tabs'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var TABS_KEY = 'vanTabs';
exports.TABS_KEY = TABS_KEY;

var _default2 = createComponent({
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
    var root = (0, _vue.ref)();
    var navRef = (0, _vue.ref)();
    var wrapRef = (0, _vue.ref)();
    var windowSize = (0, _use.useWindowSize)();
    var scroller = (0, _use.useScrollParent)(root);

    var _useRefs = (0, _useRefs2.useRefs)(),
        titleRefs = _useRefs[0],
        setTitleRefs = _useRefs[1];

    var _useChildren = (0, _use.useChildren)(TABS_KEY),
        children = _useChildren.children,
        linkChildren = _useChildren.linkChildren;

    var state = (0, _vue.reactive)({
      inited: false,
      position: '',
      currentIndex: -1,
      lineStyle: {
        backgroundColor: props.color
      }
    }); // whether the nav is scrollable

    var scrollable = (0, _vue.computed)(function () {
      return children.length > props.swipeThreshold || !props.ellipsis;
    });
    var navStyle = (0, _vue.computed)(function () {
      return {
        borderColor: props.color,
        background: props.background
      };
    });

    var getTabName = function getTabName(tab, index) {
      var _tab$name;

      return (_tab$name = tab.name) != null ? _tab$name : index;
    };

    var currentName = (0, _vue.computed)(function () {
      var activeTab = children[state.currentIndex];

      if (activeTab) {
        return getTabName(activeTab, state.currentIndex);
      }
    });
    var offsetTopPx = (0, _vue.computed)(function () {
      return (0, _utils.unitToPx)(props.offsetTop);
    });
    var scrollOffset = (0, _vue.computed)(function () {
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
      (0, _utils2.scrollLeftTo)(nav, to, immediate ? 0 : +props.duration);
    }; // update nav bar style


    var setLine = function setLine() {
      var shouldAnimate = state.inited;
      (0, _vue.nextTick)(function () {
        var titles = titleRefs.value;

        if (!titles || !titles[state.currentIndex] || props.type !== 'line' || (0, _utils.isHidden)(root.value)) {
          return;
        }

        var title = titles[state.currentIndex].$el;
        var lineWidth = props.lineWidth,
            lineHeight = props.lineHeight;
        var left = title.offsetLeft + title.offsetWidth / 2;
        var lineStyle = {
          width: (0, _utils.addUnit)(lineWidth),
          backgroundColor: props.color,
          transform: "translateX(" + left + "px) translateX(-50%)"
        };

        if (shouldAnimate) {
          lineStyle.transitionDuration = props.duration + "s";
        }

        if ((0, _utils.isDef)(lineHeight)) {
          var height = (0, _utils.addUnit)(lineHeight);
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

      if (!(0, _utils.isDef)(newIndex)) {
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
          var to = (0, _utils.getElementTop)(target, scroller.value) - scrollOffset.value;
          lockScroll = true;
          (0, _utils2.scrollTopTo)(scroller.value, to, immediate ? 0 : +props.duration, function () {
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
        (0, _interceptor.callInterceptor)({
          interceptor: props.beforeChange,
          args: [name],
          done: function done() {
            setCurrentIndex(index);
            scrollToCurrentContent();
          }
        });
        emit('click', name, title);
        (0, _useRoute.route)(item);
      }
    };

    var onStickyScroll = function onStickyScroll(params) {
      stickyFixed = params.isFixed;
      emit('scroll', params);
    };

    var scrollTo = function scrollTo(name) {
      (0, _vue.nextTick)(function () {
        setCurrentIndexByName(name);
        scrollToCurrentContent(true);
      });
    };

    var getCurrentIndexOnScroll = function getCurrentIndexOnScroll() {
      for (var index = 0; index < children.length; index++) {
        var top = (0, _utils.getVisibleTop)(children[index].$el);

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
        return (0, _vue.createVNode)(_TabsTitle.default, {
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
      return (0, _vue.createVNode)("div", {
        "ref": wrapRef,
        "class": [bem('wrap', {
          scrollable: scrollable.value
        }), (_ref2 = {}, _ref2[_constant.BORDER_TOP_BOTTOM] = type === 'line' && border, _ref2)]
      }, [(0, _vue.createVNode)("div", {
        "ref": navRef,
        "role": "tablist",
        "class": bem('nav', [type, {
          complete: scrollable.value
        }]),
        "style": navStyle.value
      }, [(_slots$navLeft = slots['nav-left']) == null ? void 0 : _slots$navLeft.call(slots), renderNav(), type === 'line' && (0, _vue.createVNode)("div", {
        "class": bem('line'),
        "style": state.lineStyle
      }, null), (_slots$navRight = slots['nav-right']) == null ? void 0 : _slots$navRight.call(slots)])]);
    };

    (0, _vue.watch)([function () {
      return props.color;
    }, windowSize.width], setLine);
    (0, _vue.watch)(function () {
      return props.active;
    }, function (value) {
      if (value !== currentName.value) {
        setCurrentIndexByName(value);
      }
    });
    (0, _vue.watch)(function () {
      return children.length;
    }, function () {
      if (state.inited) {
        setCurrentIndexByName(props.active || currentName.value);
        setLine();
        (0, _vue.nextTick)(function () {
          scrollIntoView(true);
        });
      }
    });
    (0, _vue.watch)(function () {
      return state.currentIndex;
    }, function () {
      scrollIntoView();
      setLine(); // scroll to correct position

      if (stickyFixed && !props.scrollspy) {
        (0, _utils.setRootScrollTop)(Math.ceil((0, _utils.getElementTop)(root.value) - offsetTopPx.value));
      }
    });

    var init = function init() {
      setCurrentIndexByName(props.active || currentName.value);
      (0, _vue.nextTick)(function () {
        state.inited = true;
        tabHeight = (0, _utils.getVisibleHeight)(wrapRef.value);
        scrollIntoView(true);
      });
    };

    (0, _useExpose.useExpose)({
      resize: setLine,
      scrollTo: scrollTo
    });
    (0, _vue.onActivated)(setLine);
    (0, _use.onMountedOrActivated)(init);
    (0, _use.useEventListener)('scroll', onScroll, {
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

      return (0, _vue.createVNode)("div", {
        "ref": root,
        "class": bem([props.type])
      }, [props.sticky ? (0, _vue.createVNode)(_sticky.default, {
        "container": root.value,
        "offsetTop": offsetTopPx.value,
        "onScroll": onStickyScroll
      }, _isSlot(_slot = renderHeader()) ? _slot : {
        default: function _default() {
          return [_slot];
        }
      }) : renderHeader(), (0, _vue.createVNode)(_TabsContent.default, {
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

exports.default = _default2;