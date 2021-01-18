"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.createTranslate = createTranslate;

var _base = require("../base");

var _string = require("../format/string");

var _locale = _interopRequireDefault(require("../../locale"));

function createTranslate(name) {
  var prefix = (0, _string.camelize)(name) + '.';
  return function (path) {
    var messages = _locale.default.messages();

    var message = (0, _base.get)(messages, prefix + path) || (0, _base.get)(messages, path);

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return (0, _base.isFunction)(message) ? message.apply(void 0, args) : message;
  };
}