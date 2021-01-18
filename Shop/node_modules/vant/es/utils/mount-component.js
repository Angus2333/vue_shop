import _extends from "@babel/runtime/helpers/esm/extends";
import { createApp, reactive, nextTick } from 'vue';
import { useExpose } from '../composables/use-expose';
export function usePopupState() {
  var state = reactive({
    show: false
  });

  var toggle = function toggle(show) {
    state.show = show;
  };

  var open = function open(props) {
    _extends(state, props);

    nextTick(function () {
      toggle(true);
    });
  };

  var close = function close() {
    toggle(false);
  };

  useExpose({
    open: open,
    close: close,
    toggle: toggle
  });
  return {
    open: open,
    close: close,
    state: state,
    toggle: toggle
  };
}
export function mountComponent(RootComponent) {
  var app = createApp(RootComponent);
  var root = document.createElement('div');
  document.body.appendChild(root);
  return {
    instance: app.mount(root),
    unmount: function unmount() {
      app.unmount(root);
      document.body.removeChild(root);
    }
  };
}