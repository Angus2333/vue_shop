import { createVNode as _createVNode } from "vue";
import { computed } from 'vue';
import { createNamespace } from '../utils';
import { BORDER } from '../utils/constant';
import { STEPS_KEY } from '../steps';
import { useParent } from '@vant/use';
import Icon from '../icon';

var _createNamespace = createNamespace('step'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

export default createComponent({
  setup: function setup(props, _ref) {
    var slots = _ref.slots;

    var _useParent = useParent(STEPS_KEY),
        parent = _useParent.parent,
        index = _useParent.index;

    var getStatus = function getStatus() {
      var active = +parent.props.active;

      if (index.value < active) {
        return 'finish';
      }

      if (index.value === active) {
        return 'process';
      }
    };

    var isActive = function isActive() {
      return getStatus() === 'process';
    };

    var lineStyle = computed(function () {
      var _parent$props = parent.props,
          activeColor = _parent$props.activeColor,
          inactiveColor = _parent$props.inactiveColor;

      if (getStatus() === 'finish') {
        return {
          background: activeColor
        };
      }

      return {
        background: inactiveColor
      };
    });
    var titleStyle = computed(function () {
      var _parent$props2 = parent.props,
          activeColor = _parent$props2.activeColor,
          inactiveColor = _parent$props2.inactiveColor;

      if (isActive()) {
        return {
          color: activeColor
        };
      }

      if (!getStatus()) {
        return {
          color: inactiveColor
        };
      }
    });

    var onClickStep = function onClickStep() {
      parent.emit('click-step', index.value);
    };

    var renderCircle = function renderCircle() {
      var _parent$props3 = parent.props,
          activeIcon = _parent$props3.activeIcon,
          activeColor = _parent$props3.activeColor,
          inactiveIcon = _parent$props3.inactiveIcon;

      if (isActive()) {
        if (slots['active-icon']) {
          return slots['active-icon']();
        }

        return _createVNode(Icon, {
          "class": bem('icon', 'active'),
          "name": activeIcon,
          "color": activeColor
        }, null);
      }

      if (slots['inactive-icon']) {
        return slots['inactive-icon']();
      }

      if (inactiveIcon) {
        return _createVNode(Icon, {
          "class": bem('icon'),
          "name": inactiveIcon
        }, null);
      }

      return _createVNode("i", {
        "class": bem('circle'),
        "style": lineStyle.value
      }, null);
    };

    return function () {
      var _ref2;

      var direction = parent.props.direction;
      var status = getStatus();
      return _createVNode("div", {
        "class": [BORDER, bem([direction, (_ref2 = {}, _ref2[status] = status, _ref2)])]
      }, [_createVNode("div", {
        "class": bem('title', {
          active: isActive()
        }),
        "style": titleStyle.value,
        "onClick": onClickStep
      }, [slots.default == null ? void 0 : slots.default()]), _createVNode("div", {
        "class": bem('circle-container'),
        "onClick": onClickStep
      }, [renderCircle()]), _createVNode("div", {
        "class": bem('line'),
        "style": lineStyle.value
      }, null)]);
    };
  }
});