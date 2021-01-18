import { mergeProps as _mergeProps } from "vue";
import { Fragment as _Fragment } from "vue";
import { resolveDirective as _resolveDirective } from "vue";
import { createVNode as _createVNode } from "vue";
import { ref } from 'vue'; // Utils

import { createNamespace } from '../utils';
import { isAndroid } from '../utils/validate/system'; // Components

import Cell from '../cell';
import Field from '../field';

var _createNamespace = createNamespace('address-edit-detail'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var android = isAndroid();
export default createComponent({
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
    var field = ref();

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
        return _createVNode("div", {
          "class": bem('finish'),
          "onClick": onFinish
        }, [t('complete')]);
      }
    };

    var renderSearchTitle = function renderSearchTitle(express) {
      if (express.name) {
        var text = express.name.replace(props.value, "<span class=" + bem('keyword') + ">" + props.value + "</span>");
        return _createVNode("div", {
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
        return _createVNode(Cell, {
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
        return _createVNode(_Fragment, null, [_createVNode(Field, _mergeProps({
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