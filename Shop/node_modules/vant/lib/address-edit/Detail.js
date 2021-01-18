"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _system = require("../utils/validate/system");

var _cell = _interopRequireDefault(require("../cell"));

var _field = _interopRequireDefault(require("../field"));

// Utils
// Components
var _createNamespace = (0, _utils.createNamespace)('address-edit-detail'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var android = (0, _system.isAndroid)();

var _default = createComponent({
  props: {
    show: Boolean,
    value: String,
    errorMessage: String,
    focused: Boolean,
    detailRows: [Number, String],
    searchResult: Array,
    detailMaxlength: [Number, String],
    showSearchResult: Boolean
  },
  emits: ['blur', 'focus', 'input', 'select-search'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit;
    var field = (0, _vue.ref)();

    var showSearchResult = function showSearchResult() {
      return props.focused && props.searchResult && props.showSearchResult;
    };

    var onSelect = function onSelect(express) {
      emit('select-search', express);
      emit('input', ((express.address || '') + " " + (express.name || '')).trim());
    };

    var onFinish = function onFinish() {
      field.value.blur();
    };

    var renderFinish = function renderFinish() {
      if (props.value && props.focused && android) {
        return (0, _vue.createVNode)("div", {
          "class": bem('finish'),
          "onClick": onFinish
        }, [t('complete')]);
      }
    };

    var renderSearchTitle = function renderSearchTitle(express) {
      if (express.name) {
        var text = express.name.replace(props.value, "<span class=" + bem('keyword') + ">" + props.value + "</span>");
        return (0, _vue.createVNode)("div", {
          "innerHTML": text
        }, null);
      }
    };

    var renderSearchResult = function renderSearchResult() {
      if (!showSearchResult()) {
        return;
      }

      var searchResult = props.searchResult;
      return searchResult.map(function (express) {
        return (0, _vue.createVNode)(_cell.default, {
          "clickable": true,
          "key": express.name + express.address,
          "icon": "location-o",
          "label": express.address,
          "class": bem('search-item'),
          "border": false,
          "onClick": function onClick() {
            onSelect(express);
          }
        }, {
          title: function title() {
            return renderSearchTitle(express);
          }
        });
      });
    };

    var onFocus = function onFocus(event) {
      emit('focus', event);
    };

    var onBlur = function onBlur(event) {
      emit('blur', event);
    };

    var onInput = function onInput(value) {
      emit('input', value);
    };

    return function () {
      if (props.show) {
        return (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)(_field.default, (0, _vue.mergeProps)({
          "autosize": true,
          "ref": field,
          "class": bem(),
          "rows": props.detailRows,
          "type": "textarea",
          "label": t('label'),
          "border": !showSearchResult(),
          "clearable": !android,
          "maxlength": props.detailMaxlength,
          "modelValue": props.value,
          "placeholder": t('placeholder'),
          "errorMessage": props.errorMessage,
          "onBlur": onBlur,
          "onFocus": onFocus
        }, {
          'onUpdate:modelValue': onInput
        }), {
          icon: renderFinish
        }), renderSearchResult()]);
      }
    };
  }
});

exports.default = _default;