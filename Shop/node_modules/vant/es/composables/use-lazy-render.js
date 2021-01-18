import { ref, watch } from 'vue';
export function useLazyRender(show) {
  var inited = ref(false);
  watch(show, function (value) {
    if (value) {
      inited.value = value;
    }
  }, {
    immediate: true
  });
  return function (render) {
    return function () {
      return inited.value ? render() : null;
    };
  };
}