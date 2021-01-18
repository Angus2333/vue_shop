"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _utils2 = require("./utils");

var _use = require("@vant/use");

var _useExpose = require("../composables/use-expose");

var _useLinkField = require("../composables/use-link-field");

var _icon = _interopRequireDefault(require("../icon"));

var _cell = _interopRequireWildcard(require("../cell"));

// Utils
// Composition
// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('field'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default2 = createComponent({
  props: (0, _extends2.default)({}, _cell.cellProps, {
    rows: [Number, String],
    name: String,
    rules: Array,
    autosize: [Boolean, Object],
    leftIcon: String,
    rightIcon: String,
    clearable: Boolean,
    formatter: Function,
    maxlength: [Number, String],
    labelWidth: [Number, String],
    labelClass: null,
    labelAlign: String,
    inputAlign: String,
    placeholder: String,
    errorMessage: String,
    errorMessageAlign: String,
    showWordLimit: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    error: {
      type: Boolean,
      default: null
    },
    colon: {
      type: Boolean,
      default: null
    },
    disabled: {
      type: Boolean,
      default: null
    },
    readonly: {
      type: Boolean,
      default: null
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    clearTrigger: {
      type: String,
      default: 'focus'
    },
    formatTrigger: {
      type: String,
      default: 'onChange'
    }
  }),
  emits: ['blur', 'focus', 'clear', 'keypress', 'click-input', 'click-left-icon', 'click-right-icon', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var state = (0, _vue.reactive)({
      focused: false,
      validateFailed: false,
      validateMessage: ''
    });
    var inputRef = (0, _vue.ref)();
    var childFieldValue = (0, _vue.ref)();

    var _useParent = (0, _use.useParent)(_useLinkField.FORM_KEY),
        form = _useParent.parent;

    var getProp = function getProp(key) {
      if ((0, _utils.isDef)(props[key])) {
        return props[key];
      }

      if (form && (0, _utils.isDef)(form.props[key])) {
        return form.props[key];
      }
    };

    var showClear = (0, _vue.computed)(function () {
      var readonly = getProp('readonly');

      if (props.clearable && !readonly) {
        var hasValue = (0, _utils.isDef)(props.modelValue) && props.modelValue !== '';

        var _trigger = props.clearTrigger === 'always' || props.clearTrigger === 'focus' && state.focused;

        return hasValue && _trigger;
      }
    });
    var formValue = (0, _vue.computed)(function () {
      if (childFieldValue.value && slots.input) {
        return childFieldValue.value();
      }

      return props.modelValue;
    });

    var runValidator = function runValidator(value, rule) {
      return new Promise(function (resolve) {
        var returnVal = rule.validator(value, rule);

        if ((0, _utils.isPromise)(returnVal)) {
          return returnVal.then(resolve);
        }

        resolve(returnVal);
      });
    };

    var getRuleMessage = function getRuleMessage(value, rule) {
      var message = rule.message;

      if ((0, _utils.isFunction)(message)) {
        return message(value, rule);
      }

      return message;
    };

    var runRules = function runRules(rules) {
      return rules.reduce(function (promise, rule) {
        return promise.then(function () {
          if (state.validateFailed) {
            return;
          }

          var value = formValue.value;

          if (rule.formatter) {
            value = rule.formatter(value, rule);
          }

          if (!(0, _utils2.runSyncRule)(value, rule)) {
            state.validateFailed = true;
            state.validateMessage = getRuleMessage(value, rule);
            return;
          }

          if (rule.validator) {
            return runValidator(value, rule).then(function (result) {
              if (result === false) {
                state.validateFailed = true;
                state.validateMessage = getRuleMessage(value, rule);
              }
            });
          }
        });
      }, Promise.resolve());
    };

    var resetValidation = function resetValidation() {
      if (state.validateFailed) {
        state.validateFailed = false;
        state.validateMessage = '';
      }
    };

    var validate = function validate(rules) {
      if (rules === void 0) {
        rules = props.rules;
      }

      return new Promise(function (resolve) {
        if (!rules) {
          resolve();
        }

        resetValidation();
        runRules(rules).then(function () {
          if (state.validateFailed) {
            resolve({
              name: props.name,
              message: state.validateMessage
            });
          } else {
            resolve();
          }
        });
      });
    };

    var validateWithTrigger = function validateWithTrigger(trigger) {
      if (form && props.rules) {
        var defaultTrigger = form.props.validateTrigger === trigger;
        var rules = props.rules.filter(function (rule) {
          if (rule.trigger) {
            return rule.trigger === trigger;
          }

          return defaultTrigger;
        });
        validate(rules);
      }
    };

    var updateValue = function updateValue(value, trigger) {
      if (trigger === void 0) {
        trigger = 'onChange';
      }

      value = (0, _utils.isDef)(value) ? String(value) : ''; // native maxlength have incorrect line-break counting
      // see: https://github.com/youzan/vant/issues/5033

      var maxlength = props.maxlength,
          modelValue = props.modelValue;

      if ((0, _utils.isDef)(maxlength) && value.length > maxlength) {
        if (modelValue && modelValue.length === +maxlength) {
          value = modelValue;
        } else {
          value = value.slice(0, maxlength);
        }
      }

      if (props.type === 'number' || props.type === 'digit') {
        var isNumber = props.type === 'number';
        value = (0, _utils.formatNumber)(value, isNumber, isNumber);
      }

      if (props.formatter && trigger === props.formatTrigger) {
        value = props.formatter(value);
      }

      if (inputRef.value && value !== inputRef.value.value) {
        inputRef.value.value = value;
      }

      if (value !== props.modelValue) {
        emit('update:modelValue', value);
      }
    };

    var onInput = function onInput(event) {
      // skip update value when composing
      if (!event.target.composing) {
        updateValue(event.target.value);
      }
    };

    var focus = function focus() {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    };

    var blur = function blur() {
      if (inputRef.value) {
        inputRef.value.blur();
      }
    };

    var onFocus = function onFocus(event) {
      state.focused = true;
      emit('focus', event); // readonly not work in lagacy mobile safari

      var readonly = getProp('readonly');

      if (readonly) {
        blur();
      }
    };

    var onBlur = function onBlur(event) {
      state.focused = false;
      updateValue(props.modelValue, 'onBlur');
      emit('blur', event);
      validateWithTrigger('onBlur');
      (0, _utils.resetScroll)();
    };

    var onClickInput = function onClickInput(event) {
      emit('click-input', event);
    };

    var onClickLeftIcon = function onClickLeftIcon(event) {
      emit('click-left-icon', event);
    };

    var onClickRightIcon = function onClickRightIcon(event) {
      emit('click-right-icon', event);
    };

    var onClear = function onClear(event) {
      (0, _utils.preventDefault)(event);
      emit('update:modelValue', '');
      emit('clear', event);
    };

    var showError = (0, _vue.computed)(function () {
      if (typeof props.error === 'boolean') {
        return props.error;
      }

      if (form && form.props.showError && state.validateFailed) {
        return true;
      }
    });
    var labelStyle = (0, _vue.computed)(function () {
      var labelWidth = getProp('labelWidth');

      if (labelWidth) {
        return {
          width: (0, _utils.addUnit)(labelWidth)
        };
      }
    });

    var onKeypress = function onKeypress(event) {
      var ENTER_CODE = 13;

      if (event.keyCode === ENTER_CODE) {
        var submitOnEnter = getProp('submitOnEnter');

        if (!submitOnEnter && props.type !== 'textarea') {
          (0, _utils.preventDefault)(event);
        } // trigger blur after click keyboard search button


        if (props.type === 'search') {
          blur();
        }
      }

      emit('keypress', event);
    };

    var onCompositionStart = function onCompositionStart(event) {
      event.target.composing = true;
    };

    var onCompositionEnd = function onCompositionEnd(event) {
      var target = event.target;

      if (target.composing) {
        target.composing = false;
        (0, _utils.trigger)(target, 'input');
      }
    };

    var adjustSize = function adjustSize() {
      var input = inputRef.value;

      if (!(props.type === 'textarea' && props.autosize) || !input) {
        return;
      }

      input.style.height = 'auto';
      var height = input.scrollHeight;

      if ((0, _utils.isObject)(props.autosize)) {
        var _props$autosize = props.autosize,
            maxHeight = _props$autosize.maxHeight,
            minHeight = _props$autosize.minHeight;

        if (maxHeight) {
          height = Math.min(height, maxHeight);
        }

        if (minHeight) {
          height = Math.max(height, minHeight);
        }
      }

      if (height) {
        input.style.height = height + 'px';
      }
    };

    var renderInput = function renderInput() {
      var disabled = getProp('disabled');
      var readonly = getProp('readonly');
      var inputAlign = getProp('inputAlign');

      if (slots.input) {
        return (0, _vue.createVNode)("div", {
          "class": bem('control', [inputAlign, 'custom']),
          "onClick": onClickInput
        }, [slots.input()]);
      }

      var inputProps = {
        ref: inputRef,
        name: props.name,
        rows: props.rows,
        class: bem('control', inputAlign),
        value: props.modelValue,
        disabled: disabled,
        readonly: readonly,
        placeholder: props.placeholder,
        onBlur: onBlur,
        onFocus: onFocus,
        onInput: onInput,
        onClick: onClickInput,
        onChange: onCompositionEnd,
        onKeypress: onKeypress,
        onCompositionend: onCompositionEnd,
        onCompositionstart: onCompositionStart
      };
      var type = props.type;

      if (type === 'textarea') {
        return (0, _vue.createVNode)("textarea", inputProps, null);
      }

      var inputType = type;
      var inputMode; // type="number" is weired in iOS, and can't prevent dot in Android
      // so use inputmode to set keyboard in mordern browers

      if (type === 'number') {
        inputType = 'text';
        inputMode = 'decimal';
      }

      if (type === 'digit') {
        inputType = 'tel';
        inputMode = 'numeric';
      }

      return (0, _vue.createVNode)("input", (0, _vue.mergeProps)({
        "type": inputType,
        "inputmode": inputMode
      }, inputProps), null);
    };

    var renderLeftIcon = function renderLeftIcon() {
      var leftIconSlot = slots['left-icon'];

      if (props.leftIcon || leftIconSlot) {
        return (0, _vue.createVNode)("div", {
          "class": bem('left-icon'),
          "onClick": onClickLeftIcon
        }, [leftIconSlot ? leftIconSlot() : (0, _vue.createVNode)(_icon.default, {
          "name": props.leftIcon,
          "classPrefix": props.iconPrefix
        }, null)]);
      }
    };

    var renderRightIcon = function renderRightIcon() {
      var rightIconSlot = slots['right-icon'];

      if (props.rightIcon || rightIconSlot) {
        return (0, _vue.createVNode)("div", {
          "class": bem('right-icon'),
          "onClick": onClickRightIcon
        }, [rightIconSlot ? rightIconSlot() : (0, _vue.createVNode)(_icon.default, {
          "name": props.rightIcon,
          "classPrefix": props.iconPrefix
        }, null)]);
      }
    };

    var renderWordLimit = function renderWordLimit() {
      if (props.showWordLimit && props.maxlength) {
        var count = (props.modelValue || '').length;
        return (0, _vue.createVNode)("div", {
          "class": bem('word-limit')
        }, [(0, _vue.createVNode)("span", {
          "class": bem('word-num')
        }, _isSlot(count) ? count : {
          default: function _default() {
            return [count];
          }
        }), (0, _vue.createTextVNode)("/"), props.maxlength]);
      }
    };

    var renderMessage = function renderMessage() {
      if (form && form.props.showErrorMessage === false) {
        return;
      }

      var message = props.errorMessage || state.validateMessage;

      if (message) {
        var errorMessageAlign = getProp('errorMessageAlign');
        return (0, _vue.createVNode)("div", {
          "class": bem('error-message', errorMessageAlign)
        }, _isSlot(message) ? message : {
          default: function _default() {
            return [message];
          }
        });
      }
    };

    var renderLabel = function renderLabel() {
      var colon = getProp('colon') ? ':' : '';

      if (slots.label) {
        return [slots.label(), colon];
      }

      if (props.label) {
        return (0, _vue.createVNode)("span", null, [props.label + colon]);
      }
    };

    (0, _useExpose.useExpose)({
      blur: blur,
      focus: focus,
      validate: validate,
      formValue: formValue,
      resetValidation: resetValidation
    });
    (0, _vue.provide)(_useLinkField.FIELD_KEY, {
      childFieldValue: childFieldValue,
      resetValidation: resetValidation,
      validateWithTrigger: validateWithTrigger
    });
    (0, _vue.watch)(function () {
      return props.modelValue;
    }, function (value) {
      updateValue(value);
      resetValidation();
      validateWithTrigger('onChange');
      (0, _vue.nextTick)(adjustSize);
    });
    (0, _vue.onMounted)(function () {
      updateValue(props.modelValue, props.formatTrigger);
      (0, _vue.nextTick)(adjustSize);
    });
    return function () {
      var _bem;

      var disabled = getProp('disabled');
      var labelAlign = getProp('labelAlign');
      var Label = renderLabel();
      var LeftIcon = renderLeftIcon();
      return (0, _vue.createVNode)(_cell.default, {
        "size": props.size,
        "icon": props.leftIcon,
        "class": bem((_bem = {
          error: showError.value,
          disabled: disabled
        }, _bem["label-" + labelAlign] = labelAlign, _bem['min-height'] = props.type === 'textarea' && !props.autosize, _bem)),
        "center": props.center,
        "border": props.border,
        "isLink": props.isLink,
        "required": props.required,
        "clickable": props.clickable,
        "titleStyle": labelStyle.value,
        "valueClass": bem('value'),
        "titleClass": [bem('label', labelAlign), props.labelClass],
        "arrowDirection": props.arrowDirection
      }, {
        default: function _default() {
          return [(0, _vue.createVNode)("div", {
            "class": bem('body')
          }, [renderInput(), showClear.value && (0, _vue.createVNode)(_icon.default, {
            "name": "clear",
            "class": bem('clear'),
            "onTouchstart": onClear
          }, null), renderRightIcon(), slots.button && (0, _vue.createVNode)("div", {
            "class": bem('button')
          }, [slots.button()])]), renderWordLimit(), renderMessage()];
        },
        icon: LeftIcon ? function () {
          return LeftIcon;
        } : null,
        title: Label ? function () {
          return Label;
        } : null,
        extra: slots.extra
      });
    };
  }
});

exports.default = _default2;