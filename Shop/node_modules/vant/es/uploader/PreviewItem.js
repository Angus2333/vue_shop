import _extends from "@babel/runtime/helpers/esm/extends";
import { isVNode as _isVNode } from "vue";
import { createVNode as _createVNode } from "vue";
import { bem } from './shared';
import { isImageFile } from './utils';
import { isDef, getSizeStyle } from '../utils';
import { callInterceptor } from '../utils/interceptor'; // Components

import Icon from '../icon';
import Image from '../image';
import Loading from '../loading';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

export default {
  props: {
    name: String,
    item: Object,
    index: Number,
    imageFit: String,
    lazyLoad: Boolean,
    deletable: Boolean,
    previewSize: [Number, String],
    beforeDelete: Function
  },
  emits: ['delete', 'preview'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var renderMask = function renderMask() {
      var _props$item = props.item,
          status = _props$item.status,
          message = _props$item.message;

      if (status === 'uploading' || status === 'failed') {
        var MaskIcon = status === 'failed' ? _createVNode(Icon, {
          "name": "close",
          "class": bem('mask-icon')
        }, null) : _createVNode(Loading, {
          "class": bem('loading')
        }, null);
        var showMessage = isDef(message) && message !== '';
        return _createVNode("div", {
          "class": bem('mask')
        }, [MaskIcon, showMessage && _createVNode("div", {
          "class": bem('mask-message')
        }, _isSlot(message) ? message : {
          default: function _default() {
            return [message];
          }
        })]);
      }
    };

    var onDelete = function onDelete(event) {
      var name = props.name,
          item = props.item,
          index = props.index,
          beforeDelete = props.beforeDelete;
      event.stopPropagation();
      callInterceptor({
        interceptor: beforeDelete,
        args: [item, {
          name: name,
          index: index
        }],
        done: function done() {
          emit('delete');
        }
      });
    };

    var onPreview = function onPreview() {
      emit('preview');
    };

    var renderDeleteIcon = function renderDeleteIcon() {
      if (props.deletable && props.item.status !== 'uploading') {
        return _createVNode("div", {
          "class": bem('preview-delete'),
          "onClick": onDelete
        }, [_createVNode(Icon, {
          "name": "cross",
          "class": bem('preview-delete-icon')
        }, null)]);
      }
    };

    var renderCover = function renderCover() {
      if (slots['preview-cover']) {
        var index = props.index,
            item = props.item;
        return _createVNode("div", {
          "class": bem('preview-cover')
        }, [slots['preview-cover'](_extends({
          index: index
        }, item))]);
      }
    };

    var renderPreview = function renderPreview() {
      var item = props.item;

      if (isImageFile(item)) {
        var _slot;

        return _createVNode(Image, {
          "fit": props.imageFit,
          "src": item.content || item.url,
          "class": bem('preview-image'),
          "width": props.previewSize,
          "height": props.previewSize,
          "lazyLoad": props.lazyLoad,
          "onClick": onPreview
        }, _isSlot(_slot = renderCover()) ? _slot : {
          default: function _default() {
            return [_slot];
          }
        });
      }

      return _createVNode("div", {
        "class": bem('file'),
        "style": getSizeStyle(props.previewSize)
      }, [_createVNode(Icon, {
        "class": bem('file-icon'),
        "name": "description"
      }, null), _createVNode("div", {
        "class": [bem('file-name'), 'van-ellipsis']
      }, [item.file ? item.file.name : item.url]), renderCover()]);
    };

    return function () {
      return _createVNode("div", {
        "class": bem('preview')
      }, [renderPreview(), renderMask(), renderDeleteIcon()]);
    };
  }
};