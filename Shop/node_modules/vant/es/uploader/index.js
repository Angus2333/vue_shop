import { createVNode as _createVNode } from "vue";
import { mergeProps as _mergeProps } from "vue";
import { resolveDirective as _resolveDirective } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { ref, reactive } from 'vue'; // Utils

import { bem, createComponent } from './shared';
import { isPromise, getSizeStyle, pick } from '../utils';
import { toArray, isOversize, filterFiles, isImageFile, readFileContent } from './utils'; // Composition

import { useExpose } from '../composables/use-expose';
import { useLinkField } from '../composables/use-link-field'; // Components

import Icon from '../icon';
import PreviewItem from './PreviewItem';
import ImagePreview from '../image-preview';
export default createComponent({
  props: {
    capture: String,
    multiple: Boolean,
    disabled: Boolean,
    lazyLoad: Boolean,
    uploadText: String,
    afterRead: Function,
    beforeRead: Function,
    beforeDelete: Function,
    previewSize: [Number, String],
    previewOptions: Object,
    name: {
      type: [Number, String],
      default: ''
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    modelValue: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    maxSize: {
      type: [Number, String],
      default: Number.MAX_VALUE
    },
    maxCount: {
      type: [Number, String],
      default: Number.MAX_VALUE
    },
    deletable: {
      type: Boolean,
      default: true
    },
    showUpload: {
      type: Boolean,
      default: true
    },
    previewImage: {
      type: Boolean,
      default: true
    },
    previewFullImage: {
      type: Boolean,
      default: true
    },
    imageFit: {
      type: String,
      default: 'cover'
    },
    resultType: {
      type: String,
      default: 'dataUrl'
    },
    uploadIcon: {
      type: String,
      default: 'photograph'
    }
  },
  emits: ['delete', 'oversize', 'close-preview', 'click-preview', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var inputRef = ref();

    var getDetail = function getDetail(index) {
      if (index === void 0) {
        index = props.modelValue.length;
      }

      return {
        name: props.name,
        index: index
      };
    };

    var resetInput = function resetInput() {
      if (inputRef.value) {
        inputRef.value.value = '';
      }
    };

    var onAfterRead = function onAfterRead(items) {
      resetInput();

      if (isOversize(items, props.maxSize)) {
        if (Array.isArray(items)) {
          var result = filterFiles(items, props.maxSize);
          items = result.valid;
          emit('oversize', result.invalid, getDetail());

          if (!items.length) {
            return;
          }
        } else {
          emit('oversize', items, getDetail());
          return;
        }
      }

      items = reactive(items);
      emit('update:modelValue', [].concat(props.modelValue, toArray(items)));

      if (props.afterRead) {
        props.afterRead(items, getDetail());
      }
    };

    var readFile = function readFile(files) {
      var maxCount = props.maxCount,
          modelValue = props.modelValue,
          resultType = props.resultType;

      if (Array.isArray(files)) {
        var remainCount = maxCount - modelValue.length;

        if (files.length > remainCount) {
          files = files.slice(0, remainCount);
        }

        Promise.all(files.map(function (file) {
          return readFileContent(file, resultType);
        })).then(function (contents) {
          var fileList = files.map(function (file, index) {
            var result = {
              file: file,
              status: '',
              message: ''
            };

            if (contents[index]) {
              result.content = contents[index];
            }

            return result;
          });
          onAfterRead(fileList);
        });
      } else {
        readFileContent(files, resultType).then(function (content) {
          var result = {
            file: files,
            status: '',
            message: ''
          };

          if (content) {
            result.content = content;
          }

          onAfterRead(result);
        });
      }
    };

    var onChange = function onChange(event) {
      var files = event.target.files;

      if (props.disabled || !files.length) {
        return;
      }

      files = files.length === 1 ? files[0] : [].slice.call(files);

      if (props.beforeRead) {
        var response = props.beforeRead(files, getDetail());

        if (!response) {
          resetInput();
          return;
        }

        if (isPromise(response)) {
          response.then(function (data) {
            if (data) {
              readFile(data);
            } else {
              readFile(files);
            }
          }).catch(resetInput);
          return;
        }
      }

      readFile(files);
    };

    var imagePreview;

    var onClosePreview = function onClosePreview() {
      emit('close-preview');
    };

    var previewImage = function previewImage(item) {
      if (props.previewFullImage) {
        var imageFiles = props.modelValue.filter(isImageFile);
        var images = imageFiles.map(function (item) {
          return item.content || item.url;
        });
        imagePreview = ImagePreview(_extends({
          images: images,
          startPosition: imageFiles.indexOf(item),
          onClose: onClosePreview
        }, props.previewOptions));
      }
    };

    var closeImagePreview = function closeImagePreview() {
      if (imagePreview) {
        imagePreview.close();
      }
    };

    var deleteFile = function deleteFile(item, index) {
      var fileList = props.modelValue.slice(0);
      fileList.splice(index, 1);
      emit('update:modelValue', fileList);
      emit('delete', item, getDetail(index));
    };

    var renderPreviewItem = function renderPreviewItem(item, index) {
      var needPickData = ['imageFit', 'deletable', 'previewSize', 'beforeDelete'];
      var previewData = pick(props, needPickData);
      var previewProp = pick(item, needPickData);
      Object.keys(previewProp).forEach(function (item) {
        if (previewProp[item] !== undefined) {
          previewData[item] = previewProp[item];
        }
      });
      return _createVNode(PreviewItem, _mergeProps({
        "item": item,
        "index": index,
        "onClick": function onClick() {
          emit('click-preview', item, getDetail(index));
        },
        "onDelete": function onDelete() {
          deleteFile(item, index);
        },
        "onPreview": function onPreview() {
          previewImage(item);
        }
      }, pick(props, ['name', 'lazyLoad']), previewData), {
        'preview-cover': slots['preview-cover']
      });
    };

    var renderPreviewList = function renderPreviewList() {
      if (props.previewImage) {
        return props.modelValue.map(renderPreviewItem);
      }
    };

    var renderUpload = function renderUpload() {
      if (props.modelValue.length >= props.maxCount || !props.showUpload) {
        return;
      }

      var Input = _createVNode("input", {
        "ref": inputRef,
        "type": "file",
        "class": bem('input'),
        "accept": props.accept,
        "capture": props.capture,
        "multiple": props.multiple,
        "disabled": props.disabled,
        "onChange": onChange
      }, null);

      if (slots.default) {
        return _createVNode("div", {
          "class": bem('input-wrapper')
        }, [slots.default(), Input]);
      }

      return _createVNode("div", {
        "class": bem('upload'),
        "style": getSizeStyle(props.previewSize)
      }, [_createVNode(Icon, {
        "name": props.uploadIcon,
        "class": bem('upload-icon')
      }, null), props.uploadText && _createVNode("span", {
        "class": bem('upload-text')
      }, [props.uploadText]), Input]);
    };

    var chooseFile = function chooseFile() {
      if (inputRef.value && !props.disabled) {
        inputRef.value.click();
      }
    };

    useExpose({
      chooseFile: chooseFile,
      closeImagePreview: closeImagePreview
    });
    useLinkField(function () {
      return props.modelValue;
    });
    return function () {
      return _createVNode("div", {
        "class": bem()
      }, [_createVNode("div", {
        "class": bem('wrapper', {
          disabled: props.disabled
        })
      }, [renderPreviewList(), renderUpload()])]);
    };
  }
});