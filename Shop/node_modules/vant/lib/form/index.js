"use strict";

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _use = require("@vant/use");

var _useLinkField = require("../composables/use-link-field");

var _useExpose = require("../composables/use-expose");

var _createNamespace = (0, _utils.createNamespace)('form'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var _default = createComponent({
  props: {
    colon: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    labelWidth: [Number, String],
    labelAlign: String,
    inputAlign: String,
    scrollToError: Boolean,
    validateFirst: Boolean,
    errorMessageAlign: String,
    submitOnEnter: {
      type: Boolean,
      default: true
    },
    validateTrigger: {
      type: String,
      default: 'onBlur'
    },
    showError: {
      type: Boolean,
      default: true
    },
    showErrorMessage: {
      type: Boolean,
      default: true
    }
  },
  emits: ['submit', 'failed'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;

    var _useChildren = (0, _use.useChildren)(_useLinkField.FORM_KEY),
        children = _useChildren.children,
        linkChildren = _useChildren.linkChildren;

    var getFieldsByNames = function getFieldsByNames(names) {
      if (names) {
        return children.filter(function (field) {
          return names.indexOf(field.name) !== -1;
        });
      }

      return children;
    };

    var validateSeq = function validateSeq(names) {
      return new Promise(function (resolve, reject) {
        var errors = [];
        var fields = getFieldsByNames(names);
        fields.reduce(function (promise, field) {
          return promise.then(function () {
            if (!errors.length) {
              return field.validate().then(function (error) {
                if (error) {
                  errors.push(error);
                }
              });
            }
          });
        }, Promise.resolve()).then(function () {
          if (errors.length) {
            reject(errors);
          } else {
            resolve();
          }
        });
      });
    };

    var validateAll = function validateAll(names) {
      return new Promise(function (resolve, reject) {
        var fields = getFieldsByNames(names);
        Promise.all(fields.map(function (item) {
          return item.validate();
        })).then(function (errors) {
          errors = errors.filter(function (item) {
            return item;
          });

          if (errors.length) {
            reject(errors);
          } else {
            resolve();
          }
        });
      });
    };

    var validateField = function validateField(name) {
      var matched = children.filter(function (item) {
        return item.name === name;
      });

      if (matched.length) {
        return new Promise(function (resolve, reject) {
          matched[0].validate().then(function (error) {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      }

      return Promise.reject();
    };

    var validate = function validate(name) {
      if (name && !Array.isArray(name)) {
        return validateField(name);
      }

      return props.validateFirst ? validateSeq(name) : validateAll(name);
    };

    var resetValidation = function resetValidation(name) {
      if (name && !Array.isArray(name)) {
        name = [name];
      }

      var fields = getFieldsByNames(name);
      fields.forEach(function (item) {
        item.resetValidation();
      });
    };

    var scrollToField = function scrollToField(name, options) {
      children.some(function (item) {
        if (item.name === name) {
          item.$el.scrollIntoView(options);
          return true;
        }

        return false;
      });
    };

    var getValues = function getValues() {
      return children.reduce(function (form, field) {
        form[field.name] = field.formValue.value;
        return form;
      }, {});
    };

    var submit = function submit() {
      var values = getValues();
      validate().then(function () {
        emit('submit', values);
      }).catch(function (errors) {
        emit('failed', {
          values: values,
          errors: errors
        });

        if (props.scrollToError) {
          scrollToField(errors[0].name);
        }
      });
    };

    var onSubmit = function onSubmit(event) {
      event.preventDefault();
      submit();
    };

    linkChildren({
      props: props
    });
    (0, _useExpose.useExpose)({
      submit: submit,
      validate: validate,
      scrollToField: scrollToField,
      resetValidation: resetValidation
    });
    return function () {
      return (0, _vue.createVNode)("form", {
        "class": bem(),
        "onSubmit": onSubmit
      }, [slots.default == null ? void 0 : slots.default()]);
    };
  }
});

exports.default = _default;