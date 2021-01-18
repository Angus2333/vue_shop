import { resolveDirective as _resolveDirective } from "vue";
import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { watch, reactive } from 'vue'; // Utils

import { createNamespace } from '../utils';
import { isMobile } from '../utils/validate/mobile'; // Components

import Cell from '../cell';
import Field from '../field';
import Button from '../button';
import Dialog from '../dialog';
import Switch from '../switch';

var _createNamespace = createNamespace('contact-edit'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var DEFAULT_CONTACT = {
  tel: '',
  name: ''
};
export default createComponent({
  props: {
    isEdit: Boolean,
    isSaving: Boolean,
    isDeleting: Boolean,
    showSetDefault: Boolean,
    setDefaultLabel: String,
    contactInfo: {
      type: Object,
      default: function _default() {
        return _extends({}, DEFAULT_CONTACT);
      }
    },
    telValidator: {
      type: Function,
      default: isMobile
    }
  },
  emits: ['save', 'delete', 'change-default'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit;
    var state = reactive({
      contact: _extends({}, DEFAULT_CONTACT, props.contactInfo),
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
      Dialog.confirm({
        title: t('confirmDelete')
      }).then(function () {
        emit('delete', state.contact);
      });
    };

    var renderButtons = function renderButtons() {
      return _createVNode("div", {
        "class": bem('buttons')
      }, [_createVNode(Button, {
        "block": true,
        "round": true,
        "type": "danger",
        "text": t('save'),
        "loading": props.isSaving,
        "onClick": onSave
      }, null), props.isEdit && _createVNode(Button, {
        "block": true,
        "round": true,
        "text": t('delete'),
        "loading": props.isDeleting,
        "onClick": onDelete
      }, null)]);
    };

    var renderSwitch = function renderSwitch() {
      return _createVNode(Switch, {
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
        return _createVNode(Cell, {
          "title": props.setDefaultLabel,
          "class": bem('switch-cell'),
          "border": false
        }, {
          'right-icon': renderSwitch
        });
      }
    };

    watch(function () {
      return props.contactInfo;
    }, function (value) {
      state.contact = _extends({}, DEFAULT_CONTACT, value);
    });
    return function () {
      var contact = state.contact,
          errorInfo = state.errorInfo;
      return _createVNode("div", {
        "class": bem()
      }, [_createVNode("div", {
        "class": bem('fields')
      }, [_createVNode(Field, {
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
      }, null), _createVNode(Field, {
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