import { withDirectives as _withDirectives } from "vue";
import { mergeProps as _mergeProps } from "vue";
import { resolveDirective as _resolveDirective } from "vue";
import { createVNode as _createVNode } from "vue";
import { ref, watch, computed, onBeforeUnmount, getCurrentInstance } from 'vue';
import { isDef, addUnit, inBrowser, createNamespace } from '../utils';
import Icon from '../icon';

var _createNamespace = createNamespace('image'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    src: String,
    alt: String,
    fit: String,
    round: Boolean,
    width: [Number, String],
    height: [Number, String],
    radius: [Number, String],
    lazyLoad: Boolean,
    iconPrefix: String,
    showError: {
      type: Boolean,
      default: true
    },
    showLoading: {
      type: Boolean,
      default: true
    },
    errorIcon: {
      type: String,
      default: 'photo-fail'
    },
    loadingIcon: {
      type: String,
      default: 'photo'
    }
  },
  emits: ['load', 'error'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var error = ref(false);
    var loading = ref(true);
    var imageRef = ref(); // TODO: types

    var _ref2 = getCurrentInstance().proxy,
        $Lazyload = _ref2.$Lazyload;
    var style = computed(function () {
      var style = {};

      if (isDef(props.width)) {
        style.width = addUnit(props.width);
      }

      if (isDef(props.height)) {
        style.height = addUnit(props.height);
      }

      if (isDef(props.radius)) {
        style.overflow = 'hidden';
        style.borderRadius = addUnit(props.radius);
      }

      return style;
    });
    watch(function () {
      return props.src;
    }, function () {
      error.value = false;
      loading.value = true;
    });

    var onLoad = function onLoad(event) {
      loading.value = false;
      emit('load', event);
    };

    var onError = function onError(event) {
      error.value = true;
      loading.value = false;
      emit('error', event);
    };

    var renderLoadingIcon = function renderLoadingIcon() {
      if (slots.loading) {
        return slots.loading();
      }

      return _createVNode(Icon, {
        "name": props.loadingIcon,
        "class": bem('loading-icon'),
        "classPrefix": props.iconPrefix
      }, null);
    };

    var renderErrorIcon = function renderErrorIcon() {
      if (slots.error) {
        return slots.error();
      }

      return _createVNode(Icon, {
        "name": props.errorIcon,
        "class": bem('error-icon'),
        "classPrefix": props.iconPrefix
      }, null);
    };

    var renderPlaceholder = function renderPlaceholder() {
      if (loading.value && props.showLoading) {
        return _createVNode("div", {
          "class": bem('loading')
        }, [renderLoadingIcon()]);
      }

      if (error.value && props.showError) {
        return _createVNode("div", {
          "class": bem('error')
        }, [renderErrorIcon()]);
      }
    };

    var renderImage = function renderImage() {
      if (error.value || !props.src) {
        return;
      }

      var attrs = {
        alt: props.alt,
        class: bem('img'),
        style: {
          objectFit: props.fit
        }
      };

      if (props.lazyLoad) {
        return _withDirectives(_createVNode("img", _mergeProps({
          "ref": imageRef
        }, attrs), null), [[_resolveDirective("lazy"), props.src]]);
      }

      return _createVNode("img", _mergeProps({
        "src": props.src,
        "onLoad": onLoad,
        "onError": onError
      }, attrs), null);
    };

    var onLazyLoaded = function onLazyLoaded(_ref3) {
      var el = _ref3.el;

      if (el === imageRef.value && loading.value) {
        onLoad();
      }
    };

    var onLazyLoadError = function onLazyLoadError(_ref4) {
      var el = _ref4.el;

      if (el === imageRef.value && !error.value) {
        onError();
      }
    };

    if ($Lazyload && inBrowser) {
      $Lazyload.$on('loaded', onLazyLoaded);
      $Lazyload.$on('error', onLazyLoadError);
      onBeforeUnmount(function () {
        $Lazyload.$off('loaded', onLazyLoaded);
        $Lazyload.$off('error', onLazyLoadError);
      });
    }

    return function () {
      return _createVNode("div", {
        "class": bem({
          round: props.round
        }),
        "style": style.value
      }, [renderImage(), renderPlaceholder(), slots.default == null ? void 0 : slots.default()]);
    };
  }
});