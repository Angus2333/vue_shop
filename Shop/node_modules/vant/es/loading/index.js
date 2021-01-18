import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { computed } from 'vue';
import { createNamespace, addUnit, getSizeStyle } from '../utils';

var _createNamespace = createNamespace('loading'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var SpinIcon = [];

for (var i = 0; i < 12; i++) {
  SpinIcon.push(_createVNode("i", null, null));
}

var CircularIcon = _createVNode("svg", {
  "class": bem('circular'),
  "viewBox": "25 25 50 50"
}, [_createVNode("circle", {
  "cx": "50",
  "cy": "50",
  "r": "20",
  "fill": "none"
}, null)]);

export default createComponent({
  props: {
    size: [Number, String],
    color: String,
    vertical: Boolean,
    textSize: [Number, String],
    textColor: String,
    type: {
      type: String,
      default: 'circular'
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots;
    var spinnerStyle = computed(function () {
      return _extends({
        color: props.color
      }, getSizeStyle(props.size));
    });

    var renderText = function renderText() {
      if (slots.default) {
        var _props$textColor;

        return _createVNode("span", {
          "class": bem('text'),
          "style": {
            fontSize: addUnit(props.textSize),
            color: (_props$textColor = props.textColor) != null ? _props$textColor : props.color
          }
        }, [slots.default()]);
      }
    };

    return function () {
      var type = props.type,
          vertical = props.vertical;
      return _createVNode("div", {
        "class": bem([type, {
          vertical: vertical
        }])
      }, [_createVNode("span", {
        "class": bem('spinner', type),
        "style": spinnerStyle.value
      }, [type === 'spinner' ? SpinIcon : CircularIcon]), renderText()]);
    };
  }
});