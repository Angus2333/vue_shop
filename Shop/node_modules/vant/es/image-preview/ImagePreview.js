import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import { nextTick, onMounted, reactive, ref, watch } from 'vue'; // Utils

import { bem, createComponent } from './shared';
import { callInterceptor } from '../utils/interceptor'; // Composition

import { useWindowSize } from '@vant/use';
import { useExpose } from '../composables/use-expose'; // Components

import Icon from '../icon';
import Swipe from '../swipe';
import Popup from '../popup';
import ImagePreviewItem from './ImagePreviewItem';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

export default createComponent({
  props: {
    show: Boolean,
    className: null,
    closeable: Boolean,
    beforeClose: Function,
    showIndicators: Boolean,
    images: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    loop: {
      type: Boolean,
      default: true
    },
    overlay: {
      type: Boolean,
      default: true
    },
    minZoom: {
      type: [Number, String],
      default: 1 / 3
    },
    maxZoom: {
      type: [Number, String],
      default: 3
    },
    showIndex: {
      type: Boolean,
      default: true
    },
    swipeDuration: {
      type: [Number, String],
      default: 500
    },
    startPosition: {
      type: [Number, String],
      default: 0
    },
    closeIcon: {
      type: String,
      default: 'clear'
    },
    closeOnPopstate: {
      type: Boolean,
      default: true
    },
    closeIconPosition: {
      type: String,
      default: 'top-right'
    }
  },
  emits: ['scale', 'close', 'closed', 'change', 'update:show'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var swipeRef = ref();
    var windowSize = useWindowSize();
    var state = reactive({
      active: 0,
      rootWidth: 0,
      rootHeight: 0
    });

    var resize = function resize() {
      if (swipeRef.value) {
        var rect = swipeRef.value.$el.getBoundingClientRect();
        state.rootWidth = rect.width;
        state.rootHeight = rect.height;
      }
    };

    var emitScale = function emitScale(args) {
      emit('scale', args);
    };

    var emitClose = function emitClose() {
      callInterceptor({
        interceptor: props.beforeClose,
        args: [state.active],
        done: function done() {
          emit('update:show', false);
        }
      });
    };

    var setActive = function setActive(active) {
      if (active !== state.active) {
        state.active = active;
        emit('change', active);
      }
    };

    var renderIndex = function renderIndex() {
      if (props.showIndex) {
        return _createVNode("div", {
          "class": bem('index')
        }, [slots.index ? slots.index({
          index: state.active
        }) : state.active + 1 + " / " + props.images.length]);
      }
    };

    var renderCover = function renderCover() {
      if (slots.cover) {
        return _createVNode("div", {
          "class": bem('cover')
        }, [slots.cover()]);
      }
    };

    var renderImages = function renderImages() {
      var _slot;

      return _createVNode(Swipe, {
        "ref": swipeRef,
        "lazyRender": true,
        "loop": props.loop,
        "class": bem('swipe'),
        "duration": props.swipeDuration,
        "initialSwipe": props.startPosition,
        "showIndicators": props.showIndicators,
        "indicatorColor": "white",
        "onChange": setActive
      }, _isSlot(_slot = props.images.map(function (image) {
        return _createVNode(ImagePreviewItem, {
          "src": image,
          "show": props.show,
          "active": state.active,
          "maxZoom": props.maxZoom,
          "minZoom": props.minZoom,
          "rootWidth": state.rootWidth,
          "rootHeight": state.rootHeight,
          "onScale": emitScale,
          "onClose": emitClose
        }, null);
      })) ? _slot : {
        default: function _default() {
          return [_slot];
        }
      });
    };

    var renderClose = function renderClose() {
      if (props.closeable) {
        return _createVNode(Icon, {
          "role": "button",
          "name": props.closeIcon,
          "class": bem('close-icon', props.closeIconPosition),
          "onClick": emitClose
        }, null);
      }
    };

    var onClosed = function onClosed() {
      emit('closed');
    };

    var swipeTo = function swipeTo(index, options) {
      if (swipeRef.value) {
        swipeRef.value.swipeTo(index, options);
      }
    };

    useExpose({
      swipeTo: swipeTo
    });
    onMounted(resize);
    watch([windowSize.width, windowSize.height], resize);
    watch(function () {
      return props.startPosition;
    }, setActive);
    watch(function () {
      return props.show;
    }, function (value) {
      var images = props.images,
          startPosition = props.startPosition;

      if (value) {
        setActive(+startPosition);
        nextTick(function () {
          resize();
          swipeTo(+startPosition, {
            immediate: true
          });
        });
      } else {
        emit('close', {
          index: state.active,
          url: images[state.active]
        });
      }
    });
    return function () {
      return _createVNode(Popup, {
        "show": props.show,
        "class": [bem(), props.className],
        "overlayClass": bem('overlay'),
        "closeOnPopstate": props.closeOnPopstate,
        "onClosed": onClosed
      }, {
        default: function _default() {
          return [renderClose(), renderImages(), renderIndex(), renderCover()];
        }
      });
    };
  }
});