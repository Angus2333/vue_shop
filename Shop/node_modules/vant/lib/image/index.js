"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _icon = _interopRequireDefault(require("../icon"));

var _createNamespace = (0, _utils.createNamespace)('image'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default = createComponent({
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
    var error = (0, _vue.ref)(false);
    var loading = (0, _vue.ref)(true);
    var imageRef = (0, _vue.ref)(); // TODO: types

    var _ref2 = (0, _vue.getCurrentInstance)().proxy,
        $Lazyload = _ref2.$Lazyload;
    var style = (0, _vue.computed)(function () {
      var style = {};

      if ((0, _utils.isDef)(props.width)) {
        style.width = (0, _utils.addUnit)(props.width);
      }

      if ((0, _utils.isDef)(props.height)) {
        style.height = (0, _utils.addUnit)(props.height);
      }

      if ((0, _utils.isDef)(props.radius)) {
        style.overflow = 'hidden';
        style.borderRadius = (0, _utils.addUnit)(props.radius);
      }

      return style;
    });
    (0, _vue.watch)(function () {
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

      return (0, _vue.createVNode)(_icon.default, {
        "name": props.loadingIcon,
        "class": bem('loading-icon'),
        "classPrefix": props.iconPrefix
      }, null);
    };

    var renderErrorIcon = function renderErrorIcon() {
      if (slots.error) {
        return slots.error();
      }

      return (0, _vue.createVNode)(_icon.default, {
        "name": props.errorIcon,
        "class": bem('error-icon'),
        "classPrefix": props.iconPrefix
      }, null);
    };

    var renderPlaceholder = function renderPlaceholder() {
      if (loading.value && props.showLoading) {
        return (0, _vue.createVNode)("div", {
          "class": bem('loading')
        }, [renderLoadingIcon()]);
      }

      if (error.value && props.showError) {
        return (0, _vue.createVNode)("div", {
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
        return (0, _vue.withDirectives)((0, _vue.createVNode)("img", (0, _vue.mergeProps)({
          "ref": imageRef
        }, attrs), null), [[(0, _vue.resolveDirective)("lazy"), props.src]]);
      }

      return (0, _vue.createVNode)("img", (0, _vue.mergeProps)({
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

    if ($Lazyload && _utils.inBrowser) {
      $Lazyload.$on('loaded', onLazyLoaded);
      $Lazyload.$on('error', onLazyLoadError);
      (0, _vue.onBeforeUnmount)(function () {
        $Lazyload.$off('loaded', onLazyLoaded);
        $Lazyload.$off('error', onLazyLoadError);
      });
    }

    return function () {
      return (0, _vue.createVNode)("div", {
        "class": bem({
          round: props.round
        }),
        "style": style.value
      }, [renderImage(), renderPlaceholder(), slots.default == null ? void 0 : slots.default()]);
    };
  }
});

exports.default = _default;