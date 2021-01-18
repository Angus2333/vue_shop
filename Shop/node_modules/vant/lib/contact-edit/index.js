"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../utils");

var _mobile = require("../utils/validate/mobile");

var _cell = _interopRequireDefault(require("../cell"));

var _field = _interopRequireDefault(require("../field"));

var _button = _interopRequireDefault(require("../button"));

var _dialog = _interopRequireDefault(require("../dialog"));

var _switch = _interopRequireDefault(require("../switch"));

// Utils
// Components
var _createNamespace = (0, _utils.createNamespace)('contact-edit'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var DEFAULT_CONTACT = {
  tel: '',
  name: ''
};

var _default2 = createComponent({
  props: {
    isEdit: Boolean,
    isSaving: Boolean,
    isDeleting: Boolean,
    showSetDefault: Boolean,
    setDefaultLabel: String,
    contactInfo: {
      type: Object,
      default: function _default() {
        return (0, _extends2.default)({}, DEFAULT_CONTACT);
      }
    },
    telValidator: {
      type: Function,
      default: _mobile.isMobile
    }
  },
  emits: ['save', 'delete', 'change-default'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit;
    var state = (0, _vue.reactive)({
      contact: (0, _extends2.default)({}, DEFAULT_CONTACT, props.contactInfo),
      errorInfo: {
        name: '',
        tel: ''
      }
    });

    var _onFocus = function onFocus(key) {
      state.errorInfo[key] = '';
    };

    var getErrorMessageByKey = function getErrorMessageByKey(key) {
      var value = state.contact[key].trim();

      switch (key) {
        case 'name':
          return value ? '' : t('nameInvalid');

        case 'tel':
          return props.telValidator(value) ? '' : t('telInvalid');
      }
    };

    var onSave = function onSave() {
      var isValid = ['name', 'tel'].every(function (item) {
        var msg = getErrorMessageByKey(item);

        if (msg) {
          state.errorInfo[item] = msg;
        }

        return !msg;
      });

      if (isValid && !props.isSaving) {
        emit('save', state.contact);
      }
    };

    var onDelete = function onDelete() {
      _dialog.default.confirm({
        title: t('confirmDelete')
      }).then(function () {
        emit('delete', state.contact);
      });
    };

    var renderButtons = function renderButtons() {
      return (0, _vue.createVNode)("div", {
        "class": bem('buttons')
      }, [(0, _vue.createVNode)(_button.default, {
        "block": true,
        "round": true,
        "type": "danger",
        "text": t('save'),
        "loading": props.isSaving,
        "onClick": onSave
      }, null), props.isEdit && (0, _vue.createVNode)(_button.default, {
        "block": true,
        "round": true,
        "text": t('delete'),
        "loading": props.isDeleting,
        "onClick": onDelete
      }, null)]);
    };

    var renderSwitch = function renderSwitch() {
      return (0, _vue.createVNode)(_switch.default, {
        "modelValue": state.contact.isDefault,
        "onUpdate:modelValue": function onUpdateModelValue($event) {
          return state.contact.isDefault = $event;
        },
        "size": 24,
        "onChange": function onChange(event) {
          emit('change-default', event);
        }
      }, null);
    };

    var renderSetDefault = function renderSetDefault() {
      if (props.showSetDefault) {
        return (0, _vue.createVNode)(_cell.default, {
          "title": props.setDefaultLabel,
          "class": bem('switch-cell'),
          "border": false
        }, {
          'right-icon': renderSwitch
        });
      }
    };

    (0, _vue.watch)(function () {
      return props.contactInfo;
    }, function (value) {
      state.contact = (0, _extends2.default)({}, DEFAULT_CONTACT, value);
    });
    return function () {
      var contact = state.contact,
          errorInfo = state.errorInfo;
      return (0, _vue.createVNode)("div", {
        "class": bem()
      }, [(0, _vue.createVNode)("div", {
        "class": bem('fields')
      }, [(0, _vue.createVNode)(_field.default, {
        "modelValue": contact.name,
        "onUpdate:modelValue": function onUpdateModelValue($event) {
          return contact.name = $event;
        },
        "clearable": true,
        "maxlength": "30",
        "label": t('name'),
        "placeholder": t('nameEmpty'),
        "errorMessage": errorInfo.name,
        "onFocus": function onFocus() {
          return _onFocus('name');
        }
      }, null), (0, _vue.createVNode)(_field.default, {
        "modelValue": contact.tel,
        "onUpdate:modelValue": function onUpdateModelValue($event) {
          return contact.tel = $event;
        },
        "clearable": true,
        "type": "tel",
        "label": t('tel'),
        "placeholder": t('telEmpty'),
        "errorMessage": errorInfo.tel,
        "onFocus": function onFocus() {
          return _onFocus('tel');
        }
      }, null)]), renderSetDefault(), renderButtons()]);
    };
  }
});

exports.default = _default2;