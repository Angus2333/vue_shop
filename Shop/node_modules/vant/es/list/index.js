import { createVNode as _createVNode } from "vue";
import { isVNode as _isVNode } from "vue";
import { ref, watch, nextTick, onUpdated, onMounted } from 'vue'; // Utils

import { isHidden, createNamespace } from '../utils'; // Composition

import { useRect, useScrollParent, useEventListener } from '@vant/use';
import { useExpose } from '../composables/use-expose'; // Components

import Loading from '../loading';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('list'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

export default createComponent({
  props: {
    error: Boolean,
    loading: Boolean,
    finished: Boolean,
    errorText: String,
    loadingText: String,
    finishedText: String,
    offset: {
      type: [Number, String],
      default: 300
    },
    direction: {
      type: String,
      default: 'down'
    },
    immediateCheck: {
      type: Boolean,
      default: true
    }
  },
  emits: ['load', 'update:error', 'update:loading'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    // use sync innerLoading state to avoid repeated loading in some edge cases
    var loading = ref(false);
    var root = ref();
    var placeholder = ref();
    var scrollParent = useScrollParent(root);

    var check = function check() {
      nextTick(function () {
        if (loading.value || props.finished || props.error) {
          return;
        }

        var offset = props.offset,
            direction = props.direction;
        var scrollParentRect = useRect(scrollParent);

        if (!scrollParentRect.height || isHidden(root)) {
          return false;
        }

        var isReachEdge = false;
        var placeholderRect = useRect(placeholder);

        if (direction === 'up') {
          isReachEdge = scrollParentRect.top - placeholderRect.top <= offset;
        } else {
          isReachEdge = placeholderRect.bottom - scrollParentRect.bottom <= offset;
        }

        if (isReachEdge) {
          loading.value = true;
          emit('update:loading', true);
          emit('load');
        }
      });
    };

    var renderFinishedText = function renderFinishedText() {
      if (props.finished) {
        var text = slots.finished ? slots.finished() : props.finishedText;

        if (text) {
          return _createVNode("div", {
            "class": bem('finished-text')
          }, _isSlot(text) ? text : {
            default: function _default() {
              return [text];
            }
          });
        }
      }
    };

    var clickErrorText = function clickErrorText() {
      emit('update:error', false);
      check();
    };

    var renderErrorText = function renderErrorText() {
      if (props.error) {
        var text = slots.error ? slots.error() : props.errorText;

        if (text) {
          return _createVNode("div", {
            "class": bem('error-text'),
            "onClick": clickErrorText
          }, _isSlot(text) ? text : {
            default: function _default() {
              return [text];
            }
          });
        }
      }
    };

    var renderLoading = function renderLoading() {
      if (loading.value && !props.finished) {
        return _createVNode("div", {
          "class": bem('loading')
        }, [slots.loading ? slots.loading() : _createVNode(Loading, {
          "size": 16
        }, {
          default: function _default() {
            return [props.loadingText || t('loading')];
          }
        })]);
      }
    };

    watch([function () {
      return props.loading;
    }, function () {
      return props.finished;
    }], check);
    onUpdated(function () {
      loading.value = props.loading;
    });
    onMounted(function () {
      if (props.immediateCheck) {
        check();
      }
    });
    useExpose({
      check: check
    });
    useEventListener('scroll', check, {
      target: scrollParent
    });
    return function () {
      var Content = slots.default == null ? void 0 : slots.default();

      var Placeholder = _createVNode("div", {
        "ref": placeholder,
        "class": bem('placeholder')
      }, null);

      return _createVNode("div", {
        "ref": root,
        "role": "feed",
        "class": bem(),
        "aria-busy": loading.value
      }, [props.direction === 'down' ? Content : Placeholder, renderLoading(), renderFinishedText(), renderErrorText(), props.direction === 'up' ? Content : Placeholder]);
    };
  }
});