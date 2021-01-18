import { createVNode as _createVNode } from "vue";
import { mergeProps as _mergeProps } from "vue";
import { resolveDirective as _resolveDirective } from "vue";
import _extends from "@babel/runtime/helpers/esm/extends";
import { ref, watch, computed, reactive, nextTick, onMounted } from 'vue';
import { createNamespace, pick } from '../utils';
import { useExpose } from '../composables/use-expose';
import { pickerProps } from '../picker/shared';
import Picker from '../picker';

var _createNamespace = createNamespace('area'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var EMPTY_CODE = '000000';

function isOverseaCode(code) {
  return code[0] === '9';
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default createComponent({
  props: _extends({}, pickerProps, {
    value: String,
    areaList: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    columnsNum: {
      type: [Number, String],
      default: 3
    },
    isOverseaCode: {
      type: Function,
      default: isOverseaCode
    },
    columnsPlaceholder: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  }),
  emits: ['change', 'confirm'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var pickerRef = ref();
    var state = reactive({
      code: props.value,
      columns: [{
        values: []
      }, {
        values: []
      }, {
        values: []
      }]
    });
    var areaList = computed(function () {
      var areaList = props.areaList;
      return {
        province: areaList.province_list || {},
        city: areaList.city_list || {},
        county: areaList.county_list || {}
      };
    });
    var placeholderMap = computed(function () {
      var columnsPlaceholder = props.columnsPlaceholder;
      return {
        province: columnsPlaceholder[0] || '',
        city: columnsPlaceholder[1] || '',
        county: columnsPlaceholder[2] || ''
      };
    });

    var getDefaultCode = function getDefaultCode() {
      if (props.columnsPlaceholder.length) {
        return EMPTY_CODE;
      }

      var _areaList$value = areaList.value,
          county = _areaList$value.county,
          city = _areaList$value.city;
      var countyCodes = Object.keys(county);

      if (countyCodes[0]) {
        return countyCodes[0];
      }

      var cityCodes = Object.keys(city);

      if (cityCodes[0]) {
        return cityCodes[0];
      }

      return '';
    }; // get list by code


    var getList = function getList(type, code) {
      var result = [];

      if (type !== 'province' && !code) {
        return result;
      }

      var list = areaList.value[type];
      result = Object.keys(list).map(function (listCode) {
        return {
          code: listCode,
          name: list[listCode]
        };
      });

      if (code) {
        // oversea code
        if (type === 'city' && props.isOverseaCode(code)) {
          code = '9';
        }

        result = result.filter(function (item) {
          return item.code.indexOf(code) === 0;
        });
      }

      if (placeholderMap.value[type] && result.length) {
        // set columns placeholder
        var codeFill = '';

        if (type === 'city') {
          codeFill = EMPTY_CODE.slice(2, 4);
        } else if (type === 'county') {
          codeFill = EMPTY_CODE.slice(4, 6);
        }

        result.unshift({
          code: code + codeFill,
          name: placeholderMap.value[type]
        });
      }

      return result;
    }; // get index by code


    var getIndex = function getIndex(type, code) {
      var compareNum = type === 'province' ? 2 : type === 'city' ? 4 : 6;
      var list = getList(type, code.slice(0, compareNum - 2)); // oversea code

      if (props.isOverseaCode(code) && type === 'province') {
        compareNum = 1;
      }

      code = code.slice(0, compareNum);

      for (var i = 0; i < list.length; i++) {
        if (list[i].code.slice(0, compareNum) === code) {
          return i;
        }
      }

      return 0;
    };

    var setValues = function setValues() {
      var code = state.code;

      if (!code) {
        code = getDefaultCode();
      }

      var picker = pickerRef.value;
      var province = getList('province');
      var city = getList('city', code.slice(0, 2));

      if (!picker) {
        return;
      }

      picker.setColumnValues(0, province);
      picker.setColumnValues(1, city);

      if (city.length && code.slice(2, 4) === '00' && !props.isOverseaCode(code)) {
        code = city[0].code;
      }

      picker.setColumnValues(2, getList('county', code.slice(0, 4)));
      picker.setIndexes([getIndex('province', code), getIndex('city', code), getIndex('county', code)]);
    }; // parse output columns data


    var parseValues = function parseValues(values) {
      return values.map(function (value, index) {
        if (value) {
          value = clone(value);

          if (!value.code || value.name === props.columnsPlaceholder[index]) {
            value.code = '';
            value.name = '';
          }
        }

        return value;
      });
    };

    var getValues = function getValues() {
      if (pickerRef.value) {
        var values = pickerRef.value.getValues().filter(function (value) {
          return !!value;
        });
        return parseValues(values);
      }

      return [];
    };

    var getArea = function getArea() {
      var values = getValues();
      var area = {
        code: '',
        country: '',
        province: '',
        city: '',
        county: ''
      };

      if (!values.length) {
        return area;
      }

      var names = values.map(function (item) {
        return item.name;
      });
      var validValues = values.filter(function (value) {
        return !!value.code;
      });
      area.code = validValues.length ? validValues[validValues.length - 1].code : '';

      if (props.isOverseaCode(area.code)) {
        area.country = names[1] || '';
        area.province = names[2] || '';
      } else {
        area.province = names[0] || '';
        area.city = names[1] || '';
        area.county = names[2] || '';
      }

      return area;
    };

    var reset = function reset(newCode) {
      if (newCode === void 0) {
        newCode = '';
      }

      state.code = newCode;
      setValues();
    };

    var onChange = function onChange(values, index) {
      state.code = values[index].code;
      setValues();
      var parsedValues = parseValues(pickerRef.value.getValues());
      emit('change', parsedValues, index);
    };

    var onConfirm = function onConfirm(values, index) {
      setValues();
      emit('confirm', parseValues(values), index);
    };

    onMounted(setValues);
    watch(function () {
      return props.value;
    }, function (value) {
      state.code = value;
      setValues();
    });
    watch(function () {
      return props.areaList;
    }, setValues, {
      deep: true
    });
    watch(function () {
      return props.columnsNum;
    }, function () {
      nextTick(setValues);
    });
    useExpose({
      reset: reset,
      getArea: getArea
    });
    return function () {
      var columns = state.columns.slice(0, +props.columnsNum);
      return _createVNode(Picker, _mergeProps({
        "ref": pickerRef,
        "class": bem(),
        "columns": columns,
        "valueKey": "name",
        "onChange": onChange,
        "onConfirm": onConfirm
      }, pick(props, ['title', 'loading', 'readonly', 'itemHeight', 'swipeDuration', 'visibleItemCount', 'cancelButtonText', 'confirmButtonText'])), _extends({}, pick(slots, ['title', 'columns-top', 'columns-bottom'])));
    };
  }
});