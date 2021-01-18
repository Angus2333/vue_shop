"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _deepAssign = require("../utils/deep-assign");

var _zhCN = _interopRequireDefault(require("./lang/zh-CN"));

var lang = (0, _vue.ref)('zh-CN');

var _messages = (0, _vue.reactive)({
  'zh-CN': _zhCN.default
});

var _default = {
  messages: function messages() {
    return _messages[lang.value];
  },
  use: function use(newLang, newMessages) {
    var _this$add;

    lang.value = newLang;
    this.add((_this$add = {}, _this$add[newLang] = newMessages, _this$add));
  },
  add: function add(newMessages) {
    if (newMessages === void 0) {
      newMessages = {};
    }

    (0, _deepAssign.deepAssign)(_messages, newMessages);
  }
};
exports.default = _default;