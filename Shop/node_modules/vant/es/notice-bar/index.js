import { withDirectives as _withDirectives } from "vue";
import { vShow as _vShow } from "vue";
import { createVNode as _createVNode } from "vue";
import { ref, watch, reactive } from 'vue';
import { isDef, createNamespace } from '../utils'; // Composition

import { raf, useRect, doubleRaf, useEventListener, onMountedOrActivated } from '@vant/use'; // Components

import Icon from '../icon';

var _createNamespace = createNamespace('notice-bar'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    text: String,
    mode: String,
    color: String,
    leftIcon: String,
    wrapable: Boolean,
    background: String,
    scrollable: {
      type: Boolean,
      default: null
    },
    delay: {
      type: [Number, String],
      default: 1
    },
    speed: {
      type: [Number, String],
      default: 50
    }
  },
  emits: ['close', 'replay'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var wrapWidth = 0;
    var contentWidth = 0;
    var startTimer;
    var wrapRef = ref();
    var contentRef = ref();
    var state = reactive({
      show: true,
      offset: 0,
      duration: 0
    });

    var renderLeftIcon = function renderLeftIcon() {
      if (slots['left-icon']) {
        return slots['left-icon']();
      }

      if (props.leftIcon) {
        return _createVNode(Icon, {
          "class": bem('left-icon'),
          "name": props.leftIcon
        }, null);
      }
    };

    var getRightIconName = function getRightIconName() {
      if (props.mode === 'closeable') {
        return 'cross';
      }

      if (props.mode === 'link') {
        return 'arrow';
      }
    };

    var onClickRightIcon = function onClickRightIcon(event) {
      if (props.mode === 'closeable') {
        state.show = false;
        emit('close', event);
      }
    };

    var renderRightIcon = function renderRightIcon() {
      if (slots['right-icon']) {
        return slots['right-icon']();
      }

      var name = getRightIconName();

      if (name) {
        return _createVNode(Icon, {
          "name": name,
          "class": bem('right-icon'),
          "onClick": onClickRightIcon
        }, null);
      }
    };

    var onTransitionEnd = function onTransitionEnd() {
      state.offset = wrapWidth;
      state.duration = 0; // wait for Vue to render offset
      // using nextTick won't work in iOS14

      raf(function () {
        // use double raf to ensure animation can start
        doubleRaf(function () {
          state.offset = -contentWidth;
          state.duration = (contentWidth + wrapWidth) / props.speed;
          emit('replay');
        });
      });
    };

    var renderMarquee = function renderMarquee() {
      var ellipsis = props.scrollable === false && !props.wrapable;
      var style = {
        transform: state.offset ? "translateX(" + state.offset + "px)" : '',
        transitionDuration: state.duration + "s"
      };
      return _createVNode("div", {
        "ref": wrapRef,
        "role": "marquee",
        "class": bem('wrap')
      }, [_createVNode("div", {
        "ref": contentRef,
        "style": style,
        "class": [bem('content'), {
          'van-ellipsis': ellipsis
        }],
        "onTransitionend": onTransitionEnd
      }, [slots.default ? slots.default() : props.text])]);
    };

    var reset = function reset() {
      wrapWidth = 0;
      contentWidth = 0;
      state.offset = 0;
      state.duration = 0;
    };

    var start = function start() {
      var delay = props.delay,
          speed = props.speed,
          scrollable = props.scrollable;
      var ms = isDef(delay) ? delay * 1000 : 0;
      reset();
      clearTimeout(startTimer);
      startTimer = setTimeout(function () {
        if (!wrapRef.value || !contentRef.value || scrollable === false) {
          return;
        }

        var wrapRefWidth = useRect(wrapRef).width;
        var contentRefWidth = useRect(contentRef).width;

        if (scrollable || contentRefWidth > wrapRefWidth) {
          doubleRaf(function () {
            wrapWidth = wrapRefWidth;
            contentWidth = contentRefWidth;
            state.offset = -contentWidth;
            state.duration = contentWidth / speed;
          });
        }
      }, ms);
    };

    onMountedOrActivated(start); // fix cache issues with forwards and back history in safari
    // see: https://guwii.com/cache-issues-with-forwards-and-back-history-in-safari/

    useEventListener('pageshow', start);
    watch([function () {
      return props.text;
    }, function () {
      return props.scrollable;
    }], start);
    return function () {
      var color = props.color,
          wrapable = props.wrapable,
          background = props.background;
      return _withDirectives(_createVNode("div", {
        "role": "alert",
        "class": bem({
          wrapable: wrapable
        }),
        "style": {
          color: color,
          background: background
        }
      }, [renderLeftIcon(), renderMarquee(), renderRightIcon()]), [[_vShow, state.show]]);
    };
  }
});