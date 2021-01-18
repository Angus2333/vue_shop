import { createVNode as _createVNode } from "vue";
import { isVNode as _isVNode } from "vue";
import { ref, watch, computed, nextTick, reactive, onMounted } from 'vue';
import { createNamespace, addUnit } from '../utils';
import { useExpose } from '../composables/use-expose';

function _isSlot(s) {
  return typeof s === 'function' || Object.prototype.toString.call(s) === '[object Object]' && !_isVNode(s);
}

var _createNamespace = createNamespace('progress'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  props: {
    color: String,
    inactive: Boolean,
    pivotText: String,
    textColor: String,
    pivotColor: String,
    trackColor: String,
    strokeWidth: [Number, String],
    percentage: {
      type: [Number, String],
      required: true,
      validator: function validator(value) {
        return value >= 0 && value <= 100;
      }
    },
    showPivot: {
      type: Boolean,
      default: true
    }
  },
  setup: function setup(props) {
    var root = ref();
    var pivotRef = ref();
    var state = reactive({
      rootWidth: 0,
      pivotWidth: 0
    });
    var background = computed(function () {
      return props.inactive ? '#cacaca' : props.color;
    });

    var resize = function resize() {
      nextTick(function () {
        state.rootWidth = root.value ? root.value.offsetWidth : 0;
        state.pivotWidth = pivotRef.value ? pivotRef.value.offsetWidth : 0;
      });
    };

    var renderPivot = function renderPivot() {
      var rootWidth = state.rootWidth,
          pivotWidth = state.pivotWidth;
      var textColor = props.textColor,
          pivotText = props.pivotText,
          pivotColor = props.pivotColor,
          percentage = props.percentage;
      var text = pivotText != null ? pivotText : percentage + "%";
      var show = props.showPivot && text;

      if (show) {
        var left = (rootWidth - pivotWidth) * +percentage / 100;
        var style = {
          color: textColor,
          left: left + "px",
          background: pivotColor || background.value
        };
        return _createVNode("span", {
          "ref": pivotRef,
          "style": style,
          "class": bem('pivot')
        }, _isSlot(text) ? text : {
          default: function _default() {
            return [text];
          }
        });
      }
    };

    watch([function () {
      return props.showPivot;
    }, function () {
      return props.pivotText;
    }], resize);
    onMounted(resize);
    useExpose({
      resize: resize
    });
    return function () {
      var trackColor = props.trackColor,
          percentage = props.percentage,
          strokeWidth = props.strokeWidth;
      var rootStyle = {
        background: trackColor,
        height: addUnit(strokeWidth)
      };
      var portionStyle = {
        background: background.value,
        width: state.rootWidth * +percentage / 100 + 'px'
      };
      return _createVNode("div", {
        "ref": root,
        "class": bem(),
        "style": rootStyle
      }, [_createVNode("span", {
        "class": bem('portion'),
        "style": portionStyle
      }, [renderPivot()])]);
    };
  }
});