"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _shared = require("./shared");

var _utils = require("../utils");

var _constant = require("../utils/constant");

var _use = require("@vant/use");

var _useExpose = require("../composables/use-expose");

var _loading = _interopRequireDefault(require("../loading"));

var _PickerColumn = _interopRequireDefault(require("./PickerColumn"));

// Utils
// Composition
// Components
var _createNamespace = (0, _utils.createNamespace)('picker'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var _default2 = createComponent({
  props: (0, _extends2.default)({}, _shared.pickerProps, {
    columnsFieldNames: Object,
    columns: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    defaultIndex: {
      type: [Number, String],
      default: 0
    },
    toolbarPosition: {
      type: String,
      default: 'top'
    },
    valueKey: {
      type: String,
      default: 'text'
    }
  }),
  emits: ['confirm', 'cancel', 'change'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit,
        slots = _ref.slots;
    var formattedColumns = (0, _vue.ref)([]);

    var _text$values$children = (0, _extends2.default)({
      text: props.valueKey,
      // 向下兼容
      values: 'values',
      children: 'children'
    }, props.columnsFieldNames || {}),
        textKey = _text$values$children.text,
        valuesKey = _text$values$children.values,
        childrenKey = _text$values$children.children;

    var _useChildren = (0, _use.useChildren)(_shared.PICKER_KEY),
        children = _useChildren.children,
        linkChildren = _useChildren.linkChildren;

    linkChildren();
    var itemHeight = (0, _vue.computed)(function () {
      return (0, _utils.unitToPx)(props.itemHeight);
    });
    var dataType = (0, _vue.computed)(function () {
      var columns = props.columns;
      var firstColumn = columns[0] || {};

      if (firstColumn[childrenKey]) {
        return 'cascade';
      }

      if (firstColumn[valuesKey]) {
        return 'object';
      }

      return 'text';
    });

    var formatCascade = function formatCascade() {
      var _cursor;

      var formatted = [];
      var cursor = (_cursor = {}, _cursor[childrenKey] = props.columns, _cursor);

      while (cursor && cursor[childrenKey]) {
        var _cursor$defaultIndex, _formatted$push;

        var _children = cursor[childrenKey];
        var defaultIndex = (_cursor$defaultIndex = cursor.defaultIndex) != null ? _cursor$defaultIndex : +props.defaultIndex;

        while (_children[defaultIndex] && _children[defaultIndex].disabled) {
          if (defaultIndex < _children.length - 1) {
            defaultIndex++;
          } else {
            defaultIndex = 0;
            break;
          }
        }

        formatted.push((_formatted$push = {}, _formatted$push[valuesKey] = cursor[childrenKey], _formatted$push.className = cursor.className, _formatted$push.defaultIndex = defaultIndex, _formatted$push));
        cursor = _children[defaultIndex];
      }

      formattedColumns.value = formatted;
    };

    var format = function format() {
      var columns = props.columns;

      if (dataType.value === 'text') {
        var _ref2;

        formattedColumns.value = [(_ref2 = {}, _ref2[valuesKey] = columns, _ref2)];
      } else if (dataType.value === 'cascade') {
        formatCascade();
      } else {
        formattedColumns.value = columns;
      }
    }; // get indexes of all columns


    var getIndexes = function getIndexes() {
      return children.map(function (child) {
        return child.state.index;
      });
    }; // set options of column by index


    var setColumnValues = function setColumnValues(index, options) {
      var column = children[index];

      if (column) {
        column.setOptions(options);
      }
    };

    var onCascadeChange = function onCascadeChange(columnIndex) {
      var _cursor2;

      var cursor = (_cursor2 = {}, _cursor2[childrenKey] = props.columns, _cursor2);
      var indexes = getIndexes();

      for (var i = 0; i <= columnIndex; i++) {
        cursor = cursor[childrenKey][indexes[i]];
      }

      while (cursor && cursor[childrenKey]) {
        columnIndex++;
        setColumnValues(columnIndex, cursor[childrenKey]);
        cursor = cursor[childrenKey][cursor.defaultIndex || 0];
      }
    }; // get column instance by index


    var getColumn = function getColumn(index) {
      return children[index];
    }; // get column value by index


    var getColumnValue = function getColumnValue(index) {
      var column = getColumn(index);
      return column && column.getValue();
    }; // set column value by index


    var setColumnValue = function setColumnValue(index, value) {
      var column = getColumn(index);

      if (column) {
        column.setValue(value);

        if (dataType.value === 'cascade') {
          onCascadeChange(index);
        }
      }
    }; // get column option index by column index


    var getColumnIndex = function getColumnIndex(index) {
      return (getColumn(index) || {}).state.index;
    }; // set column option index by column index


    var setColumnIndex = function setColumnIndex(columnIndex, optionIndex) {
      var column = getColumn(columnIndex);

      if (column) {
        column.setIndex(optionIndex);

        if (props.dataType === 'cascade') {
          onCascadeChange(columnIndex);
        }
      }
    }; // get options of column by index


    var getColumnValues = function getColumnValues(index) {
      return (children[index] || {}).state.options;
    }; // get values of all columns


    var getValues = function getValues() {
      return children.map(function (child) {
        return child.getValue();
      });
    }; // set values of all columns


    var setValues = function setValues(values) {
      values.forEach(function (value, index) {
        setColumnValue(index, value);
      });
    }; // set indexes of all columns


    var setIndexes = function setIndexes(indexes) {
      indexes.forEach(function (optionIndex, columnIndex) {
        setColumnIndex(columnIndex, optionIndex);
      });
    };

    var emitAction = function emitAction(event) {
      if (dataType.value === 'text') {
        emit(event, getColumnValue(0), getColumnIndex(0));
      } else {
        emit(event, getValues(), getIndexes());
      }
    };

    var _onChange = function onChange(columnIndex) {
      if (dataType.value === 'cascade') {
        onCascadeChange(columnIndex);
      }

      if (dataType.value === 'text') {
        emit('change', getColumnValue(0), getColumnIndex(0));
      } else {
        emit('change', getValues(), columnIndex);
      }
    };

    var confirm = function confirm() {
      children.forEach(function (child) {
        return child.stopMomentum();
      });
      emitAction('confirm');
    };

    var cancel = function cancel() {
      emitAction('cancel');
    };

    var renderTitle = function renderTitle() {
      if (slots.title) {
        return slots.title();
      }

      if (props.title) {
        return (0, _vue.createVNode)("div", {
          "class": [bem('title'), 'van-ellipsis']
        }, [props.title]);
      }
    };

    var renderCancel = function renderCancel() {
      var text = props.cancelButtonText || t('cancel');
      return (0, _vue.createVNode)("button", {
        "type": "button",
        "class": bem('cancel'),
        "onClick": cancel
      }, [slots.cancel ? slots.cancel() : text]);
    };

    var renderConfirm = function renderConfirm() {
      var text = props.confirmButtonText || t('confirm');
      return (0, _vue.createVNode)("button", {
        "type": "button",
        "class": bem('confirm'),
        "onClick": confirm
      }, [slots.confirm ? slots.confirm() : text]);
    };

    var renderToolbar = function renderToolbar() {
      if (props.showToolbar) {
        return (0, _vue.createVNode)("div", {
          "class": bem('toolbar')
        }, [slots.default ? slots.default() : [renderCancel(), renderTitle(), renderConfirm()]]);
      }
    };

    var renderColumnItems = function renderColumnItems() {
      return formattedColumns.value.map(function (item, columnIndex) {
        var _item$defaultIndex;

        return (0, _vue.createVNode)(_PickerColumn.default, {
          "textKey": textKey,
          "readonly": props.readonly,
          "allowHtml": props.allowHtml,
          "className": item.className,
          "itemHeight": itemHeight.value,
          "defaultIndex": (_item$defaultIndex = item.defaultIndex) != null ? _item$defaultIndex : +props.defaultIndex,
          "swipeDuration": props.swipeDuration,
          "visibleItemCount": props.visibleItemCount,
          "initialOptions": item[valuesKey],
          "onChange": function onChange() {
            _onChange(columnIndex);
          }
        }, {
          option: slots.option
        });
      });
    };

    var renderColumns = function renderColumns() {
      var wrapHeight = itemHeight.value * props.visibleItemCount;
      var frameStyle = {
        height: itemHeight.value + "px"
      };
      var columnsStyle = {
        height: wrapHeight + "px"
      };
      var maskStyle = {
        backgroundSize: "100% " + (wrapHeight - itemHeight.value) / 2 + "px"
      };
      return (0, _vue.createVNode)("div", {
        "class": bem('columns'),
        "style": columnsStyle,
        "onTouchmove": _utils.preventDefault
      }, [renderColumnItems(), (0, _vue.createVNode)("div", {
        "class": bem('mask'),
        "style": maskStyle
      }, null), (0, _vue.createVNode)("div", {
        "class": [_constant.BORDER_UNSET_TOP_BOTTOM, bem('frame')],
        "style": frameStyle
      }, null)]);
    };

    (0, _vue.watch)(function () {
      return props.columns;
    }, format, {
      immediate: true
    });
    (0, _useExpose.useExpose)({
      confirm: confirm,
      getValues: getValues,
      setValues: setValues,
      getIndexes: getIndexes,
      setIndexes: setIndexes,
      getColumnIndex: getColumnIndex,
      setColumnIndex: setColumnIndex,
      getColumnValue: getColumnValue,
      setColumnValue: setColumnValue,
      getColumnValues: getColumnValues,
      setColumnValues: setColumnValues
    });
    return function () {
      var _slots$columnsTop, _slots$columnsBottom;

      return (0, _vue.createVNode)("div", {
        "class": bem()
      }, [props.toolbarPosition === 'top' ? renderToolbar() : null, props.loading ? (0, _vue.createVNode)(_loading.default, {
        "class": bem('loading')
      }, null) : null, (_slots$columnsTop = slots['columns-top']) == null ? void 0 : _slots$columnsTop.call(slots), renderColumns(), (_slots$columnsBottom = slots['columns-bottom']) == null ? void 0 : _slots$columnsBottom.call(slots), props.toolbarPosition === 'bottom' ? renderToolbar() : null]);
    };
  }
});

exports.default = _default2;