import { isVNode as _isVNode } from "vue";
import { withDirectives as _withDirectives } from "vue";
import { vShow as _vShow } from "vue";
import { resolveDirective as _resolveDirective } from "vue";
import { createVNode as _createVNode } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { h, ref, watch, computed, nextTick, reactive } from 'vue'; // Utils

import { createNamespace, isObject } from '../utils';
import { isMobile } from '../utils/validate/mobile'; // Composition

import { useExpose } from '../composables/use-expose'; // Components

import Area from '../area';
import Cell from '../cell';
import Field from '../field';
import Popup from '../popup';
import Toast from '../toast';
import Button from '../button';
import Dialog from '../dialog';
import Detail from './Detail';
import Switch from '../switch';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('address-edit'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var defaultData = {
  name: '',
  tel: '',
  country: '',
  province: '',
  city: '',
  county: '',
  areaCode: '',
  postalCode: '',
  addressDetail: '',
  isDefault: false
};

function isPostal(value) {
  return /^\d{6}$/.test(value);
}

export default createComponent({
  props: {
    areaList: Object,
    isSaving: Boolean,
    isDeleting: Boolean,
    validator: Function,
    showDelete: Boolean,
    showPostal: Boolean,
    disableArea: Boolean,
    searchResult: Array,
    telMaxlength: [Number, String],
    showSetDefault: Boolean,
    saveButtonText: String,
    areaPlaceholder: String,
    deleteButtonText: String,
    showSearchResult: Boolean,
    showArea: {
      type: Boolean,
      default: true
    },
    showDetail: {
      type: Boolean,
      default: true
    },
    detailRows: {
      type: [Number, String],
      default: 1
    },
    detailMaxlength: {
      type: [Number, String],
      default: 200
    },
    addressInfo: {
      type: Object,
      default: function _default() {
        return _extends({}, defaultData);
      }
    },
    telValidator: {
      type: Function,
      default: isMobile
    },
    postalValidator: {
      type: Function,
      default: isPostal
    },
    areaColumnsPlaceholder: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  emits: ['save', 'focus', 'delete', 'click-area', 'change-area', 'change-detail', 'cancel-delete', 'select-search', 'change-default'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var areaRef = ref();
    var state = reactive({
      data: {},
      showAreaPopup: false,
      detailFocused: false,
      errorInfo: {
        tel: '',
        name: '',
        areaCode: '',
        postalCode: '',
        addressDetail: ''
      }
    });
    var areaListLoaded = computed(function () {
      return isObject(props.areaList) && Object.keys(props.areaList).length;
    });
    var areaText = computed(function () {
      var _state$data = state.data,
          country = _state$data.country,
          province = _state$data.province,
          city = _state$data.city,
          county = _state$data.county,
          areaCode = _state$data.areaCode;

      if (areaCode) {
        var arr = [country, province, city, county];

        if (province && province === city) {
          arr.splice(1, 1);
        }

        return arr.filter(function (text) {
          return text;
        }).join('/');
      }

      return '';
    }); // hide bottom field when use search && detail get focused

    var hideBottomFields = computed(function () {
      var searchResult = props.searchResult;
      return searchResult && searchResult.length && state.detailFocused;
    });

    var assignAreaValues = function assignAreaValues() {
      if (areaRef.value) {
        var detail = areaRef.value.getArea();
        detail.areaCode = detail.code;
        delete detail.code;

        _extends(state.data, detail);
      }
    };

    var _onFocus = function onFocus(key) {
      state.errorInfo[key] = '';
      state.detailFocused = key === 'addressDetail';
      emit('focus', key);
    };

    var getErrorMessage = function getErrorMessage(key) {
      var value = String(state.data[key] || '').trim();

      if (props.validator) {
        var message = props.validator(key, value);

        if (message) {
          return message;
        }
      }

      switch (key) {
        case 'name':
          return value ? '' : t('nameEmpty');

        case 'tel':
          return props.telValidator(value) ? '' : t('telInvalid');

        case 'areaCode':
          return value ? '' : t('areaEmpty');

        case 'addressDetail':
          return value ? '' : t('addressEmpty');

        case 'postalCode':
          return value && !props.postalValidator(value) ? t('postalEmpty') : '';
      }
    };

    var onSave = function onSave() {
      var items = ['name', 'tel'];

      if (props.showArea) {
        items.push('areaCode');
      }

      if (props.showDetail) {
        items.push('addressDetail');
      }

      if (props.showPostal) {
        items.push('postalCode');
      }

      var isValid = items.every(function (item) {
        var msg = getErrorMessage(item);

        if (msg) {
          state.errorInfo[item] = msg;
        }

        return !msg;
      });

      if (isValid && !props.isSaving) {
        emit('save', state.data);
      }
    };

    var onChangeDetail = function onChangeDetail(val) {
      state.data.addressDetail = val;
      emit('change-detail', val);
    };

    var onAreaConfirm = function onAreaConfirm(values) {
      values = values.filter(function (value) {
        return !!value;
      });

      if (values.some(function (value) {
        return !value.code;
      })) {
        Toast(t('areaEmpty'));
        return;
      }

      state.showAreaPopup = false;
      assignAreaValues();
      emit('change-area', values);
    };

    var onDelete = function onDelete() {
      Dialog.confirm({
        title: t('confirmDelete')
      }).then(function () {
        emit('delete', state.data);
      }).catch(function () {
        emit('cancel-delete', state.data);
      });
    }; // get values of area component


    var getArea = function getArea() {
      return areaRef.value ? areaRef.value.getValues() : [];
    }; // set area code to area component


    var setAreaCode = function setAreaCode(code) {
      state.data.areaCode = code || '';

      if (code) {
        nextTick(assignAreaValues);
      }
    };

    var onDetailBlur = function onDetailBlur() {
      // await for click search event
      setTimeout(function () {
        state.detailFocused = false;
      });
    };

    var setAddressDetail = function setAddressDetail(value) {
      state.data.addressDetail = value;
    };

    var renderSetDefaultCell = function renderSetDefaultCell() {
      if (props.showSetDefault) {
        var _slots = {
          'right-icon': function rightIcon() {
            return _createVNode(Switch, {
              "modelValue": state.data.isDefault,
              "onUpdate:modelValue": function onUpdateModelValue($event) {
                return state.data.isDefault = $event;
              },
              "size": "24",
              "onChange": function onChange(event) {
                emit('change-default', event);
              }
            }, null);
          }
        };
        return _withDirectives(_createVNode(Cell, {
          "center": true,
          "title": t('defaultAddress'),
          "class": bem('default')
        }, _extends({}, _slots)), [[_vShow, !hideBottomFields.value]]);
      }

      return h();
    };

    useExpose({
      getArea: getArea,
      setAddressDetail: setAddressDetail
    });
    watch(function () {
      return props.areaList;
    }, function () {
      setAreaCode(state.data.areaCode);
    });
    watch(function () {
      return props.addressInfo;
    }, function (value) {
      state.data = _extends({}, defaultData, value);
      setAreaCode(value.areaCode);
    }, {
      deep: true,
      immediate: true
    });
    return function () {
      var _slot;

      var data = state.data,
          errorInfo = state.errorInfo;
      var disableArea = props.disableArea;
      return _createVNode("div", {
        "class": bem()
      }, [_createVNode("div", {
        "class": bem('fields')
      }, [_createVNode(Field, {
        "modelValue": data.name,
        "onUpdate:modelValue": function onUpdateModelValue($event) {
          return data.name = $event;
        },
        "clearable": true,
        "label": t('name'),
        "placeholder": t('namePlaceholder'),
        "errorMessage": errorInfo.name,
        "onFocus": function onFocus() {
          return _onFocus('name');
        }
      }, null), _createVNode(Field, {
        "modelValue": data.tel,
        "onUpdate:modelValue": function onUpdateModelValue($event) {
          return data.tel = $event;
        },
        "clearable": true,
        "type": "tel",
        "label": t('tel'),
        "maxlength": props.telMaxlength,
        "placeholder": t('telPlaceholder'),
        "errorMessage": errorInfo.tel,
        "onFocus": function onFocus() {
          return _onFocus('tel');
        }
      }, null), _withDirectives(_createVNode(Field, {
        "readonly": true,
        "label": t('area'),
        "clickable": !disableArea,
        "rightIcon": !disableArea ? 'arrow' : null,
        "modelValue": areaText.value,
        "placeholder": props.areaPlaceholder || t('areaPlaceholder'),
        "errorMessage": errorInfo.areaCode,
        "onFocus": function onFocus() {
          return _onFocus('areaCode');
        },
        "onClick": function onClick() {
          emit('click-area');
          state.showAreaPopup = !disableArea;
        }
      }, null), [[_vShow, props.showArea]]), _createVNode(Detail, {
        "show": props.showDetail,
        "value": data.addressDetail,
        "focused": state.detailFocused,
        "detailRows": props.detailRows,
        "errorMessage": errorInfo.addressDetail,
        "searchResult": props.searchResult,
        "detailMaxlength": props.detailMaxlength,
        "showSearchResult": props.showSearchResult,
        "onBlur": onDetailBlur,
        "onFocus": function onFocus() {
          return _onFocus('addressDetail');
        },
        "onInput": onChangeDetail,
        "onSelect-search": function onSelectSearch(event) {
          emit('select-search', event);
        }
      }, null), props.showPostal && _withDirectives(_createVNode(Field, {
        "modelValue": data.postalCode,
        "onUpdate:modelValue": function onUpdateModelValue($event) {
          return data.postalCode = $event;
        },
        "type": "tel",
        "maxlength": "6",
        "label": t('postal'),
        "placeholder": t('postal'),
        "errorMessage": errorInfo.postalCode,
        "onFocus": function onFocus() {
          return _onFocus('postalCode');
        }
      }, null), [[_vShow, !hideBottomFields.value]]), slots.default == null ? void 0 : slots.default()]), renderSetDefaultCell(), _withDirectives(_createVNode("div", {
        "class": bem('buttons')
      }, [_createVNode(Button, {
        "block": true,
        "round": true,
        "loading": props.isSaving,
        "type": "danger",
        "text": props.saveButtonText || t('save'),
        "onClick": onSave
      }, null), props.showDelete && _createVNode(Button, {
        "block": true,
        "round": true,
        "loading": props.isDeleting,
        "text": props.deleteButtonText || t('delete'),
        "onClick": onDelete
      }, null)]), [[_vShow, !hideBottomFields.value]]), _createVNode(Popup, {
        "show": state.showAreaPopup,
        "onUpdate:show": function onUpdateShow($event) {
          return state.showAreaPopup = $event;
        },
        "round": true,
        "teleport": "body",
        "position": "bottom",
        "lazyRender": false
      }, _isSlot(_slot = _createVNode(Area, {
        "ref": areaRef,
        "value": data.areaCode,
        "loading": !areaListLoaded.value,
        "areaList": props.areaList,
        "columnsPlaceholder": props.areaColumnsPlaceholder,
        "onConfirm": onAreaConfirm,
        "onCancel": function onCancel() {
          state.showAreaPopup = false;
        }
      }, null)) ? _slot : {
        default: function _default() {
          return [_slot];
        }
      })]);
    };
  }
});