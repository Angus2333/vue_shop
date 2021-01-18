"use strict";

exports.__esModule = true;
exports.pickerProps = exports.PICKER_KEY = void 0;
var PICKER_KEY = 'vanPicker';
exports.PICKER_KEY = PICKER_KEY;
var pickerProps = {
  title: String,
  loading: Boolean,
  readonly: Boolean,
  allowHtml: Boolean,
  cancelButtonText: String,
  confirmButtonText: String,
  itemHeight: {
    type: [Number, String],
    default: 44
  },
  showToolbar: {
    type: Boolean,
    default: true
  },
  visibleItemCount: {
    type: [Number, String],
    default: 6
  },
  swipeDuration: {
    type: [Number, String],
    default: 1000
  }
};
exports.pickerProps = pickerProps;