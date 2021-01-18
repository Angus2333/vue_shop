"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _tab = _interopRequireDefault(require("../tab"));

var _tabs = _interopRequireDefault(require("../tabs"));

var _icon = _interopRequireDefault(require("../icon"));

// Components
function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !(0, _vue.isVNode)(s);
}

var _createNamespace = (0, _utils.createNamespace)('cascader'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

var _default2 = createComponent({
  props: {
    title: String,
    modelValue: [Number, String],
    placeholder: String,
    activeColor: String,
    options: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    closeable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close', 'change', 'finish', 'update:modelValue'],
  setup: function setup(props, _ref) {
    var slots = _ref.slots,
        emit = _ref.emit;
    var state = (0, _vue.reactive)({
      tabs: [],
      activeTab: 0
    });

    var getSelectedOptionsByValue = function getSelectedOptionsByValue(options, value) {
      for (var i = 0; i < options.length; i++) {
        var option = options[i];

        if (option.value === value) {
          return [option];
        }

        if (option.children) {
          var selectedOptions = getSelectedOptionsByValue(option.children, value);

          if (selectedOptions) {
            return [option].concat(selectedOptions);
          }
        }
      }
    };

    var updateTabs = function updateTabs() {
      if (props.modelValue || props.modelValue === 0) {
        var selectedOptions = getSelectedOptionsByValue(props.options, props.modelValue);

        if (selectedOptions) {
          var optionsCursor = props.options;
          state.tabs = selectedOptions.map(function (option) {
            var tab = {
              options: optionsCursor,
              selectedOption: option
            };
            var next = optionsCursor.filter(function (item) {
              return item.value === option.value;
            });

            if (next.length) {
              optionsCursor = next[0].children;
            }

            return tab;
          });

          if (optionsCursor) {
            state.tabs.push({
              options: optionsCursor,
              selectedOption: null
            });
          }

          (0, _vue.nextTick)(function () {
            state.activeTab = state.tabs.length - 1;
          });
          return;
        }
      }

      state.tabs = [{
        options: props.options,
        selectedOption: null
      }];
    };

    var onSelect = function onSelect(option, tabIndex) {
      state.tabs[tabIndex].selectedOption = option;

      if (state.tabs.length > tabIndex + 1) {
        state.tabs = state.tabs.slice(0, tabIndex + 1);
      }

      if (option.children) {
        var nextTab = {
          options: option.children,
          selectedOption: null
        };

        if (state.tabs[tabIndex + 1]) {
          state.tabs[tabIndex + 1] = nextTab;
        } else {
          state.tabs.push(nextTab);
        }

        (0, _vue.nextTick)(function () {
          state.activeTab++;
        });
      }

      var selectedOptions = state.tabs.map(function (tab) {
        return tab.selectedOption;
      }).filter(function (item) {
        return !!item;
      });
      var eventParams = {
        value: option.value,
        tabIndex: tabIndex,
        selectedOptions: selectedOptions
      };
      emit('update:modelValue', option.value);
      emit('change', eventParams);

      if (!option.children) {
        emit('finish', eventParams);
      }
    };

    var onClose = function onClose() {
      emit('close');
    };

    var renderHeader = function renderHeader() {
      return (0, _vue.createVNode)("div", {
        "class": bem('header')
      }, [(0, _vue.createVNode)("h2", {
        "class": bem('title')
      }, [slots.title ? slots.title() : props.title]), props.closeable ? (0, _vue.createVNode)(_icon.default, {
        "name": "cross",
        "class": bem('close-icon'),
        "onClick": onClose
      }, null) : null]);
    };

    var renderOptions = function renderOptions(options, selectedOption, tabIndex) {
      var renderOption = function renderOption(option) {
        var isSelected = selectedOption && option.value === selectedOption.value;
        return (0, _vue.createVNode)("li", {
          "class": bem('option', {
            selected: isSelected
          }),
          "style": {
            color: isSelected ? props.activeColor : null
          },
          "onClick": function onClick() {
            onSelect(option, tabIndex);
          }
        }, [(0, _vue.createVNode)("span", null, [option.text]), isSelected ? (0, _vue.createVNode)(_icon.default, {
          "name": "success",
          "class": bem('selected-icon')
        }, null) : null]);
      };

      return (0, _vue.createVNode)("ul", {
        "class": bem('options')
      }, [options.map(renderOption)]);
    };

    var renderTab = function renderTab(item, tabIndex) {
      var _slot;

      var options = item.options,
          selectedOption = item.selectedOption;
      var title = selectedOption ? selectedOption.text : props.placeholder || t('select');
      return (0, _vue.createVNode)(_tab.default, {
        "title": title,
        "titleClass": bem('tab', {
          unselected: !selectedOption
        })
      }, _isSlot(_slot = renderOptions(options, selectedOption, tabIndex)) ? _slot : {
        default: function _default() {
          return [_slot];
        }
      });
    };

    var renderTabs = function renderTabs() {
      var _slot2;

      return (0, _vue.createVNode)(_tabs.default, {
        "active": state.activeTab,
        "onUpdate:active": function onUpdateActive($event) {
          return state.activeTab = $event;
        },
        "animated": true,
        "swipeable": true,
        "swipeThreshold": 0,
        "class": bem('tabs'),
        "color": props.activeColor
      }, _isSlot(_slot2 = state.tabs.map(renderTab)) ? _slot2 : {
        default: function _default() {
          return [_slot2];
        }
      });
    };

    updateTabs();
    (0, _vue.watch)(function () {
      return props.options;
    }, updateTabs, {
      deep: true
    });
    (0, _vue.watch)(function () {
      return props.modelValue;
    }, function (value) {
      if (value || value === 0) {
        var values = state.tabs.map(function (tab) {
          var _tab$selectedOption;

          return (_tab$selectedOption = tab.selectedOption) == null ? void 0 : _tab$selectedOption.value;
        });

        if (values.indexOf(value) !== -1) {
          return;
        }
      }

      updateTabs();
    });
    return function () {
      return (0, _vue.createVNode)("div", {
        "class": bem()
      }, [renderHeader(), renderTabs()]);
    };
  }
});

exports.default = _default2;